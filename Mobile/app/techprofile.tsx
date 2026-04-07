import Entypo from '@expo/vector-icons/Entypo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
    Platform
} from 'react-native';
import { getTeacherProfile } from '../api/teacherApi';

const TechProfile = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getTeacherProfile();
                const finalData = data?.user || data;
                setUserData(finalData);
            } catch (err: any) {
                console.log('Failed to load profile');
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
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.push('/hometeacher')}>
                    <Entypo name="chevron-with-circle-left" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                
                {/* Profile Header Card */}
                <View style={styles.profileHeaderCard}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={
                                (userData?.profileImg && !userData.profileImg.includes('default')) 
                                    ? { uri: userData.profileImg } 
                                    : require('../assets/images/11.png')
                            }
                            style={styles.avatarImage}
                        />
                    </View>
                    <Text style={styles.userNameText}>Dr. {userData?.name || 'Academic Member'}</Text>
                    <View style={styles.roleBadge}>
                        <MaterialCommunityIcons name="seal-variant" size={14} color="rgb(23, 42, 70)" />
                        <Text style={styles.roleBadgeText}>Faculty Member</Text>
                    </View>
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <View style={styles.fieldCard}>
                        <View style={styles.fieldIconContainer}>
                            <MaterialCommunityIcons name="account" size={22} color="rgb(23, 42, 70)" />
                        </View>
                        <View style={styles.fieldTextContainer}>
                            <Text style={styles.fieldLabelText}>Academic ID</Text>
                            <Text style={styles.fieldValueText}>{userData?._id ? String(userData._id) : 'Not Available'}</Text>
                        </View>
                    </View>

                    <InfoField 
                        icon="email-outline" 
                        label="Academic Email" 
                        value={userData?.email} 
                    />
                    <InfoField 
                        icon="office-building-marker-outline" 
                        label="Department" 
                        value={userData?.department} 
                    />
                    <InfoField 
                        icon="certificate-outline" 
                        label="Specialization" 
                        value={userData?.specialization || 'General'} 
                    />
                    <InfoField 
                        icon="school-outline" 
                        label="Scientific Degree" 
                        value={userData?.degree || 'Professor'} 
                    />
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

const InfoField = ({ icon, label, value }: { icon: string; label: string; value?: string }) => (
    <View style={styles.fieldCard}>
        <View style={styles.fieldIconContainer}>
            <MaterialCommunityIcons name={icon as any} size={22} color="rgb(23, 42, 70)" />
        </View>
        <View style={styles.fieldTextContainer}>
            <Text style={styles.fieldLabelText}>{label}</Text>
            <Text style={styles.fieldValueText}>{value || '---'}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'rgb(23, 42, 70)' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
    HeaderStyle: {
        width: '100%', height: 110, backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 35,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    imageStyle: { height: 40, width: 110, resizeMode: 'contain' },
    mainContainer: { flex: 1, backgroundColor: '#f8fafc', borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 20 },
    profileHeaderCard: {
        alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 25, padding: 20, marginTop: 25, marginBottom: 20,
        elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
    },
    avatarWrapper: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#f1f5f9', overflow: 'hidden', marginBottom: 12 },
    avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    userNameText: { fontSize: 20, fontWeight: 'bold', color: 'rgb(23, 42, 70)', textAlign: 'center' },
    roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginTop: 8 },
    roleBadgeText: { fontSize: 13, color: 'rgb(23, 42, 70)', fontWeight: '600' },
    infoSection: { gap: 12 },
    fieldCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 18, padding: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03 },
    fieldIconContainer: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    fieldTextContainer: { flex: 1 },
    fieldLabelText: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginBottom: 2 },
    fieldValueText: { fontSize: 15, color: '#1e293b', fontWeight: 'bold' },
});

export default TechProfile;