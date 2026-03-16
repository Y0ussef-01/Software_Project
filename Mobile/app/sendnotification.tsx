import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from "expo-router";
import API from '../api/axiosConfig';

const sendnotification = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await API.get('/teacher/profile');
                const uniqueCourses = res.data.courses.reduce((acc: any[], c: any) => {
                    if (!acc.find((x: any) => x.course._id === c.course._id)) {
                        acc.push(c);
                    }
                    return acc;
                }, []);
                setCourses(uniqueCourses);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCourses();
    }, []);

    const handleSelectCourse = (item: any) => {
        setSelectedCourse(item);
        setSelectedGroups([]);
        API.get('/teacher/profile').then((r: any) => {
            const seen = new Set();
            const courseGroups = r.data.courses
                .filter((c: any) => c.course._id === item.course._id)
                .map((c: any) => c.group)
                .filter((g: any) => {
                    if (seen.has(g.groupName)) return false;
                    seen.add(g.groupName);
                    return true;
                });
            setGroups(courseGroups);
        });
    };

    const handleToggleGroup = (groupId: string) => {
        setSelectedGroups(prev => {
            let updated;
            if (prev.includes(groupId)) {
                updated = prev.filter(g => g !== groupId);
            } else {
                updated = [...prev, groupId];
            }
            return updated;
        });
    };

    const isAllSelected = selectedGroups.length === groups.length && groups.length > 0;

    const handleSend = async () => {
        if (!selectedCourse || !title.trim() || !body.trim()) {
            Alert.alert('Error', 'Please fill all fields and select a course');
            return;
        }
        if (selectedGroups.length === 0) {
            Alert.alert('Error', 'Please select at least one group');
            return;
        }
        setLoading(true);
        try {
            await API.post('/teacher/send-notification', {
                courseId: selectedCourse.course._id,
                groupIds: isAllSelected ? null : selectedGroups,
                title,
                body,
            });
            Alert.alert('Success', `Notification sent successfully`);
            setTitle('');
            setBody('');
            setSelectedCourse(null);
            setSelectedGroups([]);
        } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to send');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.HeaderStyle}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send Notification</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Select Course</Text>
                <FlatList
                    data={courses}
                    horizontal
                    keyExtractor={(item: any) => item.course._id}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }: { item: any }) => (
                        <TouchableOpacity
                            style={[
                                styles.courseChip,
                                selectedCourse?.course._id === item.course._id && styles.courseChipSelected
                            ]}
                            onPress={() => handleSelectCourse(item)}
                        >
                            <Text style={[
                                styles.courseChipText,
                                selectedCourse?.course._id === item.course._id && styles.courseChipTextSelected
                            ]}>
                                {item.course.name}
                            </Text>
                        </TouchableOpacity>
                    )}
                    style={styles.courseList}
                />

                {selectedCourse && (
                    <>
                        <Text style={styles.label}>
                            Select Group {isAllSelected ? '(ALL)' : `(${selectedGroups.length} selected)`}
                        </Text>
                        <FlatList
                            data={groups}
                            horizontal
                            keyExtractor={(item: any) => item._id}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }: { item: any }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.courseChip,
                                        selectedGroups.includes(item._id) && styles.courseChipSelected
                                    ]}
                                    onPress={() => handleToggleGroup(item._id)}
                                >
                                    <Text style={[
                                        styles.courseChipText,
                                        selectedGroups.includes(item._id) && styles.courseChipTextSelected
                                    ]}>
                                        {item.groupName}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            style={styles.courseList}
                        />
                    </>
                )}

                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Lecture Cancelled"
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Message</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Write your message..."
                    placeholderTextColor="#999"
                    value={body}
                    onChangeText={setBody}
                    multiline
                    numberOfLines={4}
                />

                <TouchableOpacity
                    style={[styles.sendBtn, loading && { opacity: 0.7 }]}
                    onPress={handleSend}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#fff" />
                        : <>
                            <MaterialCommunityIcons name="send" size={20} color="#fff" />
                            <Text style={styles.sendBtnText}>
                                {isAllSelected ? 'Send to ALL' : 'Send Notification'}
                            </Text>
                          </>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default sendnotification;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4ff' },
    HeaderStyle: {
        width: '100%', height: 120, backgroundColor: "rgb(23, 42, 70)",
        elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5, shadowRadius: 10, paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: "rgb(23, 42, 70)", marginBottom: 8, marginTop: 16 },
    courseList: { flexGrow: 0 },
    courseChip: {
        borderWidth: 1, borderColor: "rgb(23, 42, 70)", borderRadius: 20,
        paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, backgroundColor: '#fff',
    },
    courseChipSelected: { backgroundColor: "rgb(23, 42, 70)" },
    courseChipText: { color: "rgb(23, 42, 70)", fontWeight: '600', fontSize: 13 },
    courseChipTextSelected: { color: '#fff' },
    input: {
        backgroundColor: '#fff', color: '#02013f', borderRadius: 10, padding: 14,
        fontSize: 14, elevation: 3, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    },
    textArea: { height: 120, textAlignVertical: 'top' },
    sendBtn: {
        backgroundColor: "rgb(23, 42, 70)", borderRadius: 12, padding: 16,
        alignItems: 'center', marginTop: 32, flexDirection: 'row',
        justifyContent: 'center', gap: 8,
    },
    sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});