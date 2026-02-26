import React, { useState } from 'react';
import { StatusBar } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigation = useNavigation();

    return (

        <View style={styles.container}>
            <View style={styles.HeaderStyle}>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setDrawerOpen(!drawerOpen)}>
                        
                            <MaterialCommunityIcons name="menu" size={24} color="white" />
                      
                    </TouchableOpacity>
                </View>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>


            {drawerOpen && (
                <View style={styles.drawer}>
                    <TouchableOpacity style={styles.drawerItem} onPress={() => navigation.navigate('TechProfile')}>
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

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },

    HeaderStyle: {
        width: '100%',
        height: 120,
        backgroundColor: '#02013f',
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
});