import Entypo from '@expo/vector-icons/Entypo';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useState, useCallback } from 'react';
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
    Platform,
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
    // استقبال بيانات المادة من الشاشة السابقة
    const { courseId, courseName } = useLocalSearchParams();
    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

    // دالة اختيار ملف الإكسيل
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                    'application/vnd.ms-excel' // .xls
                ],
                copyToCacheDirectory: true
            });

            if (!result.canceled) {
                const selectedFile = result.assets[0];
                // التأكد من امتداد الملف يدوياً لزيادة الأمان
                if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
                    setFile(selectedFile);
                } else {
                    Alert.alert('⚠️ Invalid File', 'Please select a valid Excel file (.xlsx or .xls)');
                }
            }
        } catch (err) {
            Alert.alert('❌ Error', 'Failed to pick file');
        }
    };

    // دالة لفتح الملف بعد رفعه (للمعاينة)
    const openFile = async (uri: string) => {
        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('❌', 'Sharing is not available on this device');
            }
        } catch (err) {
            Alert.alert('❌', 'Failed to open file');
        }
    };

    // حذف ملف من قائمة "التم رفعهم مؤخراً"
    const removeUploadedFile = (index: number) => {
        Alert.alert(
            'Remove Record',
            'Remove this file from recent history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
                    },
                },
            ]
        );
    };

    // دالة الرفع للسيرفر
    const handleUpload = async () => {
        if (!file) {
            Alert.alert('⚠️', 'Please select an Excel file first');
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('courseId', courseId as string);
            
            // تجهيز الملف للرفع
            const fileToUpload = {
                uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
                name: file.name,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            };

            formData.append('excelFile', fileToUpload as any);

            await API.post('/teacher/upload-grades-excel', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                },
                // إضافة timeout لأن ملفات الإكسيل قد تأخذ وقتاً في المعالجة بالسيرفر
                timeout: 30000 
            });

            // إضافة الملف لقائمة التاريخ (History)
            const now = new Date();
            const timestamp = `${now.toLocaleDateString()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            setUploadedFiles((prev) => [{ name: file.name, uploadedAt: timestamp, uri: file.uri }, ...prev]);
            setFile(null); // تفريغ الملف المختار بعد النجاح

            Alert.alert('✅ Success', 'Grades have been processed and uploaded successfully!');
        } catch (err: any) {
            console.log("Upload Error:", err.response?.data || err.message);
            Alert.alert('❌ Upload Failed', err.response?.data?.message || 'Server error during processing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            {/* Header */}
            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Entypo name="chevron-with-circle-left" size={28} color="white" />
                </TouchableOpacity>
                <Image source={require('../assets/images/logo(1).png')} style={styles.imageStyle} />
                <View style={{ width: 45 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                
                {/* Course Info Section */}
                <View style={styles.courseCard}>
                    <View style={styles.courseIconCircle}>
                        <MaterialCommunityIcons name="table-edit" size={30} color="white" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.courseIdLabel}>COURSE ID</Text>
                        <Text style={styles.courseIdText}>{courseId}</Text>
                        <Text style={styles.courseNameText}>{courseName}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Upload New Grades</Text>
                
                {/* Upload Zone */}
                <TouchableOpacity 
                    style={[styles.uploadBox, file && styles.uploadBoxActive]} 
                    onPress={pickFile}
                    activeOpacity={0.7}
                >
                    <View style={[styles.excelIconCircle, file && { backgroundColor: '#e8f5e9' }]}>
                        <MaterialCommunityIcons
                            name={file ? "file-check" : "file-excel-outline"}
                            size={40}
                            color={file ? '#2e7d32' : 'rgb(23, 42, 70)'}
                        />
                    </View>
                    
                    <View style={{ flex: 1 }}>
                        {file ? (
                            <View>
                                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                                <Text style={styles.fileSize}>Ready to upload</Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={styles.uploadText}>Select Excel Sheet</Text>
                                <Text style={styles.uploadSubText}>Make sure it follows the template</Text>
                            </View>
                        )}
                    </View>

                    {file && (
                        <TouchableOpacity onPress={() => setFile(null)} style={styles.clearBtn}>
                            <MaterialCommunityIcons name="close-circle" size={24} color="#ef5350" />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                {/* Upload Action Button */}
                <TouchableOpacity
                    style={[styles.button, (!file || loading) && styles.buttonDisabled]}
                    onPress={handleUpload}
                    disabled={loading || !file}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="cloud-upload" size={22} color="white" />
                            <Text style={styles.buttonText}>Confirm & Process Upload</Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* History Section */}
                {uploadedFiles.length > 0 && (
                    <View style={styles.historyContainer}>
                        <View style={styles.historyHeader}>
                            <MaterialCommunityIcons name="history" size={20} color="rgb(23, 42, 70)" />
                            <Text style={styles.historyTitle}>Recently Uploaded</Text>
                        </View>
                        
                        {uploadedFiles.map((f, index) => (
                            <View key={index} style={styles.historyItem}>
                                <TouchableOpacity 
                                    style={styles.historyItemContent} 
                                    onPress={() => openFile(f.uri)}
                                >
                                    <View style={styles.smallExcelIcon}>
                                        <MaterialCommunityIcons name="file-excel" size={20} color="#2e7d32" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.historyFileName} numberOfLines={1}>{f.name}</Text>
                                        <Text style={styles.historyDate}>{f.uploadedAt}</Text>
                                    </View>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    onPress={() => removeUploadedFile(index)} 
                                    style={styles.itemRemoveBtn}
                                >
                                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#b0bec5" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default UploadGrades;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f7ff' },
    HeaderStyle: {
        width: '100%',
        height: Platform.OS === 'ios' ? 120 : 100,
        backgroundColor: 'rgb(23, 42, 70)',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
    },
    backBtn: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
    imageStyle: { height: 40, width: 140, resizeMode: 'contain' },
    content: { flex: 1, padding: 20 },
    
    courseCard: {
        backgroundColor: 'rgb(23, 42, 70)',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    courseIconCircle: {
        width: 55,
        height: 55,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    courseIdLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 'bold', letterSpacing: 1 },
    courseIdText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    courseNameText: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 15, marginLeft: 5 },
    
    uploadBox: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#cbd5e1',
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    uploadBoxActive: { borderColor: '#2e7d32', backgroundColor: '#f1f8e9', borderStyle: 'solid' },
    excelIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    uploadText: { fontSize: 15, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    uploadSubText: { fontSize: 12, color: '#64748b', marginTop: 3 },
    fileName: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32' },
    fileSize: { fontSize: 12, color: '#689f38' },
    clearBtn: { padding: 5 },

    button: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingVertical: 16,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        elevation: 4,
        marginBottom: 30,
    },
    buttonDisabled: { backgroundColor: '#94a3b8', elevation: 0 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

    historyContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    historyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
    historyTitle: { fontSize: 15, fontWeight: 'bold', color: 'rgb(23, 42, 70)' },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    historyItemContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    smallExcelIcon: { 
        width: 35, 
        height: 35, 
        backgroundColor: '#e8f5e9', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 12
    },
    historyFileName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    historyDate: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    itemRemoveBtn: { padding: 8 }
});