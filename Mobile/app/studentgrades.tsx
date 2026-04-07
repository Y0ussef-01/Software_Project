import Entypo from '@expo/vector-icons/Entypo';
import { Stack, router } from "expo-router";
import { useEffect, useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import API from '../api/axiosConfig';
import { saveCache, getCache } from '../api/storage'; // استدعاء الدوال اللي أنت بعتها

interface Degree {
    title: string;
    score: number;
    _id: string;
}

interface Course {
    courseId: string;
    courseName: string;
    Degrees: Degree[];
}

// مفتاح ثابت للكاش الخاص بهذه الصفحة
const GRADES_CACHE_KEY = 'student_grades_cache';

const StudentGrades = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchGrades = async (isFirstLoad = false) => {
        try {
            // 1. محاولة جلب البيانات من الكاش باستخدام الدالة العامة اللي عملتها
            if (isFirstLoad) {
                const cachedData = await getCache(GRADES_CACHE_KEY);
                if (cachedData) {
                    setCourses(cachedData);
                    setLoading(false);
                }
            }

            // 2. طلب البيانات من السيرفر
            const res = await API.get('/student/grades');
            const rawGrades: Course[] = res.data?.grades || [];

            // تجميع الدرجات لكل كورس (لو متكرر)
            const seen = new Map<string, Course>();
            rawGrades.forEach((c) => {
                if (seen.has(c.courseId)) {
                    const existing = seen.get(c.courseId)!;
                    existing.Degrees = [...existing.Degrees, ...c.Degrees];
                } else {
                    seen.set(c.courseId, { ...c, Degrees: [...c.Degrees] });
                }
            });

            const finalData = Array.from(seen.values());

            // 3. تحديث الواجهة وحفظ الكاش الجديد
            setCourses(finalData);
            await saveCache(GRADES_CACHE_KEY, finalData);

        } catch (err) {
            console.error('Error fetching grades:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchGrades(true);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchGrades();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Entypo name="chevron-with-circle-left" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
                <View style={{ width: 28 }} />
            </View>

            {/* Title Section */}
            <View style={styles.titleContainer}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="medal-outline" size={24} color="white" />
                </View>
                <View>
                    <Text style={styles.titleText}>My Grades</Text>
                    <Text style={styles.subtitleText}>Performance Overview</Text>
                </View>
            </View>

            {loading && courses.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                </View>
            ) : courses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="book-off-outline" size={70} color="#ccc" />
                    <Text style={styles.emptyText}>No data available</Text>
                </View>
            ) : (
                <ScrollView 
                    style={styles.scrollView} 
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="rgb(23, 42, 70)" />
                    }
                >
                    {courses.map((course) => (
                        <TouchableOpacity
                            key={course.courseId}
                            style={styles.courseCard}
                            activeOpacity={0.7}
                            onPress={() =>
                                router.push({
                                    pathname: '/coursedetails',
                                    params: {
                                        courseId: course.courseId,
                                        courseName: course.courseName,
                                        degrees: JSON.stringify(course.Degrees),
                                    },
                                } as any)
                            }
                        >
                            <View style={styles.courseInfo}>
                                <View style={styles.courseIcon}>
                                    <MaterialCommunityIcons name="book-open-variant" size={22} color="rgb(23, 42, 70)" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.courseId}>{course.courseId}</Text>
                                    <Text style={styles.courseName}>{course.courseName}</Text>
                                </View>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={22} color="#ddd" />
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 30 }} />
                </ScrollView>
            )}
        </View>
    );
};

export default StudentGrades;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    HeaderStyle: {
        width: '100%', height: 110, backgroundColor: 'rgb(23, 42, 70)',
        elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5, shadowRadius: 10, paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    imageStyle: { height: 45, width: '35%', resizeMode: 'contain' },
    titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 20, paddingVertical: 25 },
    iconCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgb(23, 42, 70)', alignItems: 'center', justifyContent: 'center', elevation: 4 },
    titleText: { fontSize: 22, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    subtitleText: { fontSize: 13, color: 'gray' },
    scrollView: { paddingHorizontal: 20 },
    courseCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 15,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: '#f0f0f0'
    },
    courseInfo: { flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 },
    courseIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center' },
    courseId: { fontSize: 12, fontWeight: 'bold', color: '#888', marginBottom: 2 },
    courseName: { fontSize: 16, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, paddingBottom: 100 },
    emptyText: { fontSize: 16, color: '#aaa', fontWeight: '500' },
});