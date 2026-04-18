// ===== app/studentschedule.tsx =====
import React, { useCallback, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList,
    ActivityIndicator, StatusBar, TouchableOpacity,
    RefreshControl, Platform, ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { getStudentProfile } from '../api/studentApi';


interface Appointment {
    day: string;
    startTime: string;
    endTime: string;
}

interface GroupInfo {
    _id: string;
    groupName: string;
    Room: string;
    type: string;
    appointment: Appointment;
}

interface CourseInfo {
    _id: string;
    name: string;
    hours: number;
}

interface RegisteredCourse {
    course: CourseInfo;
    group: GroupInfo;
}

interface SessionCard {
    id: string;
    courseId: string;
    courseName: string;
    hours: number;
    groupName: string;
    type: string;
    room: string;
    startTime: string;
    endTime: string;
}

// ----------------------------------------------------------------
// Day order for sorting (Saturday → Friday)
// ----------------------------------------------------------------
const DAYS_OF_WEEK = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const toMinutes = (t?: string): number => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

const fmt = (t?: string) => {
    if (!t) return '';
    if (t.includes('AM') || t.includes('PM')) return t;
    const [hStr, mStr] = t.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return h + ':' + m + ' ' + ampm;
};

const getTypeStyle = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('lab'))     return { color: '#059669', icon: 'flask-outline' };
    if (t.includes('lecture')) return { color: '#4f46e5', icon: 'presentation' };
    if (t.includes('section') || t.includes('tutorial'))
                               return { color: '#0891b2', icon: 'account-group-outline' };
    return                            { color: '#64748b', icon: 'account-group-outline' };
};

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------
const StudentSchedule = () => {
    const [scheduleMap, setScheduleMap] = useState<{ [key: string]: SessionCard[] }>({});
    const [loading, setLoading]         = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const [studentName, setStudentName] = useState('');

    // new Date().getDay(): 0=Sun,1=Mon,...,6=Sat → map to our Saturday-first array
    const JS_TO_IDX: Record<number, number> = { 6:0, 0:1, 1:2, 2:3, 3:4, 4:5, 5:6 };
    const todayIndex = JS_TO_IDX[new Date().getDay()];
    const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK[todayIndex]);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            load(false, isMounted);
            return () => { isMounted = false; };
        }, [])
    );

    const load = async (isRefresh = false, isMounted = true) => {
        if (isRefresh) setRefreshing(true);
        else           setLoading(true);

        try {
            const profile = await getStudentProfile();
            if (!isMounted) return;

            setStudentName(profile?.name?.split(' ')[0] || '');

            const registered: RegisteredCourse[] = profile?.registeredCourses || [];

            const tempSchedule: { [key: string]: SessionCard[] } = {};
            DAYS_OF_WEEK.forEach(day => tempSchedule[day] = []);

            registered.forEach((rc) => {
                const course = rc.course;
                const group  = rc.group;

                if (!course || typeof course === 'string') return;
                if (!group  || typeof group  === 'string') return;

                const appointment = group.appointment;
                if (appointment && appointment.day) {
                    const day = appointment.day.toLowerCase().trim();
                    if (tempSchedule[day] !== undefined) {
                        tempSchedule[day].push({
                            id:         group._id,
                            courseId:   course._id,
                            courseName: course.name  || course._id,
                            hours:      course.hours || 0,
                            groupName:  group.groupName || '',
                            type:       group.type  || 'Lecture',
                            room:       group.Room  || 'TBA',
                            startTime:  appointment.startTime || '--:--',
                            endTime:    appointment.endTime   || '--:--',
                        });
                    }
                }
            });

            // Sort sessions within each day by start time
            DAYS_OF_WEEK.forEach(day => {
                tempSchedule[day].sort((a, b) =>
                    toMinutes(a.startTime) - toMinutes(b.startTime)
                );
            });

            if (isMounted) {
                setScheduleMap(tempSchedule);

                // Auto-select: prefer today if it has sessions, else first active day
                const activeDays = DAYS_OF_WEEK.filter(d => tempSchedule[d].length > 0);
                const currentDay = DAYS_OF_WEEK[new Date().getDay()];
                if (activeDays.length > 0 && !activeDays.includes(currentDay)) {
                    setSelectedDay(activeDays[0]);
                } else if (activeDays.includes(currentDay)) {
                    setSelectedDay(currentDay);
                }
            }

        } catch (err) {
            console.log('Schedule error:', err);
        } finally {
            if (isMounted) { setLoading(false); setRefreshing(false); }
        }
    };

    // ----------------------------------------------------------------
    // Render one session card  (same style as teacher)
    // ----------------------------------------------------------------
    const renderSessionCard = ({ item }: { item: SessionCard }) => {
        const ts = getTypeStyle(item.type);
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.courseInfoBox}>
                        <Text style={styles.courseCode}>{item.courseId}</Text>
                        <Text style={styles.courseName} numberOfLines={1}>{item.courseName}</Text>
                    </View>
                    <View style={[styles.typeBadge, { backgroundColor: ts.color + '15' }]}>
                        <MaterialCommunityIcons name={ts.icon as any} size={13} color={ts.color} />
                        <Text style={[styles.typeText, { color: ts.color }]}>{item.type}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color="#0284c7" />
                        </View>
                        <Text style={styles.infoText}>
                            {fmt(item.startTime)} – {fmt(item.endTime)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="map-marker-outline" size={20} color="#16a34a" />
                        </View>
                        <Text style={styles.infoText}>Room: {item.room}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="account-group-outline" size={20} color="#ca8a04" />
                        </View>
                        <Text style={styles.infoText}>Group: {item.groupName}</Text>
                    </View>

                    {item.hours > 0 && (
                        <View style={styles.infoRow}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="book-open-variant" size={20} color="#7c3aed" />
                            </View>
                            <Text style={styles.infoText}>{item.hours} Credit Hours</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const activeDaysList = DAYS_OF_WEEK.filter(d => scheduleMap[d] && scheduleMap[d].length > 0);
    const totalSessions  = Object.values(scheduleMap).reduce((sum, s) => sum + s.length, 0);

    // ----------------------------------------------------------------
    // Main render
    // ----------------------------------------------------------------
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.replace('/home' as any)}
                    style={styles.backBtn}
                >
                    <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Schedule</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                    <Text style={styles.loadingText}>Loading your schedule...</Text>
                </View>
            ) : activeDaysList.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="calendar-blank-outline" size={80} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>No courses registered</Text>
                    <Text style={styles.emptySub}>
                        Register in courses to see your schedule here.
                    </Text>
                </View>
            ) : (
                <>
                    {/* Days Tabs */}
                    <View style={styles.tabsContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.tabsScrollContent}
                        >
                            {activeDaysList.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    style={[styles.tabBtn, selectedDay === day && styles.tabBtnActive]}
                                    onPress={() => setSelectedDay(day)}
                                >
                                    <Text style={[styles.tabText, selectedDay === day && styles.tabTextActive]}>
                                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                                    </Text>
                                    {selectedDay === day && <View style={styles.activeDot} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Session List */}
                    <FlatList
                        data={scheduleMap[selectedDay] || []}
                        keyExtractor={(item, index) => item.id + index}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderSessionCard}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => load(true)}
                                colors={['rgb(23, 42, 70)']}
                            />
                        }
                        ListEmptyComponent={() => (
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="calendar-blank-outline" size={80} color="#cbd5e1" />
                                <Text style={styles.emptyTitle}>No Sessions</Text>
                                <Text style={styles.emptySub}>
                                    {'No classes on ' + selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1) + '.'}
                                </Text>
                            </View>
                        )}
                    />
                </>
            )}
        </View>
    );
};

export default StudentSchedule;

// ----------------------------------------------------------------
// Styles  (mirrors teacher schedule, same color scheme)
// ----------------------------------------------------------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7ff' },

    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: Platform.OS === 'ios' ? 55 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    backBtn:     { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 },

    // Tabs
    tabsContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        elevation: 2,
    },
    tabsScrollContent: { paddingHorizontal: 15, gap: 10 },
    tabBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBtnActive:  { backgroundColor: 'rgb(23, 42, 70)' },
    tabText:       { fontSize: 14, fontWeight: 'bold', color: '#64748b' },
    tabTextActive: { color: 'white' },
    activeDot: {
        width: 4, height: 4, borderRadius: 2,
        backgroundColor: '#38bdf8', marginTop: 4,
    },

    // List
    listContent: { padding: 20, paddingBottom: 40 },

    // Card
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        marginBottom: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderLeftWidth: 5,
        borderLeftColor: 'rgb(23, 42, 70)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    courseInfoBox: { flex: 1, paddingRight: 10 },
    courseCode: {
        fontSize: 12, fontWeight: 'bold',
        color: '#0284c7', letterSpacing: 1, marginBottom: 4,
    },
    courseName: { fontSize: 17, fontWeight: 'bold', color: '#1e293b' },

    typeBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    },
    typeText: { fontSize: 11, fontWeight: 'bold' },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },

    cardBody: { gap: 12 },
    infoRow:  { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
        width: 32, height: 32, borderRadius: 8,
        backgroundColor: '#f8fafc',
        alignItems: 'center', justifyContent: 'center',
        marginRight: 12,
    },
    infoText: { fontSize: 14, color: '#475569', fontWeight: '600' },

    // Empty & Loading
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingText: { marginTop: 12, fontSize: 15, color: '#64748b', fontWeight: '500' },
    emptyContainer: {
        alignItems: 'center', justifyContent: 'center',
        marginTop: 80, paddingHorizontal: 30,
    },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#64748b', marginTop: 15 },
    emptySub: {
        fontSize: 14, color: '#94a3b8',
        textAlign: 'center', marginTop: 8, lineHeight: 20,
    },
});