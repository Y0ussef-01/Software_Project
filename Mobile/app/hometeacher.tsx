import React, { useRef, useState, useCallback } from 'react';
import { StatusBar } from "react-native";
import { Animated, View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useFocusEffect } from "expo-router";
import { getTeacherProfile, clearTeacherCache } from '../api/teacherApi'; 
import { clearProfileCache } from '../api/studentApi';                    
import { clearStorage } from '@/api/storage';

const { width } = Dimensions.get('window');

const HomeTeacher = () => {
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [pressedItem, setPressedItem] = useState<string | null>(null);
    const [teacherData, setTeacherData] = useState({
        name: '',
        img: null as string | null,
    });

    
    const drawerAnim = useRef(new Animated.Value(-300)).current;

    const openDrawer = () => {
        setDrawerOpen(true);
        Animated.timing(drawerAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    };

    const closeDrawer = () => {
        Animated.timing(drawerAnim, { toValue: -300, duration: 300, useNativeDriver: true }).start(() => setDrawerOpen(false));
    };

   
    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            setTeacherData({ name: '', img: null });

            const syncTeacherProfile = async () => {
                try {
                    const data = await getTeacherProfile();
                    if (isMounted) {
                        setTeacherData({
                            name: data.name || 'Professor',
                            img: (data.profileImg && !data.profileImg.includes('default')) ? data.profileImg : null
                        });
                    }
                } catch (err) {
                    console.log('❌ Sync Error:', err);
                }
            };
            syncTeacherProfile();
            return () => { isMounted = false; };
        }, [])
    );

  
    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out from your academic account?', [
            { text: 'Stay', style: 'cancel' },
            {
                text: 'Log Out', style: 'destructive',
                onPress: async () => {
                    await clearStorage();

                    await clearTeacherCache();
                    await clearProfileCache();

                    setTeacherData({ name: '', img: null });

                    router.replace('/');
                },
            },
        ]);
    };

    const navigateTo = (path: string) => {
        if (drawerOpen) closeDrawer();
        router.push(path as any);
    };

    const menuItems = [
        { id: 'attendance', title: 'Attendance', icon: 'calendar-check', path: '/teacherattendance' },
        { id: 'schedule', title: 'Schedule', icon: 'calendar-clock', path: '/teacherschedule' },
        { id: 'notification', title: 'Send Notification', icon: 'bell-ring-outline', path: '/sendnotification' },
        { id: 'quizzes', title: 'Quizzes', icon: 'file-document-edit-outline', path: '/quizzes' },
    ];

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" backgroundColor="rgb(23, 42, 70)" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.iconBtn}>
                    <MaterialCommunityIcons name="menu" size={28} color="white" />
                </TouchableOpacity>
                
                {/* التعديل هنا: اللوجو بقى هو العنصر التاني وبكده هيروح في اليمين مكان الجرس */}
                <Image source={require('../assets/images/logo(1).png')} style={styles.logo} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                {/* Welcome Card */}
                <View style={styles.welcomeCard}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.welcomeSubText}>Good Day, Dr. {teacherData.name.split(' ')[0]}</Text>
                        <Text style={styles.welcomeMainText}>Inspiring the next generation{"\n"}of leaders today.</Text>
                    </View>
                    <MaterialCommunityIcons name="school-outline" size={60} color="rgba(255,255,255,0.15)" />
                </View>

                <Text style={styles.sectionTitle}>Academic Management</Text>

                <View style={styles.gridContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            activeOpacity={1}
                            style={[styles.gridItem, pressedItem === item.id && styles.gridItemActive]}
                            onPressIn={() => setPressedItem(item.id)}
                            onPressOut={() => setPressedItem(null)}
                            onPress={() => navigateTo(item.path)}
                        >
                            <View style={[styles.iconBox, pressedItem === item.id && styles.iconBoxActive]}>
                                <MaterialCommunityIcons
                                    name={item.icon as any}
                                    size={30}
                                    color={pressedItem === item.id ? '#fff' : 'rgb(23, 42, 70)'}
                                />
                            </View>
                            <Text style={[styles.gridLabel, pressedItem === item.id && { color: '#fff' }]}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Sidebar Drawer */}
            {drawerOpen && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeDrawer} />}
            <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
                <View style={styles.drawerTop}>
                    <View style={styles.drawerAvatarWrapper}>
                        <Image
                            source={teacherData.img ? { uri: teacherData.img } : require('../assets/images/11.png')}
                            style={styles.drawerAvatar}
                        />
                    </View>
                    <Text style={styles.drawerNameText}>Dr. {teacherData.name}</Text>
                    <Text style={styles.drawerSubText}>Faculty Member</Text>
                </View>

                <View style={styles.drawerMenu}>
                    <DrawerItem icon="account-circle-outline" label="My Profile" onPress={() => navigateTo('/techprofile')} />
                    <DrawerItem icon="lock-reset" label="Reset Password" onPress={() => navigateTo('/password')} />
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.logoutBtnNew} onPress={handleLogout}>
                        <MaterialCommunityIcons name="logout" size={22} color="#ef5350" />
                        <Text style={styles.logoutTextNew}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
};

const DrawerItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color="rgb(23, 42, 70)" />
        <Text style={styles.drawerItemText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    header: {
        width: '100%', height: 110, backgroundColor: "rgb(23, 42, 70)",
        paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 45 : 35,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5,
    },
    iconBtn: { padding: 5 },
    logo: { height: 35, width: 100, resizeMode: 'contain' },
    welcomeCard: {
        backgroundColor: 'rgb(23, 42, 70)', margin: 20, borderRadius: 25, padding: 25,
        flexDirection: 'row', alignItems: 'center', elevation: 8, shadowColor: 'rgb(23, 42, 70)',
        shadowOpacity: 0.3, shadowRadius: 10,
    },
    welcomeSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 5 },
    welcomeMainText: { color: '#fff', fontSize: 19, fontWeight: 'bold', lineHeight: 26 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'rgb(23, 42, 70)', marginLeft: 20, marginBottom: 15 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
    gridItem: {
        width: '47%', backgroundColor: '#fff', borderRadius: 22, height: 135,
        alignItems: 'center', justifyContent: 'center', marginBottom: 15,
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
    },
    gridItemActive: { backgroundColor: "rgb(23, 42, 70)" },
    iconBox: { backgroundColor: '#f0f4ff', borderRadius: 18, padding: 12, marginBottom: 10 },
    iconBoxActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
    gridLabel: { fontSize: 14, fontWeight: 'bold', color: "rgb(23, 42, 70)" },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 998 },
    drawer: { position: 'absolute', top: 0, left: 0, width: 290, height: '100%', backgroundColor: '#fff', zIndex: 999 },
    drawerTop: { backgroundColor: "rgb(23, 42, 70)", padding: 30, paddingTop: 60, alignItems: 'center', borderBottomRightRadius: 40 },
    drawerAvatarWrapper: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff', overflow: 'hidden', marginBottom: 10 },
    drawerAvatar: { width: '100%', height: '100%' },
    drawerNameText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    drawerSubText: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
    drawerMenu: { padding: 20, flex: 1 },
    drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 15 },
    drawerItemText: { fontSize: 16, color: '#1e293b', fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 15 },
    logoutBtnNew: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, backgroundColor: '#fff5f5' },
    logoutTextNew: { color: '#ef5350', fontWeight: 'bold', marginLeft: 10 }
});

export default HomeTeacher;