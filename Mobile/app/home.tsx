import React, { useRef, useState, useCallback } from 'react';
import { StatusBar } from "react-native";
import { Animated, View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from "expo-router";
import { getRole, clearStorage } from '../api/storage';
import { getStudentProfile, clearProfileCache } from '../api/studentApi';
import { getTeacherProfile, clearTeacherCache } from '../api/teacherApi';
import API from '../api/axiosConfig';

const { width } = Dimensions.get('window');

interface GridItemProps {
    id: string;
    icon: string;
    label: string;
    onPress: () => void;
    pressedItem: string | null;
    setPressedItem: (id: string | null) => void;
}

interface DrawerItemProps {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
}

const Home = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [pressedItem, setPressedItem] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [userName, setUserName] = useState<string>('');

    const drawerAnim = useRef(new Animated.Value(-300)).current;

    const openDrawer = () => {
        setDrawerOpen(true);
        Animated.timing(drawerAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    };

    const closeDrawer = () => {
        Animated.timing(drawerAnim, { toValue: -300, duration: 300, useNativeDriver: true }).start(() => setDrawerOpen(false));
    };

    const toggleDrawer = () => drawerOpen ? closeDrawer() : openDrawer();

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            
            setProfileImg(null);
            setUserName('');
            setUnreadCount(0);
            setRole(null);

            const fetchData = async () => {
                try {
                    const userRole = await getRole();
                    if (isMounted) setRole(userRole);

                    let profileData: any;
                    if (userRole === 'student') {
                        profileData = await getStudentProfile();
                    } else if (userRole === 'teacher') {
                        profileData = await getTeacherProfile();
                    }

                    if (isMounted && profileData) {
                        setProfileImg(profileData.profileImg || null);
                        setUserName(profileData.name || '');
                    }

                    const res = await API.get(userRole === 'teacher' ? '/teacher/notifications' : '/student/notifications');
                    if (isMounted) {
                        const unread = res.data.filter((n: any) => !n.read).length;
                        setUnreadCount(unread);
                    }
                } catch (err) {
                    console.log('❌ Error syncing home data:', err);
                }
            };
            fetchData();
            return () => { isMounted = false; };
        }, [])
    );

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out', style: 'destructive',
                onPress: async () => {
                    try {
                        await API.put(`/${role}/registerToken`, { pushToken: null });
                    } catch (e) { console.log("Token clear error"); }

                    await clearStorage();

                   
                    await clearProfileCache();
                    await clearTeacherCache();
                    
                    setProfileImg(null);
                    setUserName('');
                    setRole(null);
                    setUnreadCount(0);

                    router.replace('/');
                },
            },
        ]);
    };

    const navigateTo = (path: string) => {
        if (drawerOpen) closeDrawer();
        router.push(path as any);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" backgroundColor="rgb(23, 42, 70)" />

            {/* --- Main Header --- */}
            <View style={styles.HeaderStyle}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={toggleDrawer}>
                        <MaterialCommunityIcons name="menu" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigateTo('/notifications')}
                        style={styles.bellContainer}
                    >
                        <MaterialCommunityIcons name="bell" size={26} color="white" />
                        {unreadCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unreadCount > 99 ? '99' : unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Welcome Card */}
                <View style={styles.welcomeCard}>
                    <View>
                        <Text style={styles.welcomeSubText}>Welcome back, {userName.split(' ')[0]}</Text>
                        <Text style={styles.welcomeMainText}>Keep up your{"\n"}scientific excellence</Text>
                    </View>
                    <MaterialCommunityIcons name="auto-fix" size={50} color="rgba(255,255,255,0.2)" style={styles.welcomeIcon} />
                </View>

                <Text style={styles.sectionTitle}>Academic Services</Text>

                <View style={styles.gridContainer}>
                    <View style={styles.rowContainer}>
                        <GridItem
                            id="attendance" icon="calendar-check" label="Attendance"
                            onPress={() => navigateTo('/attendancecourses')}
                            pressedItem={pressedItem} setPressedItem={setPressedItem}
                        />
                        <GridItem
                            id="schedule" icon="calendar-month" label="Schedule"
                            onPress={() => navigateTo('/teacherschedule')}
                            pressedItem={pressedItem} setPressedItem={setPressedItem}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <GridItem
                            id="eval" icon="star-circle" label="Evaluation"
                            onPress={() => navigateTo('/teacherevaluation')}
                            pressedItem={pressedItem} setPressedItem={setPressedItem}
                        />
                        <GridItem
                            id="quizzes" icon="pencil-box-multiple" label="Quizzes"
                            onPress={() => navigateTo(role === 'teacher' ? '/quizzes' : '/studentgrades')}
                            pressedItem={pressedItem} setPressedItem={setPressedItem}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <GridItem
                            id="grades" icon="clipboard-text" label="Final Grades"
                            onPress={() => navigateTo('/teachergrades')}
                            pressedItem={pressedItem} setPressedItem={setPressedItem}
                        />
                        <GridItem
                            id="courses" icon="book-open-variant" label="Courses"
                            onPress={() => navigateTo(role === 'teacher' ? '/teachercourses' : '/studentgrades')}
                            pressedItem={pressedItem} setPressedItem={setPressedItem}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* --- Overlay & Improved Drawer --- */}
            {drawerOpen && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDrawer} />}

            <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
                {/* 1. Slim Integrated Top Bar */}
                <View style={styles.drawerTopBar}>
                    <Image source={require('../assets/images/logo(1).png')} style={styles.miniLogo} />
                </View>

                {/* 2. Compact Profile Card */}
                <View style={styles.drawerProfileCard}>
                    <View style={styles.miniImageContainer}>
                        <Image
                            source={(profileImg && !profileImg.includes('default')) ? { uri: profileImg } : require('../assets/images/11.png')}
                            style={styles.imagePROStyle}
                        />
                    </View>
                    <View style={styles.profileTextWrapper}>
                        <Text style={styles.drawerUserName} numberOfLines={1}>{userName || 'User'}</Text>
                        <View style={styles.roleBadgeContainer}>
                            <MaterialCommunityIcons name="school" size={12} color="#64748b" />
                            <Text style={styles.roleBadgeText}>{role === 'student' ? 'Student' : 'Teacher'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* 3. Menu Items */}
                <View style={styles.drawerMenu}>
                    <DrawerItem icon="account-circle-outline" label="Profile Page" onPress={() => navigateTo(role === 'student' ? '/propage' : '/techprofile')} />
                    <DrawerItem icon="lock-reset" label="Reset Password" onPress={() => navigateTo('/password')} />
                    <DrawerItem icon="bell-outline" label="Notifications" onPress={() => navigateTo('/notifications')} />

                    {/* 4. Bottom Logout Button */}
                    <View style={styles.bottomLogoutWrapper}>
                        <TouchableOpacity style={styles.logoutBtnNew} onPress={handleLogout}>
                            <MaterialCommunityIcons name="logout" size={22} color="#ef5350" />
                            <Text style={styles.logoutTextNew}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const GridItem = ({ id, icon, label, onPress, pressedItem, setPressedItem }: GridItemProps) => (
    <TouchableOpacity
        activeOpacity={1}
        style={[styles.gridItem, pressedItem === id && styles.gridItemActive]}
        onPressIn={() => setPressedItem(id)}
        onPressOut={() => setPressedItem(null)}
        onPress={onPress}
    >
        <View style={[styles.iconContainer, pressedItem === id && styles.iconContainerActive]}>
            <MaterialCommunityIcons name={icon as any} size={32} color={pressedItem === id ? '#fff' : 'rgb(23, 42, 70)'} />
        </View>
        <Text style={[styles.gridText, pressedItem === id && styles.gridTextActive]}>{label}</Text>
    </TouchableOpacity>
);

const DrawerItem = ({ icon, label, onPress, color = '#1e293b' }: DrawerItemProps) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
        <View style={styles.drawerItemIconBg}>
            <MaterialCommunityIcons name={icon as any} size={22} color="rgb(23, 42, 70)" />
        </View>
        <Text style={[styles.drawerText, { color }]}>{label}</Text>
    </TouchableOpacity>
);

export default Home;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    HeaderStyle: {
        width: '100%', height: 110, backgroundColor: "rgb(23, 42, 70)",
        paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 45 : 35,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        elevation: 10, shadowColor: '#000', shadowOpacity: 0.3,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 20 },
    bellContainer: { position: 'relative' },
    imageStyle: { height: 40, width: 110, resizeMode: 'contain' },
    welcomeCard: {
        backgroundColor: 'rgb(23, 42, 70)', margin: 15, borderRadius: 25,
        padding: 25, elevation: 8, shadowColor: '#000', shadowOpacity: 0.2,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    welcomeSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 5 },
    welcomeMainText: { color: '#fff', fontSize: 20, fontWeight: 'bold', lineHeight: 28 },
    welcomeIcon: { position: 'absolute', right: -10, bottom: -10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'rgb(23, 42, 70)', paddingHorizontal: 20, marginVertical: 10 },
    gridContainer: { paddingHorizontal: 15 },
    rowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    gridItem: { width: '47%', backgroundColor: '#fff', borderRadius: 22, height: 130, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
    gridItemActive: { backgroundColor: "rgb(23, 42, 70)" },
    iconContainer: { backgroundColor: '#f0f4ff', borderRadius: 15, padding: 12, marginBottom: 8 },
    iconContainerActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
    gridText: { fontSize: 14, fontWeight: 'bold', color: "rgb(23, 42, 70)" },
    gridTextActive: { color: '#fff' },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#ef5350', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgb(23, 42, 70)' },
    badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 },
    drawer: { position: 'absolute', top: 0, left: 0, width: 300, height: '100%', backgroundColor: '#F8FAFC', zIndex: 999 },
    drawerTopBar: { backgroundColor: "rgb(23, 42, 70)", height: 120, justifyContent: 'center', alignItems: 'center', paddingTop: 40, borderBottomRightRadius: 30 },
    miniLogo: { width: 120, height: 35, resizeMode: 'contain' },
    drawerProfileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05 },
    miniImageContainer: { width: 55, height: 55, borderRadius: 27.5, overflow: 'hidden', borderWidth: 2, borderColor: '#f1f5f9' },
    imagePROStyle: { width: '100%', height: '100%' },
    profileTextWrapper: { flex: 1, marginLeft: 15 },
    drawerUserName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    roleBadgeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4, backgroundColor: '#f1f5f9', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
    roleBadgeText: { fontSize: 12, color: '#64748b', fontWeight: 'bold', marginLeft: 5 },
    divider: { height: 1, backgroundColor: '#e2e8f0', marginHorizontal: 20, marginVertical: 10 },
    drawerMenu: { flex: 1, paddingHorizontal: 15 },
    drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
    drawerItemIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f1f5ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    drawerText: { fontSize: 15, fontWeight: '600' },
    bottomLogoutWrapper: { flex: 1, justifyContent: 'flex-end', marginBottom: 30 },
    logoutBtnNew: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 15, borderWidth: 1.5, borderColor: '#fee2e2', backgroundColor: '#fff' },
    logoutTextNew: { color: '#ef5350', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});