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
import { saveCache, getCache } from '../api/storage';

interface Course {
    _id: string;
    name: string;
}

const TEACHER_GRADES_COURSES_KEY = 'teacher_grades_courses_cache';

const TeacherGrades = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCourses = async (isFirstLoad = false) => {
        try {
            if (isFirstLoad) {
                const cached = await getCache(TEACHER_GRADES_COURSES_KEY);
                if (cached) {
                    setCourses(cached);
                    setLoading(false);
                }
            }

            const res = await API.get('/teacher/profile');
            const rawCourses: any[] = res.data?.courses || [];
            const seen = new Set<string>();
            const unique: Course[] = [];
            rawCourses.forEach((c: any) => {
                const id = c.course?._id;
                const name = c.course?.name;
                if (id && !seen.has(id)) {
                    seen.add(id);
                    unique.push({ _id: id, name: name || id });
                }
            });

            setCourses(unique);
            await saveCache(TEACHER_GRADES_COURSES_KEY, unique);
        } catch (err: any) {
            console.log('Fetch error URL:', err.config?.url);
            console.log('Fetch error status:', err.response?.status);
            console.log('Fetch error message:', err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchCourses(true); }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCourses();
    }, []);

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

            {/* Title */}
            <View style={styles.titleContainer}>
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="clipboard-list-outline" size={24} color="white" />
                </View>
                <View>
                    <Text style={styles.titleText}>Quizzes</Text>
                    <Text style={styles.subtitleText}>Select a course to manage</Text>
                </View>
            </View>

            {loading && courses.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                </View>
            ) : courses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="book-open-variant" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>No courses assigned yet</Text>
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
                        <View key={course._id} style={styles.courseCard}>
                            {/* Course Info */}
                            <View style={styles.courseInfo}>
                                <View style={styles.courseIconContainer}>
                                    <MaterialCommunityIcons name="book-education" size={22} color="rgb(23, 42, 70)" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.courseName}>{course.name}</Text>
                                    <Text style={styles.courseId}>ID: {course._id}</Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionRow}>
                                {/* Upload Grades */}
                                <TouchableOpacity
                                    style={styles.uploadBtn}
                                    activeOpacity={0.7}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/uploadgrades',
                                            params: { courseId: course._id, courseName: course.name },
                                        } as any)
                                    }
                                >
                                    <MaterialCommunityIcons name="cloud-upload-outline" size={16} color="white" />
                                    <Text style={styles.uploadBtnText}>Upload</Text>
                                </TouchableOpacity>

                                {/* Edit Grades */}
                                <TouchableOpacity
                                    style={styles.editBtn}
                                    activeOpacity={0.7}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/editgrade',
                                            params: { courseId: course._id, courseName: course.name },
                                        } as any)
                                    }
                                >
                                    <MaterialCommunityIcons name="pencil-outline" size={16} color="rgb(23, 42, 70)" />
                                    <Text style={styles.editBtnText}>Edit Grades</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                    <View style={{ height: 30 }} />
                </ScrollView>
            )}
        </View>
    );
};

export default TeacherGrades;

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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: 'rgb(23, 42, 70)',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    titleText: { fontSize: 22, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    subtitleText: { fontSize: 13, color: 'gray', marginTop: 2 },
    scrollView: { paddingHorizontal: 20 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 15, paddingBottom: 100 },
    emptyText: { fontSize: 16, color: '#aaa', fontWeight: '500' },

    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    courseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
    },
    courseIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#f0f4ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    courseName: { fontSize: 15, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    courseId: { fontSize: 11, color: '#999', marginTop: 2, fontWeight: '600' },

    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    uploadBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: 'rgb(23, 42, 70)',
        paddingVertical: 10,
        borderRadius: 10,
    },
    uploadBtnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

    editBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#f0f4ff',
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'rgb(23, 42, 70)',
    },
    editBtnText: { color: 'rgb(23, 42, 70)', fontWeight: 'bold', fontSize: 13 },
});