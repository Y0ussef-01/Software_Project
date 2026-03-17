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

  const getSelectedGroupName = () => {
    const group = teacherGroups.find((g) => g.id === selectedGroup);
    return group ? group.name : "Unknown Lecture";
  };

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
        { params: { sessionNumber: filterSessionNumber.trim() } },
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
        error.response?.data?.message || "Failed to fetch attendance data",
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
    if (!selectedGroup) return;     

    setLoadingSummary(true);
    try {
      let allData = [];
      let currentSessionToFetch = 1;
      let hasMoreSessions = true;
      let maxSession = 0;

      while (hasMoreSessions) {
        try {
          const response = await axiosInstance.get(
            `/teacher/attendance/${selectedGroup}`,
            { params: { sessionNumber: currentSessionToFetch } },
          );

          if (response.data && response.data.length > 0) {
            allData = [...allData, ...response.data];
            maxSession = currentSessionToFetch;
            currentSessionToFetch++;
          } else {
            hasMoreSessions = false;
          }
        } catch (err) {
          hasMoreSessions = false;
        }
      }

      if (allData.length === 0 || maxSession === 0) {
        setLoadingSummary(false);
        return;
      }

      const lectureName = getSelectedGroupName();

      const studentMap = {};
      allData.forEach((record) => {
        const studentInfo = record.student;
        if (!studentInfo) return;

        const sId = studentInfo._id || "Unknown ID";
        const sName = studentInfo.name || "Unknown Name";

        if (!studentMap[sId]) {
          studentMap[sId] = { id: sId, name: sName, attendedCount: 0 };
        }
        studentMap[sId].attendedCount += 1;
      });

      const summaryData = Object.values(studentMap).map((student) => {
        const absenceCount = maxSession - student.attendedCount;
        const safeAbsenceCount = absenceCount < 0 ? 0 : absenceCount;
        const absencePercentage =
          maxSession > 0 ? (safeAbsenceCount / maxSession) * 100 : 0;
        const isDeprived = absencePercentage > 30;

        return {
          studentName: student.name,
          studentId: student.id,
          attended: student.attendedCount,
          absent: safeAbsenceCount,
          absencePercentageStr: `${absencePercentage.toFixed(1)}%`,
          status: isDeprived ? "Deprived" : "Safe",
          isDeprived: isDeprived,
        };
      });

      summaryData.sort((a, b) => a.studentId.localeCompare(b.studentId));

      if (type === "excel") {
        const excelExportData = summaryData.map((item) => ({
          "Student ID": item.studentId,
          "Student Name": item.studentName,
          Attended: item.attended,
          Absent: item.absent,
          "Absence %": item.absencePercentageStr,
          Status: item.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelExportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
        XLSX.writeFile(workbook, `Total_Summary_${selectedGroup}.xlsx`);
      } else if (type === "pdf") {
        const doc = new jsPDF();
        doc.text(`Comprehensive Attendance Summary`, 14, 15);
        doc.setFontSize(10);
        doc.text(`Lecture: ${lectureName}`, 14, 22);
        doc.text(`Total Sessions Given: ${maxSession}`, 14, 28);

        const tableColumn = [
          "Student ID",
          "Student Name",
          "Attended",
          "Absent",
          "Absence %",
          "Status",
        ];

        const tableRows = summaryData.map((row) => [
          row.studentId,
          row.studentName,
          row.attended,
          row.absent,
          row.absencePercentageStr,
          row.status,
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 35,
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
        doc.save(`Total_Summary_${selectedGroup}.pdf`);
      }

    } catch (error) {
      console.error("Summary Error:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  const displayedAttendance = attendanceList;

  const paginatedAttendance = displayedAttendance.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getSortedCurrentAttendance = () => {
    return [...displayedAttendance].sort((a, b) =>
      a.student._id.localeCompare(b.student._id),
    );
  };

  const handleExportExcel = () => {
    if (displayedAttendance.length === 0) return;

    const sortedData = getSortedCurrentAttendance();
    const excelData = sortedData.map((row) => ({
      "Student ID": row.student._id,
      "Student Name": row.student.name,
      "Session Number": row.sessionNumber,
      "Time Logged": new Date(row.timestamp).toLocaleTimeString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(
      workbook,
      `Attendance_${selectedGroup}_Session${filterSessionNumber}.xlsx`,
    );
  };

  const handleExportPDF = () => {
    if (displayedAttendance.length === 0) return;
    const lectureName = getSelectedGroupName();
    const doc = new jsPDF();

    doc.text(`Attendance Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Lecture: ${lectureName}`, 14, 22);
    doc.text(`Session: ${filterSessionNumber}`, 14, 28);

    const tableColumn = [
      "Student ID",
      "Student Name",
      "Session",
      "Time Logged",
    ];

    const sortedData = getSortedCurrentAttendance();
    const tableRows = sortedData.map((row) => [
      row.student._id,
      row.student.name,
      `Session ${row.sessionNumber}`,
      new Date(row.timestamp).toLocaleTimeString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
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
