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
import { FONTS } from '../constants/theme';
import { getStudentProfile } from '../api/studentApi';
import { getTeacherProfile } from '../api/teacherApi'; 
import { getRole, getCache, saveCache } from '../api/storage';

const PROFILE_CACHE_KEY = 'user_profile_cache';

interface StudentData {
  _id: string;
  name: string;
  email: string;
  department: string;
  grade: string;
  GPA: number;
  hours: number;
  maxHours: number;
  profileImg: string;
}

interface TeacherData {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  degree?: string;
  profileImg: string;
}

const Propage = () => {
  const [userData, setUserData] = useState<StudentData | TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRole = await getRole();
        setRole(userRole);

        const cachedProfile = await getCache(PROFILE_CACHE_KEY);
        if (cachedProfile) {
          setUserData(cachedProfile);
          setLoading(false);
        }

        let freshData;
        if (userRole === 'teacher') {
          freshData = await getTeacherProfile();
        } else {
          freshData = await getStudentProfile();
        }

        setUserData(freshData);
        await saveCache(PROFILE_CACHE_KEY, freshData);

      } catch (err: any) {
        console.log('❌ Profile Sync Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleBack = () => {
    if (role === 'teacher') {
      router.push('/hometeacher' as any);
    } else {
      router.push('/home' as any);
    }
  };

  if (loading && !userData) {
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
      
      {/* الهيدر الأساسي */}
      <View style={styles.HeaderStyle}>
        <TouchableOpacity onPress={handleBack}>
          <Entypo name="chevron-with-circle-left" size={28} color="white" />
        </TouchableOpacity>
        <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}>
        
        {/* كارت البروفايل العلوي */}
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
          <Text style={styles.userNameText}>{userData?.name || 'User Name'}</Text>
          <View style={styles.roleBadge}>
             <MaterialCommunityIcons 
                name={role === 'student' ? "school" : "account-tie"} 
                size={14} 
                color="rgb(23, 42, 70)" 
             />
             <Text style={styles.roleBadgeText}>
                {role === 'student' ? 'Student' : 'Faculty Member'}
             </Text>
          </View>
        </View>

        {/* معلومات الحساب */}
        <View style={styles.infoSection}>
            <InfoField icon="id-card" label="ID Number" value={userData?._id} />
            <InfoField icon="email-outline" label="Academic Email" value={userData?.email} />

            {role === 'student' && (
            <>
                <InfoField icon="domain" label="Department" value={(userData as StudentData).department} />
                <InfoField icon="layers-outline" label="Academic Level" value={(userData as StudentData).grade} />
                <InfoField icon="chart-areaspline" label="Current GPA" value={(userData as StudentData).GPA?.toString()} />
                
                {/* شريط التقدم للساعات الأكاديمية */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTextRow}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                             <MaterialCommunityIcons name="clock-check-outline" size={20} color="gray" />
                             <Text style={styles.progressLabel}>Academic Hours</Text>
                        </View>
                        <Text style={styles.progressValue}>
                            {`${(userData as StudentData).hours || 0} / ${(userData as StudentData).maxHours || 0}`}
                        </Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { 
                            width: (userData as StudentData).maxHours > 0 
                                ? `${((userData as StudentData).hours / (userData as StudentData).maxHours) * 100}%` 
                                : '0%' 
                        }]} />
                    </View>
                </View>
            </>
            )}

            {role === 'teacher' && (
            <>
                <InfoField icon="briefcase-variant-outline" label="Specialization" value={(userData as TeacherData).specialization} />
                <InfoField icon="medal-outline" label="Academic Degree" value={(userData as TeacherData).degree} />
            </>
            )}
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
        <Text style={styles.fieldValueText} numberOfLines={1}>{value || '---'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgb(23, 42, 70)' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  HeaderStyle: {
    width: '100%', height: 110, backgroundColor: 'rgb(23, 42, 70)',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  imageStyle: { height: 40, width: 110, resizeMode: 'contain' },
  mainContainer: {
    flex: 1, backgroundColor: '#f8fafc', 
    borderTopLeftRadius: 35, borderTopRightRadius: 35,
    paddingHorizontal: 20,
  },
  profileHeaderCard: {
    alignItems: 'center', backgroundColor: '#ffffff',
    borderRadius: 25, padding: 20, marginTop: 25, marginBottom: 20,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
  },
  avatarWrapper: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 4, borderColor: '#f1f5f9',
    overflow: 'hidden', marginBottom: 12,
  },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  userNameText: { fontSize: 20, fontWeight: 'bold', color: 'rgb(23, 42, 70)', textAlign: 'center' },
  roleBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#f1f5f9', paddingHorizontal: 12, 
    paddingVertical: 5, borderRadius: 12, marginTop: 8 
  },
  roleBadgeText: { fontSize: 13, color: 'rgb(23, 42, 70)', fontWeight: '600' },
  infoSection: { gap: 12 },
  fieldCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', borderRadius: 18,
    padding: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03,
  },
  fieldIconContainer: {
    width: 45, height: 45, borderRadius: 12,
    backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  fieldTextContainer: { flex: 1 },
  fieldLabelText: { fontSize: 12, color: '#94a3b8', fontWeight: '600', marginBottom: 2 },
  fieldValueText: { fontSize: 15, color: '#1e293b', fontWeight: 'bold' },
  progressContainer: { backgroundColor: '#ffffff', borderRadius: 18, padding: 18, marginTop: 5, elevation: 2 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressLabel: { fontSize: 14, color: '#1e293b', fontWeight: 'bold' },
  progressValue: { fontSize: 14, color: 'rgb(23, 42, 70)', fontWeight: 'bold' },
  progressBarBg: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: 'rgb(23, 42, 70)', borderRadius: 4 },
});

export default Propage;