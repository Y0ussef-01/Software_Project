import React, { useState, useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// استيراد دالة الكاش الموحدة
import { getStudentProfile } from '../api/studentApi';

interface Quiz {
    title: string;
    score: number;
}

const CourseDetails = () => {
    const { courseId, courseName, degrees: initialDegrees } = useLocalSearchParams();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        // 1. عرض البيانات القادمة من الصفحة السابقة فوراً
        if (initialDegrees) {
            try {
                setQuizzes(JSON.parse(initialDegrees as string));
            } catch (e) {
                console.error("JSON Parse error:", e);
            }
        }
        
        // 2. مزامنة الدرجات مع الكاش الموحد لضمان الدقة
        syncWithGlobalCache();
    }, [initialDegrees]);

    const syncWithGlobalCache = async () => {
        try {
            const profile = await getStudentProfile(); // تجلب من الكاش أو تحدث في الخلفية
            const currentCourse = profile.registeredCourses?.find(
                (rc: any) => (rc.course?._id || rc.course) === courseId
            );
            
            if (currentCourse?.degrees) {
                setQuizzes(currentCourse.degrees);
            }
        } catch (err) {
            console.log("Sync error in CourseDetails:", err);
        }
    };

    const parseTitle = (title: string) => {
        const parts = title.split('/');
        return {
            name: parts[0]?.trim() || title,
            total: parts[1]?.trim() || null,
        };
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                    <Entypo name="chevron-with-circle-left" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
                <View style={{ width: 28 }} /> 
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* كارت معلومات المادة */}
                <View style={styles.courseCard}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="book-open-variant" size={26} color="rgb(23, 42, 70)" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.courseIdText}>{courseId}</Text>
                        <Text style={styles.courseNameText}>{courseName}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>📝 الدرجات (Grades)</Text>

                {quizzes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-off-outline" size={60} color="#cbd5e0" />
                        <Text style={styles.emptyText}>لا توجد درجات مسجلة حالياً</Text>
                    </View>
                ) : (
                    quizzes.map((item, index) => {
                        const { name, total } = parseTitle(item.title);
                        return (
                            <View key={index} style={styles.quizCard}>
                                <View style={styles.quizInfo}>
                                    <Text style={styles.quizName}>{name}</Text>
                                    <Text style={styles.quizDate}>اختبار تقييمي</Text>
                                </View>
                                <View style={styles.scoreBadge}>
                                    <Text style={styles.quizScore}>
                                        {item.score}
                                        <Text style={styles.totalScore}>{total ? ` / ${total}` : ''}</Text>
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
};

export default CourseDetails;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    HeaderStyle: {
        width: '100%',
        height: 110,
        backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 8,
    },
    imageStyle: { height: 45, width: 120, resizeMode: 'contain' },
    content: { flex: 1, padding: 20 },
    courseCard: {
        backgroundColor: 'rgb(23, 42, 70)',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    courseIdText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    courseNameText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1a202c', marginBottom: 15, marginLeft: 5 },
    quizCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#edf2f7',
        elevation: 2,
    },
    quizInfo: { flex: 1 },
    quizName: { fontSize: 16, fontWeight: '700', color: '#2d3748' },
    quizDate: { fontSize: 12, color: '#a0aec0', marginTop: 4 },
    scoreBadge: {
        backgroundColor: '#f0f4ff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    quizScore: { fontSize: 17, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    totalScore: { fontSize: 13, color: '#718096' },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
    emptyText: { fontSize: 15, color: '#a0aec0', marginTop: 10, fontWeight: '500' },
});