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
    ScrollView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from 'expo-router';
import { getTeacherProfile } from '../api/teacherApi';

// تعريف واجهة البيانات للجلسة (المحاضرة/السكشن)
interface Session {
    id: string;
    courseName: string;
    courseId: string;
    groupName: string;
    type: string;
    room: string;
    startTime: string;
    endTime: string;
}

const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const TeacherSchedule = () => {
    const [loading, setLoading] = useState(true);
    const [scheduleMap, setScheduleMap] = useState<{ [key: string]: Session[] }>({});
    
    // تحديد اليوم الحالي كافتراضي (أو الأحد لو كان اليوم أجازة مثلاً)
    const todayIndex = new Date().getDay();
    const [selectedDay, setSelectedDay] = useState(DAYS_OF_WEEK[todayIndex]);

    useFocusEffect(
        useCallback(() => {
            fetchSchedule();
        }, [])
    );

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const data = await getTeacherProfile();
            
            // استخراج الكورسات والمجموعات المرتبطة بالمدرس
            const rawCourses = data?.user?.courses || data?.courses || [];
            
            const tempSchedule: { [key: string]: Session[] } = {};
            DAYS_OF_WEEK.forEach(day => tempSchedule[day] = []);

            rawCourses.forEach((c: any) => {
                const courseId = c.course?._id || 'N/A';
                const courseName = c.course?.name || 'Unknown Course';
                const groupId = c.group?._id || Math.random().toString();
                const groupName = c.group?.groupName || '';
                const type = c.group?.type || 'Lecture';
                const room = c.group?.Room || 'TBA';
                
                const appointment = c.group?.appointment;
                if (appointment && appointment.day) {
                    const day = appointment.day.toLowerCase().trim();
                    if (tempSchedule[day]) {
                        tempSchedule[day].push({
                            id: groupId,
                            courseId,
                            courseName,
                            groupName,
                            type,
                            room,
                            startTime: appointment.startTime || '--:--',
                            endTime: appointment.endTime || '--:--'
                        });
                    }
                }
            });

            // تحديث الجدول
            setScheduleMap(tempSchedule);

            // تحديد الأيام اللي فيها محاضرات فقط عشان نظهرها في الـ Tabs
            const activeDays = DAYS_OF_WEEK.filter(day => tempSchedule[day].length > 0);
            
            // لو اليوم الحالي مفيهوش محاضرات، اختار أول يوم متاح تلقائياً
            const currentDay = DAYS_OF_WEEK[new Date().getDay()];
            if (activeDays.length > 0 && !activeDays.includes(currentDay)) {
                setSelectedDay(activeDays[0]);
            } else if (activeDays.includes(currentDay)) {
                setSelectedDay(currentDay);
            }

        } catch (error) {
            console.log('❌ Error fetching schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderSessionCard = ({ item }: { item: Session }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.courseInfoBox}>
                    <Text style={styles.courseCode}>{item.courseId}</Text>
                    <Text style={styles.courseName} numberOfLines={1}>{item.courseName}</Text>
                </View>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.type}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color="#0284c7" />
                    </View>
                    <Text style={styles.infoText}>{item.startTime} - {item.endTime}</Text>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="google-classroom" size={20} color="#16a34a" />
                    </View>
                    <Text style={styles.infoText}>Room: {item.room}</Text>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="account-group-outline" size={20} color="#ca8a04" />
                    </View>
                    <Text style={styles.infoText}>Group: {item.groupName}</Text>
                </View>
            </View>
        </View>
    );

    // الأيام اللي هتتعرض في الشريط اللي فوق (فقط اللي فيها مواد)
    const activeDaysList = DAYS_OF_WEEK.filter(day => scheduleMap[day] && scheduleMap[day].length > 0);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Schedule</Text>
                <View style={{ width: 45 }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                    <Text style={styles.loadingText}>Loading Schedule...</Text>
                </View>
            ) : activeDaysList.length === 0 ? (
                // لو المدرس مفندوش محاضرات طول الأسبوع
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="calendar-blank-outline" size={80} color="#cbd5e1" />
                    <Text style={styles.emptyTitle}>No Sessions</Text>
                    <Text style={styles.emptySub}>You have no classes scheduled for the entire week.</Text>
                </View>
            ) : (
                <>
                    {/* Days Tabs (Horizontal Scroll) - يعرض أيام الشغل فقط */}
                    <View style={styles.tabsContainer}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.tabsScrollContent}
                        >
                            {activeDaysList.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        styles.tabBtn,
                                        selectedDay === day && styles.tabBtnActive
                                    ]}
                                    onPress={() => setSelectedDay(day)}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        selectedDay === day && styles.tabTextActive
                                    ]}>
                                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                                    </Text>
                                    {selectedDay === day && <View style={styles.activeDot} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Schedule List */}
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={scheduleMap[selectedDay] || []}
                            keyExtractor={(item, index) => item.id + index}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderSessionCard}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <MaterialCommunityIcons name="calendar-blank-outline" size={80} color="#cbd5e1" />
                                    <Text style={styles.emptyTitle}>No Sessions</Text>
                                    <Text style={styles.emptySub}>You have no lectures or classes scheduled for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}.</Text>
                                </View>
                            )}
                        />
                    </View>
                </>
            )}
        </View>
    );
};

export default TeacherSchedule;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7ff' },
    
    // Header Styles
    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40),
        paddingBottom: 20,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
    },
    backBtn: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 },
    
    // Tabs Styles
    tabsContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        elevation: 2,
    },
    tabsScrollContent: {
        paddingHorizontal: 15,
        gap: 10,
    },
    tabBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBtnActive: {
        backgroundColor: 'rgb(23, 42, 70)',
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#64748b',
    },
    tabTextActive: {
        color: 'white',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#38bdf8',
        marginTop: 4,
    },

    // List & Cards
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
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
        borderLeftColor: 'rgb(23, 42, 70)', // الكارت الأبيض بالخط الجانبي
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    courseInfoBox: {
        flex: 1,
        paddingRight: 10,
    },
    courseCode: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0284c7',
        letterSpacing: 1,
        marginBottom: 4,
    },
    courseName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    typeBadge: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    typeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 15,
    },
    cardBody: {
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '600',
    },

    // Empty & Loading States
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: '#64748b',
        fontWeight: '500',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        paddingHorizontal: 30,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#64748b',
        marginTop: 15,
    },
    emptySub: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});