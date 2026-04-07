import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList,
    TouchableOpacity, ActivityIndicator, StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import API from '../api/axiosConfig';
import { getRole } from '../api/storage'; 

const NotificationsScreen = () => {
    interface Notification {
        _id: string;
        title: string;
        body: string;
        createdAt: string | number | Date;
        read: boolean;
    }

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const role = await getRole();
          
            const endpoint = role === 'teacher' ? '/teacher/notifications' : '/student/notifications';
            const readEndpoint = role === 'teacher' ? '/teacher/notifications/read' : '/student/notifications/read';

            const res = await API.get(endpoint);
            setNotifications(res.data);
            
           
            await API.put(readEndpoint);
        } catch (err) {
            console.log('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const formatDate = (dateStr: string | number | Date) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={[styles.card, !item.read && styles.unreadCard]}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="bell" size={24} color="rgb(23, 42, 70)" />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.body}</Text>
                <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="rgb(23, 42, 70)" style={{ marginTop: 40 }} />
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="bell-off" size={60} color="#ccc" />
                    <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item: any) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4ff' },
    header: {
        width: '100%', height: 120, backgroundColor: 'rgb(23, 42, 70)',
        elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5, shadowRadius: 10, paddingHorizontal: 20,
        paddingTop: StatusBar.currentHeight, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
    },
    headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    list: { padding: 15, gap: 12 },
    card: {
        backgroundColor: '#fff', borderRadius: 15, padding: 15,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        elevation: 3, shadowColor: 'rgb(23, 42, 70)',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
    },
    unreadCard: { borderLeftWidth: 4, borderLeftColor: 'rgb(23, 42, 70)' },
    iconContainer: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#f0f4ff', alignItems: 'center', justifyContent: 'center' },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: 'rgb(23, 42, 70)', marginBottom: 3 },
    cardBody: { fontSize: 13, color: '#555', marginBottom: 5 },
    cardDate: { fontSize: 11, color: '#aaa' },
    unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgb(23, 42, 70)' },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
    emptyText: { fontSize: 16, color: '#aaa', fontWeight: 'bold' },
});