import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList,
    ActivityIndicator, StatusBar, TextInput, ScrollView, Modal, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import API from '../api/axiosConfig';
// استيراد دالة الكاش الموحدة للمدرس
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

    // --- التحديث عند دخول الشاشة باستخدام الكاش ---
    useFocusEffect(
        useCallback(() => {
            fetchOptions();
        }, [])
    );

    const fetchOptions = async () => {
        try {
            // جلب بيانات المدرس (سواء من الـ RAM أو التخزين المحلي أو السيرفر)
            const data = await getTeacherProfile();
            
            // معالجة البيانات للتأكد من الوصول للمواد والمجموعات بشكل صحيح
            const rawCourses = data?.user?.courses || data?.courses || [];

            const list: GroupOption[] = [];
            const seen = new Set<string>();

            rawCourses.forEach((c: any) => {
                const groupId = c.group?._id || '';
                const groupNum = c.group?.groupName || '';
                const groupType = c.group?.type || '';
                const courseName = c.course?.name || c.course?._id || 'Unknown Course';

                if (!groupId || seen.has(groupId)) return;
                seen.add(groupId);

                // --- التعديل هنا: إزالة كلمة lecture من الاختيارات ---
                let label = `${courseName} - ${groupNum}`;
                if (groupType && groupType.toLowerCase() !== 'lecture') {
                    label += ` (${groupType})`;
                }

                list.push({ groupId, label });
            });

            setOptions(list);
        } catch (err) {
            console.log('❌ Error fetching attendance options:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!selected || sessionFilter.trim() === '') return;

        setSearching(true);
        setSearched(true);
        setCurrentPage(1);
        try {
            // البحث عن سجلات الحضور (دائماً من السيرفر لضمان الدقة اللحظية)
            const res = await API.get(`/teacher/attendance/${selected.groupId}`, {
                params: { sessionNumber: sessionFilter.trim() }
            });
            setRecords(res.data || []);
        } catch (err) {
            console.log('❌ Error fetching attendance records:', err);
            setRecords([]);
        } finally {
            setSearching(false);
        }
    };

    const formatTime = (timestamp: string) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // --- Pagination Logic ---
    const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
    const paginatedRecords = records.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Attendance Tracking</Text>
                <View style={{ width: 45 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                    <Text style={{ marginTop: 10, color: '#666' }}>Loading Groups...</Text>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    {/* Filter Card */}
                    <View style={styles.filtersCard}>
                        {/* --- التعديل هنا: إزالة كلمة Lecture من العنوان --- */}
                        <Text style={styles.label}>Select Group</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text
                                style={selected ? styles.dropdownSelected : styles.dropdownPlaceholder}
                                numberOfLines={1}
                            >
                                {selected ? selected.label : 'Choose a group...'}
                            </Text>
                            <MaterialCommunityIcons name="chevron-down" size={24} color="#888" />
                        </TouchableOpacity>

                        <Text style={[styles.label, { marginTop: 15 }]}>Session Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 1, 2, 3..."
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                            value={sessionFilter}
                            onChangeText={setSessionFilter}
                        />

                        <TouchableOpacity
                            style={[
                                styles.searchBtn,
                                (!selected || sessionFilter.trim() === '') && styles.searchBtnDisabled,
                            ]}
                            onPress={handleSearch}
                            disabled={!selected || searching || sessionFilter.trim() === ''}
                        >
                            {searching ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="magnify" size={22} color="white" />
                                    <Text style={styles.searchBtnText}>Show Attendance</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Stats Row */}
                    {searched && !searching && (
                        <View style={styles.countRow}>
                            <MaterialCommunityIcons name="account-check-outline" size={22} color="rgb(23, 42, 70)" />
                            <Text style={styles.countText}>
                                Total Present: <Text style={styles.countNum}>{records.length}</Text>
                            </Text>
                        </View>
                    )}

                    {/* Table Header */}
                    {searched && !searching && records.length > 0 && (
                        <View style={styles.tableHeader}>
                            <Text style={[styles.thText, { flex: 2 }]}>Student Name</Text>
                            <Text style={[styles.thText, { flex: 1.2, textAlign: 'center' }]}>Session</Text>
                            <Text style={[styles.thText, { flex: 1, textAlign: 'right' }]}>Time</Text>
                        </View>
                    )}

                    {/* Results List */}
                    {searching ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                        </View>
                    ) : searched && records.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <MaterialCommunityIcons name="clipboard-text-off-outline" size={70} color="#cbd5e0" />
                            <Text style={styles.emptyText}>No attendance found for this session</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={paginatedRecords}
                                keyExtractor={(item) => item._id}
                                contentContainerStyle={{ paddingBottom: 20 }}
                                renderItem={({ item, index }) => (
                                    <View style={[styles.row, index % 2 === 0 && styles.rowAlt]}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.studentName} numberOfLines={1}>
                                                {item.student?.name || 'Unknown'}
                                            </Text>
                                            <Text style={styles.studentId}>{item.student?._id}</Text>
                                        </View>
                                        <View style={[styles.badge, { flex: 1.2 }]}>
                                            <Text style={styles.badgeText}>S-{item.sessionNumber}</Text>
                                        </View>
                                        <Text style={[styles.timeText, { flex: 1, textAlign: 'right' }]}>
                                            {formatTime(item.timestamp)}
                                        </Text>
                                    </View>
                                )}
                            />

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <View style={styles.pagination}>
                                    <TouchableOpacity
                                        style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                                        onPress={() => setCurrentPage((p) => p - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <MaterialCommunityIcons name="chevron-left" size={24} color={currentPage === 1 ? '#ccc' : 'rgb(23, 42, 70)'} />
                                    </TouchableOpacity>
                                    <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>
                                    <TouchableOpacity
                                        style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                                        onPress={() => setCurrentPage((p) => p + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <MaterialCommunityIcons name="chevron-right" size={24} color={currentPage === totalPages ? '#ccc' : 'rgb(23, 42, 70)'} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}

            {/* Selection Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Choose Group</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close-circle" size={28} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                            {options.map((opt) => (
                                <TouchableOpacity
                                    key={opt.groupId}
                                    style={[
                                        styles.modalItem,
                                        selected?.groupId === opt.groupId && styles.modalItemActive,
                                    ]}
                                    onPress={() => {
                                        setSelected(opt);
                                        setRecords([]);
                                        setSearched(false);
                                        setModalVisible(false);
                                    }}
                                >
                                    <MaterialCommunityIcons 
                                        name="account-group" 
                                        size={22} 
                                        color={selected?.groupId === opt.groupId ? 'white' : 'rgb(23, 42, 70)'} 
                                        style={{ marginRight: 12 }}
                                    />
                                    <Text
                                        style={[
                                            styles.modalItemText,
                                            selected?.groupId === opt.groupId && styles.modalItemTextActive,
                                        ]}
                                    >
                                        {opt.label}
                                    </Text>
                                    {selected?.groupId === opt.groupId && (
                                        <MaterialCommunityIcons name="check-circle" size={22} color="white" />
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
    container: { flex: 1, backgroundColor: '#f4f7ff' },
    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
        paddingBottom: 20,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 12,
    },
    backBtn: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 },
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    emptyText: { fontSize: 16, color: '#94a3b8', marginTop: 15, textAlign: 'center', fontWeight: '500' },
    
    filtersCard: {
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    label: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 8, marginLeft: 2 },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 14,
        backgroundColor: '#f8fafc',
    },
    dropdownPlaceholder: { color: '#94a3b8', fontSize: 15 },
    dropdownSelected: { color: 'rgb(23, 42, 70)', fontSize: 15, fontWeight: '700' },
    input: {
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: 'rgb(23, 42, 70)',
        backgroundColor: '#f8fafc',
        fontWeight: '600'
    },
    searchBtn: {
        backgroundColor: 'rgb(23, 42, 70)',
        borderRadius: 12,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
    },
    searchBtnDisabled: { backgroundColor: '#94a3b8' },
    searchBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    countRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#dbeafe',
        marginHorizontal: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#bfdbfe'
    },
    countText: { fontSize: 15, color: '#1e3a8a', fontWeight: '500' },
    countNum: { fontWeight: '800', fontSize: 17 },

    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'rgb(23, 42, 70)',
        marginHorizontal: 15,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    thText: { color: '#cbd5e1', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },

    row: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    rowAlt: { backgroundColor: '#f8fafc' },
    studentName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
    studentId: { fontSize: 11, color: '#64748b', marginTop: 2 },
    badge: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingVertical: 4,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    badgeText: { fontSize: 11, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    timeText: { fontSize: 13, color: '#475569', fontWeight: '600' },

    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        gap: 25,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    pageBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    },
    pageBtnDisabled: { opacity: 0.5 },
    pageText: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: '70%',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    modalTitle: { fontSize: 18, fontWeight: '800', color: 'rgb(23, 42, 70)' },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    modalItemActive: { backgroundColor: 'rgb(23, 42, 70)' },
    modalItemText: { fontSize: 15, color: '#334155', flex: 1, fontWeight: '500' },
    modalItemTextActive: { color: 'white', fontWeight: 'bold' },
});