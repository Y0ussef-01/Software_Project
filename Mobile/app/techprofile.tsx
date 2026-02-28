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
import { FONTS } from '../constants/theme';
import { getTeacherProfile } from '../api/teacherApi';

interface TeacherData {
    _id: string;
    name: string;
    email: string;
    department: string;
    profileImg: string;
}

const TechProfile = () => {
    const [userData, setUserData] = useState<TeacherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getTeacherProfile();
                setUserData(data);
            } catch (err: any) {
                console.log('❌ Error:', err.message);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                <Text style={{ marginTop: 10, color: 'rgb(23, 42, 70)' }}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
                <TouchableOpacity onPress={() => router.replace('/' as any)} style={styles.retryButton}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.HeaderStyle}>
                <View style={[{ flexDirection: 'row' }, { gap: 20 }, { alignItems: 'center' }]}>
                    <TouchableOpacity onPress={() => router.push('/hometeacher' as any)}>
                        <Entypo name="chevron-with-circle-left" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>

            <ScrollView style={styles.mainContainer}>
                <View style={styles.profileContainer}>
                    <View style={styles.imageContainer}>
                        {/* ✅ لو الصورة حقيقية تظهر، غير كده صورة 11 */}
                        <Image
                            source={
                                userData?.profileImg && userData.profileImg !== 'default-teacher.jpg'
                                    ? { uri: userData.profileImg }
                                    : require('../assets/images/11.png')
                            }
                            style={styles.imagePROStyle}
                        />
                    </View>
                    <View style={{ flexShrink: 1 }}>
                        <Text style={styles.dataLabelDR}>DR</Text>
                        <Text style={styles.nameText}>{userData?.name}</Text>
                    </View>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.dataLabel}>ID</Text>
                    <Text style={styles.dataValue}>{userData?._id}</Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.dataLabel}>Department</Text>
                    <Text style={styles.dataValue}>{userData?.department}</Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.dataLabel}>Email</Text>
                    <Text style={styles.dataValue}>{userData?.email}</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default TechProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4ff',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: 'rgb(23, 42, 70)',
        padding: 12,
        borderRadius: 8,
    },
    HeaderStyle: {
        width: '100%',
        height: 120,
        backgroundColor: "rgb(23, 42, 70)",
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
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        margin: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#5a5c5c',
        alignSelf: 'flex-end',
    },
    imagePROStyle: {
        width: '100%',
        height: 120,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
    },
    nameText: {
        fontFamily: FONTS.bold,
        fontSize: 20,
    },
    dataLabelDR: {
        fontWeight: 'bold',
        color: '#03015d',
        width: 100,
        fontSize: 20,
    },
    fieldContainer: {
        backgroundColor: '#ebebeb',
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    dataRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dataLabel: {
        fontWeight: 'bold',
        color: "rgb(23, 42, 70)",
        width: 100,
    },
    dataValue: {
        color: '#000000',
        flexShrink: 1,
        fontSize: 13,
        fontFamily: FONTS.bold,
    },
});
