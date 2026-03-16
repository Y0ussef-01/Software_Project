import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList,
    ActivityIndicator, StatusBar, TextInput, ScrollView, Modal
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import API from '../api/axiosConfig';
import { getTeacherProfile } from '../api/teacherApi';

interface AttendanceRecord {
    _id: string;
    student: { _id: string; name: string };
    sessionNumber: number;
    timestamp: string;
    date: string;
}

interface GroupOption {
    groupId: string;
    label: string;
}

const ITEMS_PER_PAGE = 10;

const TeacherAttendance = () => {
    const [options, setOptions] = useState<GroupOption[]>([]);
    const [selected, setSelected] = useState<GroupOption | null>(null);
    const [sessionFilter, setSessionFilter] = useState('');
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searched, setSearched] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const data = await getTeacherProfile();
            const rawCourses = data?.user?.courses || data?.courses || [];

            const list: GroupOption[] = [];
            const seen = new Set<string>();

            rawCourses.forEach((c: any) => {
                const groupId = c.group?._id || '';
                const groupNum = c.group?.groupName || '';
                const groupType = c.group?.type || '';
                const courseName = c.course?.name || c.course?._id || '';

                if (!groupId || seen.has(groupId)) return;
                seen.add(groupId);

                const label = `${courseName} - ${groupNum} (${groupType})`;
                list.push({ groupId, label });
            });

            setOptions(list);
        } catch (err) {
            console.log('Error fetching options:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!selected) return;
        setSearching(true);
        setSearched(true);
        setCurrentPage(1);
        try {
            const res = await API.get(`/teacher/attendance/${selected.groupId}`);
            let data: AttendanceRecord[] = res.data || [];

            if (sessionFilter.trim() !== '') {
                data = data.filter(r => String(r.sessionNumber) === sessionFilter.trim());
            }

            setRecords(data);
        } catch (err) {
            console.log('Error fetching attendance:', err);
            setRecords([]);
        } finally {
            setSearching(false);
        }
    };

    const formatTime = (timestamp: string) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
    const paginatedRecords = records.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Attendance</Text>
                <View style={{ width: 26 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.filtersCard}>
                        <Text style={styles.label}>Select Lecture</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text
                                style={selected ? styles.dropdownSelected : styles.dropdownPlaceholder}
                                numberOfLines={1}
                            >
                                {selected ? selected.label : 'Select a lecture...'}
                            </Text>
                            <MaterialCommunityIcons name="chevron-down" size={22} color="#888" />
                        </TouchableOpacity>

                        <Text style={[styles.label, { marginTop: 14 }]}>Session Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 1"
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                            value={sessionFilter}
                            onChangeText={setSessionFilter}
                        />

                        <TouchableOpacity
                            style={[styles.searchBtn, !selected && styles.searchBtnDisabled]}
                            onPress={handleSearch}
                            disabled={!selected || searching}
                        >
                            {searching ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="magnify" size={20} color="white" />
                                    <Text style={styles.searchBtnText}>Search</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* ✅ عدد الطلاب */}
                    {searched && !searching && (
                        <View style={styles.countRow}>
                            <MaterialCommunityIcons name="account-group" size={20} color="rgb(23, 42, 70)" />
                            <Text style={styles.countText}>
                                Total Attended: <Text style={styles.countNum}>{records.length} Students</Text>
                            </Text>
                        </View>
                    )}

                    {searched && !searching && records.length > 0 && (
                        <View style={styles.tableHeader}>
                            <Text style={[styles.thText, { flex: 1.5 }]}>Name</Text>
                            <Text style={[styles.thText, { flex: 1.2 }]}>ID</Text>
                            <Text style={[styles.thText, { flex: 1.2, textAlign: 'center' }]}>Session</Text>
                            <Text style={[styles.thText, { flex: 1, textAlign: 'right' }]}>Time</Text>
                        </View>
                    )}

                    {searching ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                        </View>
                    ) : searched && records.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <MaterialCommunityIcons name="clipboard-text-off-outline" size={55} color="#ccc" />
                            <Text style={styles.emptyText}>No attendance records found</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={paginatedRecords}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={{ paddingBottom: 10 }}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
                                        <Text style={[styles.studentName, { flex: 1.5 }]} >
                                            {item.student?.name || '-'}
                                        </Text>
                                        <Text style={[styles.studentId, { flex: 1.2 }]} numberOfLines={1}>
                                            {item.student?._id || ''}
                                        </Text>
                                        <View style={[styles.badge, { flex: 1.2 }]}>
                                            <Text style={styles.badgeText}>session {item.sessionNumber}</Text>
                                        </View>
                                        <Text style={[styles.timeText, { flex: 1, textAlign: 'right' }]}>
                                            {formatTime(item.timestamp)}
                                        </Text>
                                    </View>
                                )}
                            />

                            {totalPages > 1 && (
                                <View style={styles.pagination}>
                                    <TouchableOpacity
                                        style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                                        onPress={() => setCurrentPage(p => p - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <MaterialCommunityIcons name="chevron-left" size={20} color={currentPage === 1 ? '#ccc' : 'rgb(23, 42, 70)'} />
                                    </TouchableOpacity>
                                    <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>
                                    <TouchableOpacity
                                        style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                                        onPress={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <MaterialCommunityIcons name="chevron-right" size={20} color={currentPage === totalPages ? '#ccc' : 'rgb(23, 42, 70)'} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Lecture</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {options.map((opt) => (
                                <TouchableOpacity
                                    key={opt.groupId}
                                    style={[styles.modalItem, selected?.groupId === opt.groupId && styles.modalItemActive]}
                                    onPress={() => {
                                        setSelected(opt);
                                        setRecords([]);
                                        setSearched(false);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalItemText, selected?.groupId === opt.groupId && styles.modalItemTextActive]}>
                                        {opt.label}
                                    </Text>
                                    {selected?.groupId === opt.groupId && (
                                        <MaterialCommunityIcons name="check" size={20} color="white" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TeacherAttendance;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4ff' },
    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
    },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    emptyText: { fontSize: 15, color: '#aaa', marginTop: 12 },
    filtersCard: {
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 15,
        padding: 16,
        elevation: 4,
        shadowColor: 'rgb(23, 42, 70)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    label: { fontSize: 13, fontWeight: '600', color: 'rgb(23, 42, 70)', marginBottom: 6 },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: '#dde3f0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        backgroundColor: '#f8faff',
    },
    dropdownPlaceholder: { color: '#aaa', fontSize: 14, flex: 1 },
    dropdownSelected: { color: 'rgb(23, 42, 70)', fontSize: 14, fontWeight: '600', flex: 1 },
    input: {
        borderWidth: 1.5,
        borderColor: '#dde3f0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 14,
        color: 'rgb(23, 42, 70)',
        backgroundColor: '#f8faff',
    },
    searchBtn: {
        backgroundColor: 'rgb(23, 42, 70)',
        borderRadius: 10,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 15,
    },
    searchBtnDisabled: { opacity: 0.45 },
    searchBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
    countRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#e8f0fe',
        marginHorizontal: 15,
        borderRadius: 10,
        marginBottom: 5,
    },
    countText: { fontSize: 14, color: 'rgb(23, 42, 70)' },
    countNum: { fontWeight: 'bold', fontSize: 15 },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 12,
        backgroundColor: 'rgb(23, 42, 70)',
    },
    thText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 'bold' },
    row: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 14,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    rowAlt: { backgroundColor: '#f8faff' },
    studentName: { fontSize: 13, fontWeight: '600', color: 'rgb(23, 42, 70)' },
    studentId: { fontSize: 12, color: '#888' },
    badge: {
        backgroundColor: '#e8f0fe',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignItems: 'center',
    },
    badgeText: { fontSize: 12, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    timeText: { fontSize: 13, color: '#555', fontWeight: '500' },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    pageBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f4ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageBtnDisabled: { backgroundColor: '#f5f5f5' },
    pageText: { fontSize: 15, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '65%', paddingBottom: 30 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    modalTitle: { fontSize: 17, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    modalItemActive: { backgroundColor: 'rgb(23, 42, 70)' },
    modalItemText: { fontSize: 15, color: '#333', flex: 1 },
    modalItemTextActive: { color: 'white', fontWeight: 'bold' },
});