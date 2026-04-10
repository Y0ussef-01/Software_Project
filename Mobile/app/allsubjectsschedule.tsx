import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StatusBar,
    Platform,
    ScrollView,
    LayoutAnimation,
    UIManager
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import API from '../api/axiosConfig';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CARD_COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'];

interface Session {
    id: string;
    type: string;
    day: string;
    startTime: string;
    endTime: string;
    room: string;
}

interface Group {
    groupName: string;
    sessions: Session[];
}

interface Course {
    id: string;
    name: string;
    code: string;
    creditHours: number;
    groups: Group[];
}

const AllSubjectsSchedule = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);
    const [expandedIds, setExpandedIds] = useState<{ [key: string]: boolean }>({});

    useFocusEffect(
        useCallback(() => {
            fetchAllSchedules();
        }, [])
    );

    const fetchAllSchedules = async () => {
        try {
            setLoading(true);
            const response = await API.get('/student/getAllCourses'); 
            const rawCourses = response.data?.courses || response.data || [];
            
            const formattedCourses: Course[] = rawCourses.map((course: any) => {
                const groupsMap: { [key: string]: Group } = {};
                
                const rawGroups = course?.groups || [];
                rawGroups.forEach((g: any) => {
                    const gName = g?.groupName || 'Unspecified';
                    if (!groupsMap[gName]) {
                        groupsMap[gName] = {
                            groupName: gName,
                            sessions: []
                        };
                    }
                    
                    if (g?.appointment) {
                        groupsMap[gName].sessions.push({
                            id: g?._id || Math.random().toString(),
                            type: g?.type?.toUpperCase() === 'LAB' || g?.type?.toUpperCase() === 'SEC' ? 'LAB' : 'LEC',
                            day: g?.appointment?.day || 'TBA',
                            startTime: g?.appointment?.startTime || '--:--',
                            endTime: g?.appointment?.endTime || '--:--',
                            room: g?.Room || 'TBA'
                        });
                    }
                });

                return {
                    
                    id: course?._id || Math.random().toString(),
                    name: course?.name || 'Unknown Course',
                    code: course?._id?.toUpperCase() || '', 
                    creditHours: course?.hours || 3,
                    groups: Object.values(groupsMap)
                };
            });

            setCourses(formattedCourses);
        } catch (error) {
            console.log('❌ Error fetching all schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderCourseCard = ({ item, index }: { item: Course, index: number }) => {
        const isExpanded = !!expandedIds[item.id];
        const themeColor = CARD_COLORS[index % CARD_COLORS.length];

        return (
            <View style={styles.courseWrapper}>
                <View style={[styles.leftIndicator, { backgroundColor: themeColor }]} />
                
                <TouchableOpacity 
                    style={[styles.courseMainCard, isExpanded && styles.courseMainCardExpanded]} 
                    onPress={() => toggleExpand(item.id)}
                    activeOpacity={0.8}
                >
                    <View style={styles.courseCardHeader}>
                        <View style={[styles.courseIconBox, { backgroundColor: themeColor + '1A' }]}>
                            <MaterialCommunityIcons name="book-open-page-variant" size={24} color={themeColor} />
                        </View>
                        <View style={styles.courseTitleContainer}>
                            {item.code ? <Text style={styles.courseCodeLabel}>{item.code}</Text> : null}
                            <Text style={styles.courseName}>{item.name}</Text>
                        </View>
                    </View>

                    <View style={styles.courseCardActions}>
                        <View style={styles.creditBadge}>
                            <Text style={styles.creditText}>{item.creditHours} Credit Hours</Text>
                        </View>
                        <MaterialCommunityIcons 
                            name={isExpanded ? "chevron-up" : "chevron-right"} 
                            size={24} 
                            color="#94a3b8" 
                        />
                    </View>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupsScroll}>
                            {item.groups.map((group, gIdx) => (
                                <View key={gIdx} style={styles.groupCard}>
                                    <View style={styles.groupHeader}>
                                        <View style={styles.groupNameRow}>
                                            <MaterialCommunityIcons name="account-group" size={18} color="#475569" />
                                            <Text style={styles.groupNameText}>Group {group.groupName}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.sessionsContainer}>
                                        {group.sessions.map((session, sIdx) => {
                                            const isLab = session.type === 'LAB';
                                            return (
                                                <View key={sIdx} style={styles.sessionBox}>
                                                    <View style={styles.sessionIconCol}>
                                                        <View style={[styles.typeIconBox, isLab ? styles.typeIconBoxLab : styles.typeIconBoxLec]}>
                                                            <MaterialCommunityIcons 
                                                                name={isLab ? "flask" : "book-open-variant"} 
                                                                size={20} 
                                                                color={isLab ? "#ef4444" : "#475569"} 
                                                            />
                                                        </View>
                                                        <Text style={[styles.typeLabelText, isLab && { color: '#ef4444' }]}>{session.type}</Text>
                                                    </View>
                                                    
                                                    <View style={styles.sessionDetailsCol}>
                                                        <View style={styles.detailRow}>
                                                            <MaterialCommunityIcons name="calendar-blank" size={16} color="#64748b" />
                                                            <Text style={styles.detailTextBold}>{session.day}</Text>
                                                        </View>
                                                        <View style={styles.detailRow}>
                                                            <MaterialCommunityIcons name="clock-outline" size={16} color="#94a3b8" />
                                                            <Text style={styles.detailText}>{session.startTime} - {session.endTime}</Text>
                                                        </View>
                                                        <View style={styles.detailRow}>
                                                            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#94a3b8" />
                                                            <Text style={styles.detailText}>Room: {session.room}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="#0F172A" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.pageTitle}>Courses Schedule</Text>
                    <Text style={styles.pageSubtitle}>
                        View all available courses, their specific groups, and detailed lecture/lab schedules.
                    </Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0F172A" />
                    <Text style={styles.loadingText}>Loading Schedule...</Text>
                </View>
            ) : courses.length === 0 ? (
                <View style={styles.centerContainer}>
                    <MaterialCommunityIcons name="book-remove-multiple-outline" size={80} color="#cbd5e1" />
                    <Text style={styles.loadingText}>No Courses Available</Text>
                </View>
            ) : (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => renderCourseCard({ item, index })}
                />
            )}
        </View>
    );
};

export default AllSubjectsSchedule;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7fa' },
    header: {
        backgroundColor: '#0F172A',
        paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40),
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backBtn: { marginBottom: 20, width: 40 },
    headerTextContainer: { paddingRight: 20 },
    pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
    pageSubtitle: { fontSize: 14, color: '#94a3b8', lineHeight: 22 },
    listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    courseWrapper: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
    },
    leftIndicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, zIndex: 2 },
    courseMainCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
        paddingLeft: 22,
    },
    courseMainCardExpanded: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    courseCardHeader: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    courseIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    courseTitleContainer: { flex: 1, justifyContent: 'center' },
    courseCodeLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    courseName: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },
    courseCardActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    creditBadge: { backgroundColor: '#e0f2fe', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    creditText: { color: '#0284c7', fontSize: 12, fontWeight: 'bold' },
    expandedContent: { backgroundColor: '#ffffff', paddingBottom: 20 },
    groupsScroll: { paddingHorizontal: 20, paddingTop: 15, gap: 15 },
    groupCard: {
        width: 290,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 15,
        marginRight: 10,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    groupNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    groupNameText: { fontSize: 15, fontWeight: 'bold', color: '#334155' },
    sessionsContainer: { gap: 12 },
    sessionBox: {
        flexDirection: 'row',
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#f8fafc',
        borderRadius: 10,
        padding: 12,
    },
    sessionIconCol: { alignItems: 'center', marginRight: 12, width: 45 },
    typeIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    typeIconBoxLec: { backgroundColor: '#f1f5f9' },
    typeIconBoxLab: { backgroundColor: '#fee2e2' },
    typeLabelText: { fontSize: 11, fontWeight: 'bold', color: '#64748b' },
    sessionDetailsCol: { flex: 1, justifyContent: 'center', gap: 6 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailTextBold: { fontSize: 13, fontWeight: 'bold', color: '#334155', textTransform: 'capitalize' },
    detailText: { fontSize: 12, color: '#64748b' },
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 12, fontSize: 16, color: '#64748b', fontWeight: '500' },
});