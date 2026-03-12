import Entypo from '@expo/vector-icons/Entypo';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import API from '../api/axiosConfig';

interface UploadedFile {
    name: string;
    uploadedAt: string;
    uri: string;
}

const UploadGrades = () => {
    const { courseId, courseName } = useLocalSearchParams();
    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            if (!result.canceled) {
                setFile(result.assets[0]);
            }
        } catch (err) {
            Alert.alert('❌ Error', 'Failed to pick file');
        }
    };

    const openFile = async (uri: string) => {
        try {
            await Sharing.shareAsync(uri, {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                dialogTitle: 'Open with...',
            });
        } catch (err) {
            Alert.alert('❌', 'Failed to open file');
        }
    };

    const removeUploadedFile = (index: number) => {
        Alert.alert(
            'Remove File',
            'Are you sure you want to remove this file?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setUploadedFiles((prev: UploadedFile[]) => prev.filter((_, i) => i !== index));
                    },
                },
            ]
        );
    };

    const handleUpload = async () => {
        if (!file) {
            Alert.alert('⚠️', 'Please select an Excel file first');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('courseId', courseId as string);
            formData.append('excelFile', {
                uri: file.uri,
                name: file.name,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            } as any);

            await API.post('/teacher/upload-grades-excel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const now = new Date();
            const uploadedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
            setUploadedFiles((prev: UploadedFile[]) => [{ name: file.name, uploadedAt, uri: file.uri }, ...prev]);
            setFile(null);

            Alert.alert('✅ Success', 'Grades uploaded successfully!');
        } catch (err: any) {
            Alert.alert('❌ Error', err.response?.data?.message || 'Failed to upload grades');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Entypo name="chevron-with-circle-left" size={24} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.courseCard}>
                    <MaterialCommunityIcons name="book-open-variant" size={28} color="white" />
                    <View>
                        <Text style={styles.courseId}>{courseId}</Text>
                        <Text style={styles.courseName}>{courseName}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.uploadBox} onPress={pickFile}>
                    <MaterialCommunityIcons
                        name="file-excel"
                        size={32}
                        color={file ? 'green' : 'rgb(23, 42, 70)'}
                    />
                    <View style={{ flex: 1 }}>
                        {file ? (
                            <Text style={styles.fileName} numberOfLines={1}>✅ {file.name}</Text>
                        ) : (
                            <>
                                <Text style={styles.uploadText}>Tap to select Excel file</Text>
                                <Text style={styles.uploadSubText}>.xlsx files only</Text>
                            </>
                        )}
                    </View>
                    {file ? (
                        <TouchableOpacity onPress={() => setFile(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <MaterialCommunityIcons name="close-circle" size={22} color="red" />
                        </TouchableOpacity>
                    ) : (
                        <MaterialCommunityIcons name="chevron-right" size={20} color="gray" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, !file && styles.buttonDisabled]}
                    onPress={handleUpload}
                    disabled={loading || !file}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="upload" size={20} color="white" />
                            <Text style={styles.buttonText}>Upload Grades</Text>
                        </>
                    )}
                </TouchableOpacity>

                {uploadedFiles.length > 0 && (
                    <View style={styles.historyContainer}>
                        <Text style={styles.historyTitle}>Uploaded Grades</Text>
                        {uploadedFiles.map((f, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.historyItem}
                                onPress={() => openFile(f.uri)}
                            >
                                <MaterialCommunityIcons name="file-excel" size={22} color="green" />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.historyFileName} numberOfLines={1}>{f.name}</Text>
                                    <Text style={styles.historyDate}>{f.uploadedAt}</Text>
                                </View>
                                <TouchableOpacity onPress={() => removeUploadedFile(index)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <MaterialCommunityIcons name="close-circle" size={20} color="red" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

            </ScrollView>
        </View>
    );
};

export default UploadGrades;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    HeaderStyle: {
        width: '100%',
        height: 120,
        backgroundColor: 'rgb(23, 42, 70)',
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
    content: {
        flex: 1,
        padding: 20,
    },
    courseCard: {
        backgroundColor: 'rgb(23, 42, 70)',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 20,
        elevation: 5,
    },
    courseId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    courseName: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 3,
    },
    uploadBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 2,
        borderColor: 'rgb(23, 42, 70)',
        borderStyle: 'dashed',
        marginBottom: 15,
    },
    uploadText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
    },
    uploadSubText: {
        fontSize: 11,
        color: 'gray',
        marginTop: 2,
    },
    fileName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: 'green',
    },
    button: {
        backgroundColor: 'rgb(23, 42, 70)',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 25,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        elevation: 3,
        shadowColor: 'rgb(23, 42, 70)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    historyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgb(23, 42, 70)',
        marginBottom: 12,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    historyFileName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
    },
    historyDate: {
        fontSize: 11,
        color: 'gray',
        marginTop: 2,
    },
});