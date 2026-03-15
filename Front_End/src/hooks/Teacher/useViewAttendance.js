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
  const [selectedDate, setSelectedDate] = useState("");
  const [filterSessionNumber, setFilterSessionNumber] = useState("");
  const [appliedSessionFilter, setAppliedSessionFilter] = useState("");

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
          new Map(formattedGroups.map((item) => [item.id, item])).values(),
        );

        setTeacherGroups(uniqueGroups);
      } catch (error) {
        console.error("Profile Fetch Error:", error.response || error);
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

    setLoading(true);
    try {
      let url = `/teacher/attendance/${selectedGroup}`;
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }

      const response = await axiosInstance.get(url);

      if (!response.data || response.data.length === 0) {
        toast.info("No attendance records found for this date.");
        setAttendanceList([]);
      } else {
        setAttendanceList(response.data);
        toast.success("Records fetched successfully.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.info("No attendance records found for this date.");
        setAttendanceList([]);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch attendance data",
        );
        setAttendanceList([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = async () => {
    setAppliedSessionFilter(filterSessionNumber);
    setPage(0);
    await fetchAttendance();
  };

  const downloadSummary = async (type) => {
    if (!selectedGroup) {
      toast.warning("Please select a lecture first.");
      return;
    }

    setLoadingSummary(true);
    try {
      const response = await axiosInstance.get(
        `/teacher/attendance/${selectedGroup}`,
      );
      const rawData = response.data || [];

      if (rawData.length === 0) {
        toast.info("No attendance records found for this lecture.");
        return;
      }

      let maxSession = 0;
      rawData.forEach((record) => {
        if (record.sessionNumber > maxSession)
          maxSession = record.sessionNumber;
      });

      const studentMap = {};
      rawData.forEach((record) => {
        const sId = record.student._id;
        if (!studentMap[sId]) {
          studentMap[sId] = { id: sId, name: record.student.name, attended: 0 };
        }
        studentMap[sId].attended += 1;
      });

      const summaryData = Object.values(studentMap).map((s) => {
        const absenceCount = maxSession - s.attended;
        const absencePercentage =
          maxSession > 0 ? (absenceCount / maxSession) * 100 : 0;

        return {
          "Student Name": s.name,
          "Student ID": s.id,
          Attended: s.attended,
          Absent: absenceCount,
          "Absence %": `${absencePercentage.toFixed(1)}%`,
          Status: absencePercentage > 30 ? "Deprived" : "Safe",
        };
      });

      summaryData.sort((a, b) => {
        if (a.Status === b.Status)
          return a["Student Name"].localeCompare(b["Student Name"]);
        return a.Status === "Deprived" ? -1 : 1;
      });

      if (type === "excel") {
        const worksheet = XLSX.utils.json_to_sheet(summaryData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
        XLSX.writeFile(workbook, `Summary_${selectedGroup}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text(`Full Attendance Summary - ${selectedGroup}`, 14, 15);
        doc.setFontSize(10);
        doc.text(`Total Sessions Given: ${maxSession}`, 14, 22);

        const tableColumn = [
          "Student Name",
          "Student ID",
          "Attended",
          "Absent",
          "Absence %",
          "Status",
        ];
        const tableRows = summaryData.map((row) => [
          row["Student Name"],
          row["Student ID"],
          row["Attended"],
          row["Absent"],
          row["Absence %"],
          row["Status"],
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 28,
          theme: "grid",
          headStyles: { fillColor: [21, 43, 72] },
          didParseCell: function (data) {
            if (data.section === "body" && data.column.index === 5) {
              if (data.cell.raw === "Deprived") {
                data.cell.styles.textColor = [220, 38, 38];
                data.cell.styles.fontStyle = "bold";
              } else {
                data.cell.styles.textColor = [22, 163, 74];
              }
            }
          },
        });
        doc.save(`Summary_${selectedGroup}.pdf`);
      }

      toast.success(`Summary exported as ${type.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error("Failed to generate attendance summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const displayedAttendance = attendanceList.filter((row) => {
    if (!appliedSessionFilter) return true;
    return String(row.sessionNumber) === String(appliedSessionFilter);
  });

  const paginatedAttendance = displayedAttendance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
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
      Date: new Date(row.timestamp).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(
      workbook,
      `Attendance_${selectedGroup}_Session${appliedSessionFilter || "All"}.xlsx`,
    );
  };

  const handleExportPDF = () => {
    if (displayedAttendance.length === 0) return;
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${selectedGroup}`, 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Session: ${appliedSessionFilter || "All"} | Date: ${selectedDate || "All Time"}`,
      14,
      22,
    );

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
      startY: 28,
      theme: "grid",
      headStyles: { fillColor: [21, 43, 72] },
    });
    doc.save(
      `Attendance_${selectedGroup}_Session${appliedSessionFilter || "All"}.pdf`,
    );
  };

  return {
    teacherGroups,
    isLoadingGroups,
    selectedGroup,
    setSelectedGroup,
    selectedDate,
    setSelectedDate,
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
