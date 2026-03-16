import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Alert, StatusBar, Vibration, ActivityIndicator, Platform
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router';
import * as Application from 'expo-application';
import API from '../api/axiosConfig';

const getDeviceId = async (): Promise<string> => {
    if (Platform.OS === 'android') {
        return Application.getAndroidId() ?? 'unknown-device';
    } else {
        return (await Application.getIosIdForVendorAsync()) ?? 'unknown-device';
    }
};

const ScanQR = () => {
    const { courseId, courseName, groupName } = useLocalSearchParams<{
        courseId: string;
        courseName: string;
        groupName: string;
    }>();

    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const isProcessing = useRef(false);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, []);

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        if (isProcessing.current || scanned) return;
        isProcessing.current = true;
        setScanned(true);
        setLoading(true);
        Vibration.vibrate(100);

        try {
            const deviceId = await getDeviceId();

            await API.post('/student/attend', {
                qrToken: data,
                deviceId: deviceId,
            });

            setSuccess(true);
            setLoading(false);

            setTimeout(() => {
                router.back();
            }, 2500);

        } catch (err: any) {
            setLoading(false);
            setScanned(false);
            isProcessing.current = false;

            const msg = err?.response?.data?.message || 'Failed to record attendance';
            Alert.alert('Error', msg, [
                { text: 'Try Again', onPress: () => { setScanned(false); isProcessing.current = false; } }
            ]);
        }
    };

    if (!permission) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.centerContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <MaterialCommunityIcons name="camera-off" size={60} color="#ccc" />
                <Text style={styles.permissionText}>Camera permission is required</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Scan QR Code</Text>
                <View style={{ width: 26 }} />
            </View>

            {/* Course info */}
            <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{courseName}</Text>
                <Text style={styles.groupName}>{groupName}</Text>
            </View>

            {/* Camera */}
            {!success ? (
                <View style={styles.cameraContainer}>
                    <CameraView
                        style={styles.camera}
                        facing="back"
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    />

                    {/* QR Frame Overlay */}
                    <View style={styles.overlay}>
                        <View style={styles.overlayTop} />
                        <View style={styles.overlayMiddle}>
                            <View style={styles.overlaySide} />
                            <View style={styles.qrFrame}>
                                {/* corners */}
                                <View style={[styles.corner, styles.cornerTL]} />
                                <View style={[styles.corner, styles.cornerTR]} />
                                <View style={[styles.corner, styles.cornerBL]} />
                                <View style={[styles.corner, styles.cornerBR]} />
                                {loading && (
                                    <ActivityIndicator size="large" color="white" />
                                )}
                            </View>
                            <View style={styles.overlaySide} />
                        </View>
                        <View style={styles.overlayBottom}>
                            <Text style={styles.scanHint}>
                                {loading ? 'Recording attendance...' : 'Point camera at QR code'}
                            </Text>
                        </View>
                    </View>
                </View>
            ) : (
                // Success screen
                <View style={styles.successContainer}>
                    <View style={styles.successCircle}>
                        <MaterialCommunityIcons name="check-circle" size={80} color="#4CAF50" />
                    </View>
                    <Text style={styles.successTitle}>Attendance Recorded!</Text>
                    <Text style={styles.successSubtitle}>Your attendance has been successfully recorded</Text>
                    <Text style={styles.successCourse}>{courseName}</Text>
                </View>
            )}
        </View>
    );
};

export default ScanQR;

const FRAME_SIZE = 250;
const CORNER_SIZE = 30;
const CORNER_THICKNESS = 4;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centerContainer: { flex: 1, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center', padding: 20 },
    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
        zIndex: 10,
    },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    courseInfo: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 20,
        paddingBottom: 15,
        alignItems: 'center',
    },
    courseName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    groupName: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 3 },
    cameraContainer: { flex: 1, position: 'relative' },
    camera: { flex: 1 },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    overlayMiddle: { flexDirection: 'row', height: FRAME_SIZE },
    overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: 20 },
    qrFrame: {
        width: FRAME_SIZE,
        height: FRAME_SIZE,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    corner: {
        position: 'absolute',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: 'white',
    },
    cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
    cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },
    cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS },
    cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS },
    scanHint: { color: 'white', fontSize: 15, fontWeight: '500' },
    successContainer: { flex: 1, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center', padding: 30 },
    successCircle: { marginBottom: 20 },
    successTitle: { fontSize: 24, fontWeight: 'bold', color: 'rgb(23, 42, 70)', marginBottom: 10 },
    successSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 15 },
    successCourse: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
    permissionText: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 20 },
    permissionBtn: { backgroundColor: 'rgb(23, 42, 70)', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
    permissionBtnText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});
