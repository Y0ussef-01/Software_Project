import Entypo from '@expo/vector-icons/Entypo';
import { Stack, router } from "expo-router";
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import API from '../api/axiosConfig';

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

const StudentGrades = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await API.get('/student/grades');
                const rawGrades: Course[] = res.data?.grades || [];

                
                const seen = new Map<string, Course>();
                rawGrades.forEach((c) => {
                    if (seen.has(c.courseId)) {
                       
                        const existing = seen.get(c.courseId)!;
                        existing.Degrees = [...existing.Degrees, ...c.Degrees];
                    } else {
                        seen.set(c.courseId, { ...c, Degrees: [...c.Degrees] });
                    }
                });

                setCourses(Array.from(seen.values()));
            } catch (err) {
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Entypo name="chevron-with-circle-left" size={24} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>

            <View style={styles.titleContainer}>
                <MaterialCommunityIcons name="pencil-box-multiple" size={28} color="rgb(23, 42, 70)" />
                <Text style={styles.titleText}>My Courses</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="rgb(23, 42, 70)" style={{ marginTop: 40 }} />
            ) : courses.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="book-off" size={50} color="gray" />
                    <Text style={styles.emptyText}>No courses found</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {courses.map((course) => (
                        <TouchableOpacity
                            key={course.courseId}
                            style={styles.courseCard}
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
                                <Text style={styles.courseId}>{course.courseId}</Text>
                                <Text style={styles.courseName}>{course.courseName}</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color="rgb(23, 42, 70)" />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default StudentGrades;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    HeaderStyle: {
        width: '100%',
        height: 120,
        backgroundColor: 'rgb(23, 42, 70)',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imageStyle: {
        height: 50,
        width: '40%',
        resizeMode: 'contain',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    courseCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: 'rgb(23, 42, 70)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    courseInfo: {
        gap: 5,
    },
    courseId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
    },
    courseName: {
        fontSize: 14,
        color: 'gray',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
});