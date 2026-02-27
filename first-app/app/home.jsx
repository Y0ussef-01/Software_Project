import React, { useState } from 'react';
import { StatusBar } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {Stack, router } from "expo-router";

const home = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigation = useNavigation();
    const [pressedItem, setPressedItem] = useState(null);
    return (

        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.HeaderStyle}>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setDrawerOpen(!drawerOpen)}>

                        <MaterialCommunityIcons name="menu" size={24} color="white" />

                    </TouchableOpacity>
                </View>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>
            <View style={[{ flex: 1, }]}>

                <View style={styles.gridContainer}>
                    <View style={styles.rowContainer}>
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
                    </View>
                    <View style={styles.rowContainer}>
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

                    </View>
                    <View style={styles.rowContainer}>
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



            </View>


            {drawerOpen && (
                <View style={styles.drawer}>
                    <TouchableOpacity style={styles.drawerItem} onPress={() => router.push("/techprofile")}>
                        <View style={styles.imageContainerPRO}>
                            <Image source={require('../assets/images/Mahmoud.jpg')} style={styles.imagePROStyle} />
                        </View>
                        <Text style={styles.drawerText}>Profile Page</Text>
                    </TouchableOpacity>
                </View>
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
        height: 50,
        width: '100%',
        resizeMode: 'contain',
    },
    imageContainerPRO: {
        width: 40,
        height: 40,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ffffff',
        alignSelf: 'flex-end',
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
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    drawerText: {
        fontSize: 16,
        color: '#02013f',
        fontWeight: 'bold',
    },
    gridContainer: {

        paddingHorizontal: 15,
        marginTop: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 60,
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