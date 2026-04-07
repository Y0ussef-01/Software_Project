import Entypo from '@expo/vector-icons/Entypo';
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { getRole, clearStorage } from "../api/storage";
import API from "../api/axiosConfig";

const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain letters";
    if (!/[0-9]/.test(password)) return "Password must contain numbers";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return "Password must contain special characters";
    return null;
};

export default function Password() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ oldPassword?: string; newPassword?: string }>({});

    const passwordRules = [
        { label: "At least 8 characters", valid: newPassword.length >= 8 },
        { label: "Contains letters", valid: /[a-zA-Z]/.test(newPassword) },
        { label: "Contains numbers", valid: /[0-9]/.test(newPassword) },
        { label: "Contains special characters", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) },
    ];

    const handleBack = async () => {
        const role = await getRole();
    
        if (role === 'teacher') {
            router.replace('/hometeacher' as any);
        } else {
            router.replace('/home' as any);
        }
    };

    const handleUpdate = async () => {
        let newErrors: { [key: string]: string } = {};

        if (!oldPassword) newErrors.oldPassword = "Please enter your old password";

        const passwordError = validatePassword(newPassword);
        if (!newPassword) {
            newErrors.newPassword = "Please enter a new password";
        } else if (passwordError) {
            newErrors.newPassword = passwordError;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const role = await getRole();
            const endpoint = role === 'student' ? '/student/updatePassword' : '/teacher/update-password';
            
            await API.put(endpoint, { oldPassword, newPassword });

            Alert.alert('✅ Success', 'Password updated! Please login again.', [
                {
                    text: 'OK',
                    onPress: async () => {
                        await clearStorage();
                        router.replace('/' as any);
                    },
                },
            ]);
        } catch (err: any) {
            setErrors({ oldPassword: err.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, backgroundColor: "rgb(23, 42, 70)" }}>
                <Stack.Screen options={{ headerShown: false }} />

                <View style={styles.HeaderStyle}>
                    <Pressable onPress={handleBack}>
                        <Entypo name="chevron-with-circle-left" size={28} color="white" />
                    </Pressable>
                    <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
                    <View style={{ width: 28 }} /> 
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView
                        style={{ flex: 1, backgroundColor: "rgb(244, 245, 248)" }}
                        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.form}>
                            <View style={{ alignItems: "center", marginBottom: 25 }}>
                                <Ionicons name="lock-open-outline" size={40} color="rgb(23, 42, 70)" />
                                <Text style={styles.universityText}>Reset Password</Text>
                            </View>

                            <Text style={styles.text}>Old Password</Text>
                            <View style={styles.passwordContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="gray" style={{ marginRight: 10 }} />
                                <TextInput
                                    placeholder="Enter old password"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!showOld}
                                    style={styles.passwordInput}
                                    value={oldPassword}
                                    onChangeText={(t: string) => { setOldPassword(t); setErrors({}); }}
                                />
                                <Pressable onPress={() => setShowOld(!showOld)}>
                                    <Ionicons name={showOld ? "eye-outline" : "eye-off-outline"} size={20} color="gray" />
                                </Pressable>
                            </View>
                            {errors.oldPassword && <Text style={styles.errorText}>⚠️ {errors.oldPassword}</Text>}

                            <Text style={styles.text}>New Password</Text>
                            <View style={styles.passwordContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="gray" style={{ marginRight: 10 }} />
                                <TextInput
                                    placeholder="Enter new password"
                                    placeholderTextColor="#999"
                                    secureTextEntry={!showNew}
                                    style={styles.passwordInput}
                                    value={newPassword}
                                    onChangeText={(t: string) => { setNewPassword(t); setErrors({}); }}
                                />
                                <Pressable onPress={() => setShowNew(!showNew)}>
                                    <Ionicons name={showNew ? "eye-outline" : "eye-off-outline"} size={20} color="gray" />
                                </Pressable>
                            </View>
                            {errors.newPassword && <Text style={styles.errorText}>⚠️ {errors.newPassword}</Text>}

                            {newPassword.length > 0 && (
                                <View style={styles.rulesContainer}>
                                    {passwordRules.map((rule, index) => (
                                        <View key={index} style={styles.ruleRow}>
                                            <Ionicons
                                                name={rule.valid ? "checkmark-circle" : "close-circle"}
                                                size={16}
                                                color={rule.valid ? "#2e7d32" : "#d32f2f"}
                                            />
                                            <Text style={[styles.ruleText, { color: rule.valid ? "#2e7d32" : "#d32f2f" }]}>
                                                {rule.label}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <Pressable
                                style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}
                                onPress={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Update Password</Text>}
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    HeaderStyle: {
        width: '100%', height: 110, backgroundColor: 'rgb(23, 42, 70)',
        elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5, shadowRadius: 10, paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    imageStyle: { height: 50, width: '40%', resizeMode: 'contain' },
    form: { backgroundColor: "white", borderRadius: 15, padding: 25, marginTop: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    universityText: { color: "rgb(23, 42, 70)", fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 10 },
    text: { fontSize: 14, fontWeight: "bold", color: "rgb(23, 42, 70)", marginBottom: 8 },
    passwordContainer: { flexDirection: "row", alignItems: "center", borderColor: "rgb(224, 224, 224)", borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, minHeight: 50, backgroundColor: "rgb(250, 250, 250)", marginBottom: 10 },
    passwordInput: { flex: 1, minHeight: 40, color: '#333' },
    button: { backgroundColor: "rgb(23, 42, 70)", padding: 16, borderRadius: 8, marginTop: 20, alignItems: "center", justifyContent: "center" },
    buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
    errorText: { color: "red", fontSize: 12, marginBottom: 10, fontWeight: '500' },
    rulesContainer: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#ebebeb' },
    ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    ruleText: { fontSize: 13 },
});