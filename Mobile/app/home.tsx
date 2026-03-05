import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from "react-native";
import { Animated, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from "expo-router";
import { getRole, clearStorage } from '../api/storage';
import { getStudentProfile } from '../api/studentApi';
import { getTeacherProfile } from '../api/teacherApi';


const home = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [pressedItem, setPressedItem] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [profileImg, setProfileImg] = useState<string | null>(null);

    
    const drawerAnim = useRef(new Animated.Value(-250)).current;

    const openDrawer = () => {
        setDrawerOpen(true);
        Animated.timing(drawerAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(drawerAnim, {
            toValue: -250,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setDrawerOpen(false));
    };

    const toggleDrawer = () => {
        if (drawerOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRole = await getRole();
                setRole(userRole);

                if (userRole === 'student') {
                    const data = await getStudentProfile();
                    setProfileImg(data.profileImg);
                } else if (userRole === 'teacher') {
                    const data = await getTeacherProfile();
                    setProfileImg(data.profileImg);
                }
            } catch (err) {
                console.log('Error fetching profile img:', err);
            }
        };
        fetchData();
    }, []);

    const goToProfile = () => {
        closeDrawer();
        setTimeout(() => {
            if (role === 'student') {
                router.push('/propage' as any);
            } else if (role === 'teacher') {
                router.push('/techprofile' as any);
            }
        }, 300);
    };

    const goToChangePassword = () => {
        closeDrawer();
        setTimeout(() => {
            router.push('/password' as any);
        }, 300);
    };

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await clearStorage();
                        router.replace('/' as any);
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.HeaderStyle}>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <TouchableOpacity onPress={toggleDrawer}>
                        <MaterialCommunityIcons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.gridContainer}>
                    <View style={styles.rowContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.gridItem, pressedItem === 'calendar-remove' && styles.gridItemActive]}
                            onPressIn={() => setPressedItem('calendar-remove')}
                            onPressOut={() => setPressedItem(null)}
                        >
                            <MaterialCommunityIcons
                                name="calendar-remove"
                                size={35}
                                color={pressedItem === 'calendar-remove' ? '#fff' : '#02013f'}
                            />
                            <Text style={[styles.gridText, pressedItem === 'calendar-remove' && styles.gridTextActive]}>
                                Attendance
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.gridItem, pressedItem === 'calendar-month' && styles.gridItemActive]}
                            onPressIn={() => setPressedItem('calendar-month')}
                            onPressOut={() => setPressedItem(null)}
                        >
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={35}
                                color={pressedItem === 'calendar-month' ? '#fff' : '#02013f'}
                            />
                            <Text style={[styles.gridText, pressedItem === 'calendar-month' && styles.gridTextActive]}>
                                Schedule
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.rowContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.gridItem, pressedItem === 'star-circle' && styles.gridItemActive]}
                            onPressIn={() => setPressedItem('star-circle')}
                            onPressOut={() => setPressedItem(null)}
                        >
                            <MaterialCommunityIcons
                                name="star-circle"
                                size={35}
                                color={pressedItem === 'star-circle' ? '#fff' : '#02013f'}
                            />
                            <Text style={[styles.gridText, pressedItem === 'star-circle' && styles.gridTextActive]}>
                                Evaluation
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.gridItem, pressedItem === 'pencil-box-multiple' && styles.gridItemActive]}
                            onPressIn={() => setPressedItem('pencil-box-multiple')}
                            onPressOut={() => setPressedItem(null)}
                        >
                            <MaterialCommunityIcons
                                name="pencil-box-multiple"
                                size={35}
                                color={pressedItem === 'pencil-box-multiple' ? '#fff' : '#02013f'}
                            />
                            <Text style={[styles.gridText, pressedItem === 'pencil-box-multiple' && styles.gridTextActive]}>
                                Quizzes
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.rowContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.gridItem, pressedItem === 'bell' && styles.gridItemActive]}
                            onPressIn={() => setPressedItem('bell')}
                            onPressOut={() => setPressedItem(null)}
                        >
                            <MaterialCommunityIcons
                                name="bell"
                                size={35}
                                color={pressedItem === 'bell' ? '#fff' : '#02013f'}
                            />
                            <Text style={[styles.gridText, pressedItem === 'bell' && styles.gridTextActive]}>
                                Notifications
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            style={[styles.gridItem, pressedItem === 'clipboard-text' && styles.gridItemActive]}
                            onPressIn={() => setPressedItem('clipboard-text')}
                            onPressOut={() => setPressedItem(null)}
                        >
                            <MaterialCommunityIcons
                                name="clipboard-text"
                                size={35}
                                color={pressedItem === 'clipboard-text' ? '#fff' : '#02013f'}
                            />
                            <Text style={[styles.gridText, pressedItem === 'clipboard-text' && styles.gridTextActive]}>
                                Final Grades
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            
            {drawerOpen && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={closeDrawer}
                />
            )}

            
            {drawerOpen && (
                <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>
                    <View style={styles.drawerGroup}>
                 
                        <TouchableOpacity style={styles.drawerItem} onPress={goToProfile}>
                            <View style={styles.imageContainerPRO}>
                                <Image
                                    source={
                                        profileImg &&
                                        profileImg !== 'default-student.jpg' &&
                                        profileImg !== 'default-teacher.jpg'
                                            ? { uri: profileImg }
                                            : require('../assets/images/11.png')
                                    }
                                    style={styles.imagePROStyle}
                                />
                            </View>
                            <View>
                                <Text style={styles.drawerText}>Profile Page</Text>
                                <Text style={styles.roleText}>
                                    {role === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Teacher'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                       
                        <TouchableOpacity style={styles.drawerItem} onPress={goToChangePassword}>
                            <MaterialCommunityIcons name="lock-reset" size={22} color="rgb(23, 42, 70)" />
                            <Text style={styles.drawerText}>Reset Password</Text>
                        </TouchableOpacity>

                       
                        <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                            <MaterialCommunityIcons name="logout" size={22} color="red" />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

export default home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
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
    imagePROStyle: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
    imageContainerPRO: {
        width: 40,
        height: 40,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#cccccc',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 998,
    },
    drawer: {
        position: 'absolute',
        top: 120,
        left: 0,
        width: 250,
        height: '100%',
        backgroundColor: '#fff',
        elevation: 20,
        padding: 20,
        zIndex: 999,
    },
    drawerGroup: {
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 15,
    },
    drawerText: {
        fontSize: 16,
        color: '#02013f',
        fontWeight: 'bold',
    },
    roleText: {
        fontSize: 12,
        color: 'gray',
        marginTop: 2,
    },
    logoutItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 15,
    },
    logoutText: {
        fontSize: 16,
        color: 'red',
        fontWeight: 'bold',
    },
    gridContainer: {
        paddingHorizontal: 15,
        marginTop: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        paddingHorizontal: 15,
        marginTop: 20,
    },
    gridItem: {
        width: '45%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: "rgb(23, 42, 70)",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        height: 120,
    },
    gridText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: "rgb(23, 42, 70)",
        marginTop: 10,
    },
    gridItemActive: {
        backgroundColor: "rgb(23, 42, 70)",
    },
    gridTextActive: {
        color: '#fff',
    },
});
