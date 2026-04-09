import React, { useCallback, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    FlatList, ActivityIndicator, StatusBar, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import { getStudentProfile } from '../api/studentApi';

interface Course {
    courseId: string;
    courseName: string;
}

const CARD_COLORS = [
    '#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626', '#7C3AED'
];

const MyCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState('');

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            const fetchCourses = async () => {
                try {
                    setLoading(true);
                    const data = await getStudentProfile();

                    if (!isMounted) return;

                    setStudentName(data?.name?.split(' ')[0] || '');

                    const registeredCourses = data?.registeredCourses || [];

                    const seen = new Set<string>();
                    const result: Course[] = [];

                    registeredCourses.forEach((rc: any) => {
                        const courseId = rc.course?._id || rc.course || '';
                        const courseName = rc.course?.name || courseId;
                        if (courseId && !seen.has(courseId)) {
                            seen.add(courseId);
                            result.push({ courseId, courseName });
                        }
                    });

                    setCourses(result);
                } catch (err) {
                    console.log('Error fetching courses:', err);
                } finally {
                    if (isMounted) setLoading(false);
                }
            };
            fetchCourses();
            return () => { isMounted = false; };
        }, [])
    );

    const renderCourse = ({ item, index }: { item: Course; index: number }) => {
        const color = CARD_COLORS[index % CARD_COLORS.length];
        return (
            <TouchableOpacity
                style={styles.courseCard}
                activeOpacity={0.85}
                onPress={() => router.push({
                    pathname: '/courseperformance' as any,
                    params: {
                        courseId: item.courseId,
                        courseName: item.courseName,
                    }
                })}
            >
                <View style={[styles.colorBar, { backgroundColor: color }]} />
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                    <MaterialCommunityIcons name="book-open-variant" size={28} color={color} />
                </View>
                <View style={styles.courseInfo}>
                    <Text style={styles.courseId}>{item.courseId}</Text>
                    <Text style={styles.courseName} numberOfLines={2}>{item.courseName}</Text>
                    <View style={styles.tagRow}>
                        <View style={[styles.tag, { backgroundColor: color + '15' }]}>
                            <MaterialCommunityIcons name="chart-bar" size={12} color={color} />
                            <Text style={[styles.tagText, { color }]}>View Performance</Text>
                        </View>
                    </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Performance</Text>
                <View style={{ width: 26 }} />
            </View>

            <View style={styles.banner}>
                <View>
                    <Text style={styles.bannerSub}>Hello, {studentName} 👋</Text>
                    <Text style={styles.bannerMain}>Select a course to view{'\n'}your performance & AI insights</Text>
                </View>
                <MaterialCommunityIcons name="brain" size={45} color="rgba(255,255,255,0.2)" />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                    <Text style={styles.loadingText}>Loading your courses...</Text>
                </View>
            ) : courses.length === 0 ? (
                <View style={styles.centerContainer}>
                    <MaterialCommunityIcons name="book-off-outline" size={64} color="#cbd5e1" />
                    <Text style={styles.emptyText}>No courses registered</Text>
                </View>
            ) : (
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.courseId}
                    renderItem={renderCourse}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default MyCourses;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: Platform.OS === 'ios' ? 55 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
    },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    banner: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 20,
        paddingBottom: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 },
    bannerMain: { color: '#fff', fontSize: 15, fontWeight: 'bold', lineHeight: 22 },
    listContent: { padding: 16, gap: 12 },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        paddingRight: 15,
        paddingVertical: 16,
    },
    colorBar: { width: 5, height: '100%', borderRadius: 5, marginRight: 14 },
    iconContainer: {
        width: 52, height: 52, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    courseInfo: { flex: 1 },
    courseId: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginBottom: 3 },
    courseName: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 8, lineHeight: 21 },
    tagRow: { flexDirection: 'row' },
    tag: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    },
    tagText: { fontSize: 11, fontWeight: 'bold' },
    centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { color: '#94a3b8', fontSize: 14 },
    emptyText: { color: '#94a3b8', fontSize: 16, fontWeight: 'bold' },
});