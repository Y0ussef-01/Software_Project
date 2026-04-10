// ===== editgrade.tsx =====
import Entypo from '@expo/vector-icons/Entypo';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    RefreshControl,
    FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import API from '../api/axiosConfig';

interface Group {
    groupId: string;
    groupName: string;
}

interface Degree {
    title: string;
    label: string;
    score: number | null;
    outOf: number | null;
}

interface StudentGrade {
    studentId:   string;
    studentName: string;
    degrees:     Degree[];
    total:       number | null;
}

const EditGrade = () => {
    const { courseId, courseName } = useLocalSearchParams<{
        courseId: string;
        courseName: string;
    }>();

    const [groups,             setGroups]             = useState<Group[]>([]);
    const [selectedGroup,      setSelectedGroup]      = useState<Group | null>(null);
    const [loadingGroups,      setLoadingGroups]      = useState(true);
    const [groupPickerVisible, setGroupPickerVisible] = useState(false);

    const [allStudents,      setAllStudents]      = useState<StudentGrade[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<StudentGrade[]>([]);
    const [searchQuery,      setSearchQuery]      = useState('');
    const [loadingStudents,  setLoadingStudents]  = useState(false);
    const [refreshing,       setRefreshing]       = useState(false);

    const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null);
    const [modalVisible,    setModalVisible]    = useState(false);
    const [editedScores,    setEditedScores]    = useState<Record<string, string>>({});
    const [saving,          setSaving]          = useState(false);

    // ─── Fetch Groups ─────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                setLoadingGroups(true);
                const res = await API.get('/teacher/profile');
                const rawCourses: any[] = res.data?.courses || [];
                const seen = new Set<string>();
                const courseGroups: Group[] = [];
                rawCourses.forEach((c: any) => {
                    const cId = c.course?._id || c.course;
                    if (cId !== courseId) return;
                    const gId   = c.group?._id || c.group?.id || c.groupId || '';
                    const gName = c.group?.groupName || c.group?.name || c.groupName || gId;
                    if (gId && !seen.has(gId)) {
                        seen.add(gId);
                        courseGroups.push({ groupId: gId, groupName: gName });
                    }
                });
                setGroups(courseGroups);
            } catch (err: any) {
                Alert.alert('Error', err.response?.data?.message || 'Failed to load groups');
            } finally {
                setLoadingGroups(false);
            }
        })();
    }, [courseId]);

    // ─── Fetch Students ───────────────────────────────────────────────────────
    const fetchStudents = useCallback(async (isRefresh = false) => {
        if (!selectedGroup) return;
        try {
            if (!isRefresh) setLoadingStudents(true);
            const res = await API.get(`/teacher/grades/${courseId}`, {
                params: { groupId: selectedGroup.groupId },
            });
            const students: StudentGrade[] = res.data?.students || [];
            setAllStudents(students);
            applySearch(students, searchQuery);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to load students');
        } finally {
            setLoadingStudents(false);
            setRefreshing(false);
        }
    }, [selectedGroup, courseId]);

    useEffect(() => {
        if (selectedGroup) {
            setSearchQuery('');
            setAllStudents([]);
            setFilteredStudents([]);
            fetchStudents();
        }
    }, [selectedGroup]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchStudents(true);
    }, [fetchStudents]);

    // ─── Search ───────────────────────────────────────────────────────────────
    const applySearch = (students: StudentGrade[], query: string) => {
        if (!query.trim()) { setFilteredStudents(students); return; }
        const q = query.toLowerCase();
        setFilteredStudents(
            students.filter(s =>
                s.studentName?.toLowerCase().includes(q) ||
                s.studentId?.toLowerCase().includes(q)
            )
        );
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        applySearch(allStudents, text);
    };

    // ─── Open Edit Modal ──────────────────────────────────────────────────────
    const openEdit = (student: StudentGrade) => {
        setSelectedStudent(student);
        const scores: Record<string, string> = {};
        student.degrees.forEach(d => {
            scores[d.title] = d.score !== null && d.score !== undefined ? String(d.score) : '';
        });
        setEditedScores(scores);
        setModalVisible(true);
    };

    // ─── Validate ─────────────────────────────────────────────────────────────
    const getFieldError = (degree: Degree, value: string): string | null => {
        if (value === '' || value === null) return null;
        if (isNaN(Number(value)) || value.trim() === '') return 'Numbers only';
        const num = parseFloat(value);
        if (num < 0) return 'Cannot be negative';
        if (degree.outOf !== null && degree.outOf !== undefined && num > degree.outOf)
            return `Max is ${degree.outOf}`;
        return null;
    };

    // ─── هل في أي error في أي field دلوقتي؟ ─────────────────────────────────
    const hasAnyError = (): boolean => {
        if (!selectedStudent) return false;
        return selectedStudent.degrees.some(d => {
            const val = editedScores[d.title] ?? '';
            return getFieldError(d, val) !== null;
        });
    };

    // ─── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!selectedStudent) return;

        // ── تأكيد نهائي قبل الإرسال ──
        for (const d of selectedStudent.degrees) {
            const val = editedScores[d.title] ?? '';

            // 1. تحقق من الـ format
            if (val !== '' && (isNaN(Number(val)) || val.trim() === '')) {
                Alert.alert('❌ Invalid Grade', `${d.label}: Numbers only`);
                return;
            }

            if (val !== '') {
                const num = parseFloat(val);

                // 2. لا يقل عن صفر
                if (num < 0) {
                    Alert.alert('❌ Invalid Grade', `${d.label}: Cannot be negative`);
                    return;
                }

                // 3. لا يتجاوز الـ Max — الحماية الأساسية
                if (d.outOf !== null && d.outOf !== undefined && num > d.outOf) {
                    Alert.alert(
                        '❌ Invalid Grade',
                        `${d.label}: Max allowed is ${d.outOf}\nYou entered: ${num}`
                    );
                    return;
                }
            }
        }

        Alert.alert(
            'Confirm Edit',
            `Save grade changes for ${selectedStudent.studentName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Save',
                    onPress: async () => {
                        try {
                            setSaving(true);

                            const grades = selectedStudent.degrees.map(d => ({
                                title: d.title,
                                score: editedScores[d.title] === '' || editedScores[d.title] == null
                                    ? null
                                    : parseFloat(editedScores[d.title]),
                            }));

                            await API.patch(
                                `/teacher/grades/${courseId}/student/${selectedStudent.studentId}`,
                                { grades }
                            );

                            Alert.alert('✅ Success', 'Grades updated successfully.');
                            setModalVisible(false);

                            const updatedDegrees = selectedStudent.degrees.map(d => ({
                                ...d,
                                score: editedScores[d.title] === '' || editedScores[d.title] == null
                                    ? null
                                    : parseFloat(editedScores[d.title]),
                            }));
                            const validScores = updatedDegrees
                                .map(d => d.score)
                                .filter((v): v is number => v !== null);
                            const newTotal = validScores.length > 0
                                ? validScores.reduce((a, b) => a + b, 0)
                                : null;

                            const updater = (prev: StudentGrade[]) =>
                                prev.map(s =>
                                    s.studentId === selectedStudent.studentId
                                        ? { ...s, degrees: updatedDegrees, total: newTotal }
                                        : s
                                );
                            setAllStudents(updater);
                            setFilteredStudents(updater);

                        } catch (err: any) {
                            Alert.alert('❌ Failed', err.response?.data?.message || 'Could not save changes.');
                        } finally {
                            setSaving(false);
                        }
                    },
                },
            ]
        );
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            {/* Header */}
            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Entypo name="chevron-with-circle-left" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
                <View style={{ width: 28 }} />
            </View>

            {/* Course Card */}
            <View style={styles.courseCard}>
                <View style={styles.courseIconCircle}>
                    <MaterialCommunityIcons name="pencil-box-outline" size={28} color="white" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.courseIdLabel}>EDIT GRADES</Text>
                    <Text style={styles.courseNameText}>{courseName}</Text>
                    <Text style={styles.courseIdSmall}>ID: {courseId}</Text>
                </View>
            </View>

            {/* Group Selector */}
            <View style={styles.sectionWrapper}>
                <Text style={styles.stepLabel}>Select Group</Text>
                <TouchableOpacity
                    style={styles.selectorBtn}
                    onPress={() => !loadingGroups && groups.length > 0 && setGroupPickerVisible(true)}
                    activeOpacity={0.7}
                >
                    {loadingGroups ? (
                        <ActivityIndicator size="small" color="rgb(23,42,70)" />
                    ) : (
                        <>
                            <MaterialCommunityIcons
                                name="account-group-outline"
                                size={20}
                                color={selectedGroup ? 'rgb(23,42,70)' : '#94a3b8'}
                            />
                            <Text style={[styles.selectorText, !selectedGroup && styles.selectorPlaceholder]}>
                                {selectedGroup
                                    ? selectedGroup.groupName
                                    : groups.length === 0
                                        ? 'No groups available for this course'
                                        : 'Choose a group…'}
                            </Text>
                            {groups.length > 0 && (
                                <MaterialCommunityIcons name="chevron-down" size={20} color="#94a3b8" />
                            )}
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            {selectedGroup && (
                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color="#94a3b8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name or student ID..."
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <MaterialCommunityIcons name="close-circle" size={18} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Student List */}
            {!selectedGroup ? (
                <View style={styles.centerContainer}>
                    <MaterialCommunityIcons name="gesture-tap" size={60} color="#dde3ee" />
                    <Text style={styles.hintText}>Select a group to view students</Text>
                </View>
            ) : loadingStudents ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="rgb(23, 42, 70)" />
                    }
                >
                    {filteredStudents.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="account-search-outline" size={70} color="#ccc" />
                            <Text style={styles.emptyText}>
                                {searchQuery ? 'No students match your search' : 'No students found'}
                            </Text>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.countText}>
                                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                            </Text>
                            {filteredStudents.map((student, index) => (
                                <View
                                    key={student.studentId}
                                    style={[styles.studentRow, index % 2 === 1 && styles.studentRowAlt]}
                                >
                                    <View style={styles.avatarCircle}>
                                        <Text style={styles.avatarLetter}>
                                            {student.studentName?.[0]?.toUpperCase() || '?'}
                                        </Text>
                                    </View>
                                    <View style={styles.studentInfo}>
                                        <Text style={styles.studentName} numberOfLines={1}>
                                            {student.studentName}
                                        </Text>
                                        <View style={styles.badgeRow}>
                                            <View style={styles.idBadge}>
                                                <MaterialCommunityIcons name="identifier" size={11} color="#64748b" />
                                                <Text style={styles.idBadgeText}>{student.studentId}</Text>
                                            </View>
                                            <View style={styles.groupBadge}>
                                                <MaterialCommunityIcons name="account-group-outline" size={11} color="rgb(23,42,70)" />
                                                <Text style={styles.groupBadgeText}>{selectedGroup.groupName}</Text>
                                            </View>
                                        </View>
                                        {student.total != null && (
                                            <Text style={styles.totalBadge}>Total: {student.total}</Text>
                                        )}
                                    </View>
                                    <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(student)}>
                                        <MaterialCommunityIcons name="pencil-outline" size={16} color="white" />
                                        <Text style={styles.editBtnText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </>
                    )}
                    <View style={{ height: 40 }} />
                </ScrollView>
            )}

            {/* ════════════ GROUP PICKER MODAL ════════════ */}
            <Modal visible={groupPickerVisible} animationType="slide" transparent onRequestClose={() => setGroupPickerVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.pickerSheet}>
                        <View style={styles.pickerHeader}>
                            <View>
                                <Text style={styles.pickerTitle}>Select Group</Text>
                                <Text style={styles.pickerSubtitle}>{courseName}</Text>
                            </View>
                            <TouchableOpacity onPress={() => setGroupPickerVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={groups}
                            keyExtractor={(g) => g.groupId}
                            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
                            renderItem={({ item }) => {
                                const isSelected = selectedGroup?.groupId === item.groupId;
                                return (
                                    <TouchableOpacity
                                        style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                                        onPress={() => { setSelectedGroup(item); setGroupPickerVisible(false); }}
                                    >
                                        <View style={[styles.groupIconBox, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#f0f4ff' }]}>
                                            <MaterialCommunityIcons name="account-group-outline" size={20} color={isSelected ? 'white' : 'rgb(23,42,70)'} />
                                        </View>
                                        <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                                            {item.groupName}
                                        </Text>
                                        {isSelected && <MaterialCommunityIcons name="check-circle" size={20} color="white" />}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </View>
            </Modal>

            {/* ════════════ EDIT GRADE MODAL ════════════ */}
            <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.modalTitle}>Edit Grades</Text>
                                <Text style={styles.modalSubtitle} numberOfLines={1}>
                                    {selectedStudent?.studentName}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        {/* Dynamic Grade Fields */}
                        <ScrollView style={styles.modalBody}>
                            {!selectedStudent?.degrees.length ? (
                                <View style={styles.noGradesContainer}>
                                    <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#94a3b8" />
                                    <Text style={styles.noGradesText}>No grades uploaded yet for this student.</Text>
                                </View>
                            ) : (
                                selectedStudent.degrees.map((degree, idx) => {
                                    const currentVal = editedScores[degree.title] ?? '';
                                    const fieldError = getFieldError(degree, currentVal);
                                    const hasError   = fieldError !== null;

                                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
                                    const color  = colors[idx % colors.length];

                                    return (
                                        <View key={degree.title}>
                                            <View style={[styles.gradeRow, hasError && styles.gradeRowError]}>
                                                <View style={[styles.gradeIcon, { backgroundColor: color + '20' }]}>
                                                    <MaterialCommunityIcons name="pencil-circle-outline" size={20} color={color} />
                                                </View>
                                                <View style={styles.gradeInfo}>
                                                    <Text style={styles.gradeLabel}>{degree.label}</Text>
                                                    {degree.outOf !== null && (
                                                        <Text style={styles.gradeMax}>Max: {degree.outOf}</Text>
                                                    )}
                                                </View>
                                                <TextInput
                                                    style={[styles.gradeInput, hasError && styles.gradeInputError]}
                                                    keyboardType="decimal-pad"
                                                    placeholder="—"
                                                    placeholderTextColor="#94a3b8"
                                                    value={currentVal}
                                                    onChangeText={(v) => {
                                                        if (v !== '' && !/^\d*\.?\d*$/.test(v)) return;
                                                        setEditedScores(prev => ({ ...prev, [degree.title]: v }));
                                                    }}
                                                />
                                            </View>
                                            {hasError && (
                                                <Text style={styles.errorText}>
                                                    ⚠️ {degree.label}: {fieldError}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })
                            )}
                            <View style={{ height: 20 }} />
                        </ScrollView>

                        {/* Save Button — disabled لو في أي error */}
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[
                                    styles.saveBtn,
                                    // ← التعديل: disabled لو saving أو مفيش درجات أو في error
                                    (saving || !selectedStudent?.degrees.length || hasAnyError()) && styles.saveBtnDisabled
                                ]}
                                onPress={handleSave}
                                // ← التعديل: منع الضغط لو في error
                                disabled={saving || !selectedStudent?.degrees.length || hasAnyError()}
                            >
                                {saving ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <MaterialCommunityIcons name="content-save-check-outline" size={20} color="white" />
                                        <Text style={styles.saveBtnText}>Save Changes</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default EditGrade;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    HeaderStyle: {
        width: '100%',
        height: Platform.OS === 'ios' ? 120 : 100,
        backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    imageStyle: { height: 45, width: '35%', resizeMode: 'contain' },
    courseCard: {
        backgroundColor: 'rgb(23, 42, 70)',
        margin: 16, borderRadius: 18, padding: 18,
        flexDirection: 'row', alignItems: 'center', gap: 14,
        elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8,
    },
    courseIconCircle: {
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center',
    },
    courseIdLabel:  { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', letterSpacing: 1 },
    courseNameText: { fontSize: 17, fontWeight: 'bold', color: 'white', marginTop: 2 },
    courseIdSmall:  { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3 },
    sectionWrapper: { paddingHorizontal: 16, marginBottom: 12 },
    stepLabel:      { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 6, letterSpacing: 0.5 },
    selectorBtn: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white', borderRadius: 14,
        paddingHorizontal: 14, paddingVertical: 13, gap: 10,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4,
    },
    selectorText:        { flex: 1, fontSize: 14, color: '#1e293b', fontWeight: '600' },
    selectorPlaceholder: { color: '#94a3b8', fontWeight: '400' },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'white', marginHorizontal: 16, marginBottom: 12,
        borderRadius: 14, paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, gap: 8,
    },
    searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },
    scrollView:      { flex: 1, paddingHorizontal: 16 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    hintText:        { fontSize: 15, color: '#b0bec5', fontWeight: '500' },
    emptyContainer:  { alignItems: 'center', paddingTop: 80, gap: 12 },
    emptyText:       { fontSize: 16, color: '#aaa', fontWeight: '500' },
    countText:       { fontSize: 13, color: '#64748b', marginBottom: 10, marginLeft: 4 },
    studentRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 14,
        padding: 14, marginBottom: 10,
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3, gap: 12,
    },
    studentRowAlt: { backgroundColor: '#f8fafc' },
    avatarCircle: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgb(23, 42, 70)',
        justifyContent: 'center', alignItems: 'center',
    },
    avatarLetter: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    studentInfo: { flex: 1 },
    studentName: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 5 },
    badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    idBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: '#f1f5f9', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
    },
    idBadgeText: { fontSize: 11, color: '#64748b', fontWeight: '600' },
    groupBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 3,
        backgroundColor: 'rgba(23,42,70,0.08)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
    },
    groupBadgeText: { fontSize: 11, color: 'rgb(23,42,70)', fontWeight: '600' },
    totalBadge: { fontSize: 11, color: '#10b981', fontWeight: '700', marginTop: 4 },
    editBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    },
    editBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end',
    },
    pickerSheet: {
        backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
        maxHeight: '55%', paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    pickerHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 24, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    },
    pickerTitle:    { fontSize: 18, fontWeight: '800', color: 'rgb(23, 42, 70)' },
    pickerSubtitle: { fontSize: 12, color: '#94a3b8', marginTop: 3 },
    pickerItem: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingVertical: 14, paddingHorizontal: 14,
        borderRadius: 14, marginTop: 8, backgroundColor: '#f8fafc',
    },
    pickerItemSelected:     { backgroundColor: 'rgb(23, 42, 70)' },
    pickerItemText:         { flex: 1, fontSize: 15, fontWeight: '600', color: '#1e293b' },
    pickerItemTextSelected: { color: 'white' },
    groupIconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    modalContent: {
        backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
        maxHeight: '80%', paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 25, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    },
    modalTitle:    { fontSize: 18, fontWeight: '800', color: 'rgb(23, 42, 70)' },
    modalSubtitle: { fontSize: 13, color: '#64748b', marginTop: 3, maxWidth: 220 },
    modalBody:     { paddingHorizontal: 24, paddingTop: 16 },
    modalFooter:   { paddingHorizontal: 24, paddingTop: 12 },
    noGradesContainer: { alignItems: 'center', paddingVertical: 30, gap: 10 },
    noGradesText: { fontSize: 14, color: '#94a3b8', textAlign: 'center', fontWeight: '500' },
    gradeRow: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: '#f8fafc', borderRadius: 14, padding: 14, marginBottom: 4,
    },
    gradeRowError: {
        backgroundColor: '#fff5f5',
        borderWidth: 1,
        borderColor: '#fca5a5',
    },
    gradeIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    gradeInfo: { flex: 1 },
    gradeLabel: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    gradeMax:   { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    errorText: {
        fontSize: 11, color: '#ef4444', fontWeight: '600', marginBottom: 10, marginLeft: 8,
    },
    gradeInput: {
        width: 68, borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10,
        paddingHorizontal: 10, paddingVertical: Platform.OS === 'ios' ? 10 : 7,
        fontSize: 16, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', backgroundColor: 'white',
    },
    gradeInputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
    saveBtn: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingVertical: 16, borderRadius: 15,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 10, elevation: 4, marginBottom: 10,
    },
    saveBtnDisabled: { backgroundColor: '#94a3b8', elevation: 0 },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});