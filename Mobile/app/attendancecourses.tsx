import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    FlatList, ActivityIndicator, StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import API from '../api/axiosConfig';

interface Course {
    courseId: string;
    courseName: string;
    groupName: string;
}

const AttendanceCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await API.get('/student/Profile');
            const registeredCourses = res.data?.registeredCourses || [];

            const lectureGroups: Course[] = [];
            const seen = new Set<string>();

            registeredCourses.forEach((rc: any) => {
                const courseId = rc.course?._id || rc.course || '';
                const courseName = rc.course?.name || courseId;
                const groupName = rc.group?.groupName || rc.group?.name || rc.groupName || '';

                if (groupName.toLowerCase().includes('lecture') && !seen.has(courseId)) {
                    seen.add(courseId);
                    lectureGroups.push({ courseId, courseName, groupName });
                }
            });

            if (lectureGroups.length === 0) {
                const allCourses: Course[] = [];
                const seenAll = new Set<string>();
                registeredCourses.forEach((rc: any) => {
                    const courseId = rc.course?._id || rc.course || '';
                    const courseName = rc.course?.name || courseId;
                    const groupName = rc.group?.groupName || rc.group?.name || rc.groupName || '';
                    if (!seenAll.has(courseId)) {
                        seenAll.add(courseId);
                        allCourses.push({ courseId, courseName, groupName });
                    }
                });
                setCourses(allCourses);
            } else {
                setCourses(lectureGroups);
            }
        } catch (err) {
            console.log('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCoursePress = (course: Course) => {
        router.push({
            pathname: '/scanqr' as any,
            params: {
                courseId: course.courseId,
                courseName: course.courseName,
                groupName: course.groupName,
            }
        });
    };

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

            <View style={styles.content}>
                <Text style={styles.subtitle}>Select a course to scan QR</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" style={{ marginTop: 40 }} />
                ) : courses.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="book-off-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No courses registered</Text>
                    </View>
                ) : (
                    <FlatList
                        data={courses}
                        keyExtractor={(item) => item.courseId}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.courseCard}
                                onPress={() => handleCoursePress(item)}
                                activeOpacity={0.85}
                            >
                                <View style={styles.courseIconContainer}>
                                    <MaterialCommunityIcons
                                        name="qrcode-scan"
                                        size={30}
                                        color="rgb(23, 42, 70)"
                                    />
                                </View>
                                <View style={styles.courseInfo}>
                                    <Text style={styles.courseName}>{item.courseName}</Text>
                                    <Text style={styles.groupName}>{item.groupName}</Text>
                                </View>
                                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default AttendanceCourses;

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
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 18,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: 'rgb(23, 42, 70)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    courseIconContainer: {
        width: 55,
        height: 55,
        borderRadius: 12,
        backgroundColor: '#f0f4ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    courseInfo: { flex: 1 },
    courseName: { fontSize: 16, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    groupName: { fontSize: 13, color: '#888', marginTop: 4 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
    emptyText: { fontSize: 16, color: '#aaa', marginTop: 15 },
});
