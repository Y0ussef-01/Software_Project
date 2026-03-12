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

const CourseDetails = () => {
    const { courseId, courseName, degrees } = useLocalSearchParams();

    const quizzes: { title: string; score: number }[] = degrees
        ? JSON.parse(degrees as string)
        : [];

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

            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Entypo name="chevron-with-circle-left" size={24} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.courseCard}>
                    <MaterialCommunityIcons name="book-open-variant" size={28} color="white" />
                    <View>
                        <Text style={styles.courseId}>{courseId}</Text>
                        <Text style={styles.courseName}>{courseName}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>📝 Grades</Text>

                {quizzes.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="clipboard-off" size={50} color="gray" />
                        <Text style={styles.emptyText}>No grades yet</Text>
                    </View>
                ) : (
                    quizzes.map((item, index) => {
                        const { name, total } = parseTitle(item.title);
                        return (
                            <View key={index} style={styles.quizCard}>
                                <Text style={styles.quizName}>{name}</Text>
                                <Text style={styles.quizScore}>
                                    {item.score}{total ? ` / ${total}` : ''}
                                </Text>
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
    content: {
        flex: 1,
        padding: 20,
    },
    courseCard: {
        backgroundColor: 'rgb(23, 42, 70)',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
        elevation: 5,
    },
    courseId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    courseName: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 3,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
        marginBottom: 12,
    },
    quizCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        shadowColor: 'rgb(23, 42, 70)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    quizName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
    },
    quizScore: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        gap: 10,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
});