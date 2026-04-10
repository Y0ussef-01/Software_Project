// ===== app/studentschedule.tsx =====
import React, { useCallback, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList,
    ActivityIndicator, StatusBar, TouchableOpacity,
    RefreshControl, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { getStudentProfile } from '../api/studentApi';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
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

interface CourseCard {
    courseId: string;
    courseName: string;
    hours: number;
    groups: GroupInfo[];
}

// ----------------------------------------------------------------
// Day order for sorting (Sunday → Saturday)
// ----------------------------------------------------------------
const DAY_ORDER: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2,
    Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

// Convert "HH:MM" to total minutes for numeric comparison
const toMinutes = (t?: string): number => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

const sortGroups = (groups: GroupInfo[]): GroupInfo[] =>
    [...groups].sort((a, b) => {
        const dayDiff =
            (DAY_ORDER[a.appointment?.day] ?? 99) -
            (DAY_ORDER[b.appointment?.day] ?? 99);
        if (dayDiff !== 0) return dayDiff;
        return toMinutes(a.appointment?.startTime) - toMinutes(b.appointment?.startTime);
    });

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
const CARD_COLORS = [
    '#4f46e5', '#0891b2', '#059669', '#d97706',
    '#dc2626', '#7c3aed', '#0284c7', '#16a34a',
];

const getTypeStyle = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('lab'))     return { color: '#059669', icon: 'flask-outline' };
    if (t.includes('lecture')) return { color: '#4f46e5', icon: 'presentation' };
    if (t.includes('section') || t.includes('tutorial'))
                               return { color: '#0891b2', icon: 'account-group-outline' };
    return                            { color: '#64748b', icon: 'account-group-outline' };
};

const fmt = (t?: string) => {
    if (!t) return '';
    // لو الوقت جاي بـ AM/PM بالفعل، رجعه زي ما هو
    if (t.includes('AM') || t.includes('PM')) return t;
    const [hStr, mStr] = t.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return h + ':' + m + ' ' + ampm;
};

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------
const StudentSchedule = () => {
    const [cards, setCards]             = useState<CourseCard[]>([]);
    const [loading, setLoading]         = useState(true);
    const [refreshing, setRefreshing]   = useState(false);
    const [studentName, setStudentName] = useState('');

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
            const map: Record<string, CourseCard> = {};

            registered.forEach((rc) => {
                const course = rc.course;
                const group  = rc.group;

                if (!course || typeof course === 'string') return;
                if (!group  || typeof group  === 'string') return;

                const cId = course._id;
                if (!map[cId]) {
                    map[cId] = {
                        courseId:   cId,
                        courseName: course.name  || cId,
                        hours:      course.hours || 0,
                        groups:     [],
                    };
                }
                map[cId].groups.push(group);
            });

            // Sort groups inside each course by day → startTime
            const sorted = Object.values(map).map((card) => ({
                ...card,
                groups: sortGroups(card.groups),
            }));

            // Sort cards themselves by the day of their first group
            sorted.sort((a, b) => {
                const dayA = DAY_ORDER[a.groups[0]?.appointment?.day] ?? 99;
                const dayB = DAY_ORDER[b.groups[0]?.appointment?.day] ?? 99;
                if (dayA !== dayB) return dayA - dayB;
                return (
                    toMinutes(a.groups[0]?.appointment?.startTime) -
                    toMinutes(b.groups[0]?.appointment?.startTime)
                );
            });

            if (isMounted) setCards(sorted);

        } catch (err) {
            console.log('Schedule error:', err);
        } finally {
            if (isMounted) { setLoading(false); setRefreshing(false); }
        }
    };

    // ----------------------------------------------------------------
    // Render one group slot row
    // ----------------------------------------------------------------
    const renderGroupRow = (group: GroupInfo, idx: number, accentColor: string) => {
        const ts   = getTypeStyle(group.type);
        const day  = group.appointment?.day        || '';
        const from = fmt(group.appointment?.startTime);
        const to   = fmt(group.appointment?.endTime);
        const room = group.Room || '';

        return (
            <View key={group._id + idx} style={styles.slotRow}>

                {/* Day badge */}
                <View style={[styles.dayBadge, { backgroundColor: accentColor }]}>
                    <Text style={styles.dayText}>{day.slice(0, 3) || '---'}</Text>
                </View>

                <View style={styles.slotInfo}>
                    {/* Type badge */}
                    <View style={[styles.typeBadge, { backgroundColor: ts.color + '15' }]}>
                        <MaterialCommunityIcons name={ts.icon as any} size={12} color={ts.color} />
                        <Text style={[styles.typeText, { color: ts.color }]}>
                            {group.type || 'Group'}
                        </Text>
                    </View>

                    {/* Time */}
                    <Text style={styles.timeText}>
{from && to ? (from + ' – ' + to) : (from || '--:--')}                    </Text>

                    {/* Room */}
                    {room ? (
                        <View style={styles.roomRow}>
                            <MaterialCommunityIcons name="map-marker-outline" size={12} color="#94a3b8" />
                            <Text style={styles.roomText}>{room}</Text>
                        </View>
                    ) : null}
                </View>

                {/* Group name */}
                <Text style={styles.groupName} numberOfLines={1}>{group.groupName || ''}</Text>
            </View>
        );
    };

    // ----------------------------------------------------------------
    // Render one course card
    // ----------------------------------------------------------------
    const renderCard = ({ item, index }: { item: CourseCard; index: number }) => {
        const color = CARD_COLORS[index % CARD_COLORS.length];
        return (
            <View style={styles.card}>
                <View style={[styles.colorBar, { backgroundColor: color }]} />
                <View style={styles.cardInner}>

                    {/* Course header */}
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
                            <MaterialCommunityIcons name="book-open-variant" size={24} color={color} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.courseIdText}>{item.courseId}</Text>
                            <Text style={styles.courseNameText} numberOfLines={2}>{item.courseName}</Text>
                        </View>
                        {item.hours > 0 ? (
                            <View style={[styles.hoursBadge, { backgroundColor: color + '15' }]}>
                                <Text style={[styles.hoursText, { color }]}>
                                    {String(item.hours) + ' hrs'}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.divider} />

                    {/* Sorted group slots */}
                    <View style={styles.slotsContainer}>
                        {item.groups.map((g, i) => renderGroupRow(g, i, color))}
                    </View>

                </View>
            </View>
        );
    };

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

            {/* Banner */}
            <View style={styles.banner}>
                <View>
                    <Text style={styles.bannerSub}>
                        {studentName ? ('Hello, ' + studentName + ' \uD83D\uDC4B') : 'Your timetable'}
                    </Text>
                    <Text style={styles.bannerMain}>Registered Courses</Text>
                </View>
                <View style={styles.countBadge}>
                    <Text style={styles.countNumber}>{String(cards.length)}</Text>
                    <Text style={styles.countLabel}>Courses</Text>
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                    <Text style={styles.loadingText}>Loading your schedule...</Text>
                </View>
            ) : cards.length === 0 ? (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="calendar-blank-outline" size={70} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>No courses registered</Text>
                    <Text style={styles.emptySubtitle}>
                        Register in courses to see your schedule here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={cards}
                    keyExtractor={(item) => item.courseId}
                    renderItem={renderCard}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => load(true)}
                            colors={['rgb(23, 42, 70)']}
                        />
                    }
                />
            )}
        </View>
    );
};

export default StudentSchedule;

// ----------------------------------------------------------------
// Styles
// ----------------------------------------------------------------
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },

    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: Platform.OS === 'ios' ? 55 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
    },
    backBtn:     { padding: 4 },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },

    banner: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 20,
        paddingBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerSub:  { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 },
    bannerMain: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    countBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16, paddingHorizontal: 18, paddingVertical: 10,
        alignItems: 'center',
    },
    countNumber: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    countLabel:  { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600' },

    center:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 30 },
    loadingText:   { color: '#94a3b8', fontSize: 14, marginTop: 10 },
    emptyTitle:    { color: '#334155', fontSize: 18, fontWeight: 'bold' },
    emptySubtitle: { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 20 },

    list: { padding: 16, gap: 14, paddingBottom: 40 },

    card: {
        backgroundColor: '#fff', borderRadius: 18,
        flexDirection: 'row', overflow: 'hidden',
        elevation: 3, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07, shadowRadius: 6,
    },
    colorBar:  { width: 5 },
    cardInner: { flex: 1, padding: 16 },

    cardHeader:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
    iconBox:     { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

    courseIdText: {
        fontSize: 11, color: '#94a3b8',
        fontWeight: '700', letterSpacing: 0.5, marginBottom: 3,
    },
    courseNameText: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', lineHeight: 21 },

    hoursBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
    hoursText:  { fontSize: 12, fontWeight: '700' },

    divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 12 },

    slotsContainer: { gap: 10 },

    slotRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        backgroundColor: '#f8faff', borderRadius: 12, padding: 10,
    },
    dayBadge: {
        width: 44, height: 44, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
    },
    dayText: { color: 'white', fontSize: 11, fontWeight: 'bold' },

    slotInfo: { flex: 1, gap: 4 },

    typeBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
    },
    typeText: { fontSize: 11, fontWeight: '700' },

    timeText: { fontSize: 13, fontWeight: 'bold', color: '#1e293b' },

    roomRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    roomText: { fontSize: 11, color: '#94a3b8' },

    groupName: {
        fontSize: 11, color: '#64748b', fontWeight: '600',
        maxWidth: 70, textAlign: 'right',
    },
});