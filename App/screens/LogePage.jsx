import React, { useState } from 'react';
import { StatusBar } from "react-native";
import { View, Text, Keyboard, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LoginPage = () => {
    const [showpassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [useID, setUserID] = useState("");
    const [errors, setErrors] = useState({});
    const navigation = useNavigation();

    const validateForm = () => {
        let errors = {};
        if (!useID) errors.useID = "Invalid user ID";
        if (!password) errors.password = "Invalid password";
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return false;
        }
        setErrors({});
        navigation.navigate('Home');
        return true;
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer} 
                    keyboardShouldPersistTaps="handled"
                    removeClippedSubviews={false}
                >
                    <StatusBar style="light" />
                    <View style={styles.HeaderStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                            <MaterialCommunityIcons name="web" size={22} color="white" />  
                            <Text style={styles.languageText}>En</Text>
                        </View>
                        <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
                    </View>

                 
                    <View style={styles.content}>
                        <View style={styles.formContainer}>

                          
                            <View style={{ alignItems: 'center', marginBottom: 25 }}>
                                <Text style={styles.subText}>EG Cairo - Egypt</Text>
                                <Text style={styles.titleText}>Welcome to Cairo University</Text>
                                <Text style={styles.signInText}>Sign in to your account</Text>
                            </View>

                            
                            <Text style={styles.label}>User ID</Text>
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons name="account-outline" size={20} color="#02013f" />
                                <TextInput
                                    placeholder="Enter your userID"
                                    placeholderTextColor="#999"
                                    style={styles.textInput}
                                    value={useID}
                                    onChangeText={setUserID}
                                />
                            </View>
                            {errors.useID && <Text style={styles.errorText}>{errors.useID}</Text>}

                            
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color="#02013f" />
                                <TextInput
                                    placeholder="Enter password"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!showpassword}
                                    style={styles.textInput}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showpassword)}>
                                    <MaterialCommunityIcons name={showpassword ? "eye-outline" : "eye-off-outline"} size={20} color="gray" />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                            <TouchableOpacity style={styles.button} onPress={validateForm}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <Text style={styles.footerText}>© Since 1925</Text>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: "rgb(23, 42, 70)",
        minHeight: "100%",   
    },

    HeaderStyle: {
        width: "100%",
        height: 110,
        backgroundColor: "rgb(23, 42, 70)",
        paddingTop: Platform.OS === "android" ? 30 : 40,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    imageStyle: {
        width: 100,
        height: 80,
        resizeMode: "contain",
    },

    content: {
        flex: 1,
        backgroundColor: "rgb(244, 245, 248)",
        borderTopLeftRadius: 60,
        borderBottomRightRadius: 60,
        marginTop: 20,
        padding: 20,
        paddingTop: 40,
    },

    formContainer: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 30,
        marginHorizontal: 20,
        marginBottom: 10,
    },

    subText: {
        color: "gray",
        fontSize: 12,
        marginBottom: 5,
    },

    titleText: {
        color: "rgb(23, 42, 70)",
        fontSize: 22,
        fontWeight: '' ,
        textAlign: "center",
    },

    signInText: {
        color: "rgb(23, 42, 70)",
        fontSize: 14,
        marginTop: 5,
    },

    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgb(23, 42, 70)",
        marginBottom: 5,
        marginTop: 10,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "rgb(224, 224, 224)",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        minHeight: 45,
        backgroundColor: "rgb(250, 250, 250)",
        marginBottom: 5,
    },

    textInput: {
        flex: 1,
        minHeight: 40,
        paddingHorizontal: 10,   
        paddingTop: 17,
    },

    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },

    button: {
        backgroundColor: "rgb(23, 42, 70)",
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

    languageText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 5,
    },

    footerText: {
        color: "white",
        fontSize: 14,
        textAlign: "center",
        marginVertical: 20,
        opacity: 0.7,
    },
});