import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const useViewAttendance = () => {
  const [teacherGroups, setTeacherGroups] = useState([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filterSessionNumber, setFilterSessionNumber] = useState("");

  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      setIsLoadingGroups(true);
      try {
        const response = await axiosInstance.get("/teacher/profile");
        const coursesData =
            response.data?.courses || response.data?.Teacher?.courses || [];

        const formattedGroups = coursesData
            .filter((item) => item?.group?.type?.toLowerCase() === "lecture")
            .map((item) => {
              if (item?.group?._id && item?.course?.name) {
                return {
                  id: String(item.group._id),
                  name: `${item.course.name} - ${item.group.groupName} (Lecture)`,
                };
              }
              return null;
            })
            .filter(Boolean);

        const uniqueGroups = Array.from(
            new Map(formattedGroups.map((item) => [item.id, item])).values()
        );

        setTeacherGroups(uniqueGroups);
      } catch (error) {
        toast.error("Failed to load your assigned courses.");
      } finally {
        setIsLoadingGroups(false);
      }
    };

    fetchTeacherProfile();
  }, []);

  const fetchAttendance = async () => {
    if (!selectedGroup) {
      toast.warning("Please select a lecture to view attendance");
      return;
    }

    if (!filterSessionNumber || filterSessionNumber.trim() === "") {
      toast.warning("Please enter a session number");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(
          `/teacher/attendance/${selectedGroup}`,
          { params: { sessionNumber: filterSessionNumber.trim() } }
      );

      if (!response.data || response.data.length === 0) {
        toast.info("No attendance records found.");
        setAttendanceList([]);
      } else {
        setAttendanceList(response.data);
        toast.success("Records fetched successfully.");
      }
    } catch (error) {
      toast.error(
          error.response?.data?.message || "Failed to fetch attendance data"
      );
      setAttendanceList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = async () => {
    setPage(0);
    await fetchAttendance();
  };

  const downloadSummary = async (type) => {
    if (!selectedGroup) {
      toast.warning("Please select a lecture first.");
      return;
    }

    if (!filterSessionNumber || filterSessionNumber.trim() === "") {
      toast.warning("Please enter a session number first.");
      return;
    }

    setLoadingSummary(true);
    try {
      const response = await axiosInstance.get(
          `/teacher/attendance/${selectedGroup}`,
          { params: { sessionNumber: filterSessionNumber.trim() } }
      );
      const rawData = response.data || [];

      if (rawData.length === 0) {
        toast.info("No attendance records found for this session.");
        return;
      }

      const summaryData = rawData.map((record) => ({
        "Student Name": record.student.name,
        "Student ID": record.student._id,
        "Session Number": record.sessionNumber,
        "Time Logged": new Date(record.timestamp).toLocaleTimeString(),
      }));

      if (type === "excel") {
        const worksheet = XLSX.utils.json_to_sheet(summaryData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(
            workbook,
            `Attendance_${selectedGroup}_Session${filterSessionNumber}.xlsx`
        );
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text(`Attendance Report - Session ${filterSessionNumber}`, 14, 15);

        const tableColumn = [
          "Student Name",
          "Student ID",
          "Session",
          "Time Logged",
        ];
        const tableRows = summaryData.map((row) => [
          row["Student Name"],
          row["Student ID"],
          row["Session Number"],
          row["Time Logged"],
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 25,
          theme: "grid",
          headStyles: { fillColor: [21, 43, 72] },
        });
        doc.save(
            `Attendance_${selectedGroup}_Session${filterSessionNumber}.pdf`
        );
      }

      toast.success(`Exported as ${type.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error("Failed to generate attendance report.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const displayedAttendance = attendanceList;

  const paginatedAttendance = displayedAttendance.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportExcel = () => {
    if (displayedAttendance.length === 0) return;
    const excelData = displayedAttendance.map((row) => ({
      "Student Name": row.student.name,
      "Student ID": row.student._id,
      "Session Number": row.sessionNumber,
      "Time Logged": new Date(row.timestamp).toLocaleTimeString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(
        workbook,
        `Attendance_${selectedGroup}_Session${filterSessionNumber}.xlsx`
    );
  };

  const handleExportPDF = () => {
    if (displayedAttendance.length === 0) return;
    const doc = new jsPDF();
    doc.text(`Attendance Report - Session ${filterSessionNumber}`, 14, 15);

    const tableColumn = [
      "Student Name",
      "Student ID",
      "Session",
      "Time Logged",
    ];
    const tableRows = displayedAttendance.map((row) => [
      row.student.name,
      row.student._id,
      `Session ${row.sessionNumber}`,
      new Date(row.timestamp).toLocaleTimeString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      headStyles: { fillColor: [21, 43, 72] },
    });
    doc.save(`Attendance_${selectedGroup}_Session${filterSessionNumber}.pdf`);
  };

  return {
    teacherGroups,
    isLoadingGroups,
    selectedGroup,
    setSelectedGroup,
    filterSessionNumber,
    setFilterSessionNumber,
    loading,
    handleSearchClick,
    displayedAttendance,
    paginatedAttendance,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleExportExcel,
    handleExportPDF,
    loadingSummary,
    downloadSummary,
  };
};