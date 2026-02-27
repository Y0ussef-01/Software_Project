import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from "react-native";
import { sizes, FONTS, COLORS } from '../constants/theme';
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Mahmoud from '../assets/images/Mahmoud.jpg'
import { useNavigation } from '@react-navigation/native';


const TechProfile = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState({

        name: 'Mahmoud mosad kamel',
        id: '2327473',
        departement: 'computer since',
        image: Mahmoud,
        email: 'mahmoudMosad@gmail.com',


    })



    return (
        <View style={styles.container}>
            <View style={styles.HeaderStyle}>
                <View style={[{ flexDirection: 'row', }, { gap: 20, }, { alignItems: 'center', }]}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Entypo name="chevron-with-circle-left" size={24} color="white" /></TouchableOpacity>
                </View>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>
            <ScrollView style={styles.mainContainer}>
                <View style={styles.profileContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={userData.image} style={styles.imagePROStyle} />
                    </View>
                    <View style={{ flexShrink: 1 }} >
                        <Text style={styles.dataLabelDR}>DR</Text>
                        <Text style={styles.nameText}>{userData.name}</Text>
                    </View>
                </View>
                <View style={styles.fieldContainer}>
                    <Text style={styles.dataLabel}>ID</Text>
                    <Text style={styles.dataValue}>{userData.id}</Text>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.dataLabel}>Department</Text>
                    <Text style={styles.dataValue}>{userData.departement}</Text>
                </View>


                <View style={styles.fieldContainer}>
                    <Text style={styles.dataLabel}>Email</Text>
                    <Text style={styles.dataValue}>{userData.email}</Text>
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
    mainContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        margin: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30

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
     dataLabelDR: {
        fontWeight: 'bold',
        color: '#03015d',
        width: 100,
        fontSize: 20,
    },
    dataLabel: {
        fontWeight: 'bold',
        color: '#02013f',
        width: 100,
    },
    dataValue: {
        color: '#000000',
        flexShrink: 1,
        fontSize: 13,
        fontFamily: FONTS.bold,
    },
});