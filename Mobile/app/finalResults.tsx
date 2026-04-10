import React, { useCallback, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    ActivityIndicator, StatusBar, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import { getFinalResults } from '../api/studentApi';

const FinalResults = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            const fetch = async () => {
                try {
                    setLoading(true);
                    setError(false);
                    const result = await getFinalResults();
                    if (isMounted) setData(result);
                } catch (err) {
                    console.log('Final Results Error:', err);
                    if (isMounted) setError(true);
                } finally {
                    if (isMounted) setLoading(false);
                }
            };
            fetch();
            return () => { isMounted = false; };
        }, [])
    );

    const getGradeColor = (status: string) => {
        if (status === 'Passed') return '#10b981';
        return '#ef4444';
    };

    const getScoreColor = (score: number) => {
        if (score >= 85) return '#10b981';
        if (score >= 70) return '#6366f1';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const getDaysLeft = (dateStr: string) => {
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                <Text style={styles.loadingText}>Loading final results...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#ef4444" />
                <Text style={styles.errorText}>Failed to load results</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
                    <Text style={styles.retryText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

   const results = data?.results || [];
    const passed = results.filter((r: any) => r.status === 'Passed').length;
    const failed = results.filter((r: any) => r.status === 'Failed').length;
    const totalHours = results.filter((r: any) => r.status === 'Passed').reduce((sum: number, r: any) => sum + (r.hours || 0), 0);
    const expiresAt = results[0]?.expiresAt;
    const daysLeft = expiresAt ? getDaysLeft(expiresAt) : null;

    if (results.length === 0) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Final Results</Text>
                    </View>
                    <View style={{ width: 26 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="clipboard-text-off-outline" size={80} color="#cbd5e1" />
                    <Text style={styles.emptyText}>No results available yet</Text>
                    <Text style={styles.emptySubText}>Final results will appear here once published</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Final Results</Text>
                    <Text style={styles.headerSub}>Temporary Results</Text>
                </View>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

                {/* Warning Banner */}
                {daysLeft !== null && (
                    <View style={[styles.warningBanner, { backgroundColor: daysLeft <= 2 ? '#fee2e2' : '#fef3c7' }]}>
                        <MaterialCommunityIcons
                            name="clock-alert-outline"
                            size={20}
                            color={daysLeft <= 2 ? '#ef4444' : '#f59e0b'}
                        />
                        <Text style={[styles.warningText, { color: daysLeft <= 2 ? '#ef4444' : '#92400e' }]}>
                            Results expire in {daysLeft} day{daysLeft !== 1 ? 's' : ''} ({formatDate(expiresAt)})
                        </Text>
                    </View>
                )}

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{results.length}</Text>
                        <Text style={styles.summaryLabel}>Courses</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: '#10b981' }]}>{passed}</Text>
                        <Text style={styles.summaryLabel}>Passed</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: '#ef4444' }]}>{failed}</Text>
                        <Text style={styles.summaryLabel}>Failed</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: '#6366f1' }]}>{totalHours}</Text>
                        <Text style={styles.summaryLabel}>Hours</Text>
                    </View>
                </View>

                {/* Results List */}
                {results.map((item: any, index: number) => {
                    const statusColor = getGradeColor(item.status);
                    const scoreColor = getScoreColor(item.score);
                    return (
                        <View key={index} style={styles.resultCard}>
                            <View style={styles.resultTop}>
                                <View style={styles.resultLeft}>
                                    <Text style={styles.courseName}>{item.courseName}</Text>
                                    <Text style={styles.courseId}>{item.courseId}</Text>
                                    <View style={styles.hoursRow}>
                                        <MaterialCommunityIcons name="clock-outline" size={14} color="#94a3b8" />
                                        <Text style={styles.hoursText}>{item.hours} Credit Hours</Text>
                                    </View>
                                </View>
                                <View style={styles.resultRight}>
                                    <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
                                        <Text style={[styles.scoreText, { color: scoreColor }]}>{item.score}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.resultBottom}>
                                <View style={[styles.gradeBadge, { backgroundColor: statusColor + '15' }]}>
                                    <MaterialCommunityIcons
                                        name={item.status === 'Passed' ? 'check-circle' : 'close-circle'}
                                        size={14}
                                        color={statusColor}
                                    />
                                    <Text style={[styles.gradeText, { color: statusColor }]}>{item.status}</Text>
                                </View>
                                <View style={[styles.gradeBadge, { backgroundColor: '#6366f115' }]}>
                                    <MaterialCommunityIcons name="medal-outline" size={14} color="#6366f1" />
                                    <Text style={[styles.gradeText, { color: '#6366f1' }]}>{item.grade}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}

            </ScrollView>
        </View>
    );
};

export default FinalResults;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8faff' },
    loadingContainer: { flex: 1, backgroundColor: '#f8faff', alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { color: '#94a3b8', fontSize: 14 },
    errorText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
    retryBtn: { backgroundColor: 'rgb(23, 42, 70)', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
    retryText: { color: '#fff', fontWeight: 'bold' },
    header: {
        backgroundColor: 'rgb(23, 42, 70)',
        paddingTop: Platform.OS === 'ios' ? 55 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 18, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        elevation: 10,
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
    warningBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        marginHorizontal: 16, marginTop: 16, marginBottom: 4,
        padding: 12, borderRadius: 14,
    },
    warningText: { fontSize: 13, fontWeight: '600', flex: 1 },
    summaryCard: {
        backgroundColor: 'rgb(23, 42, 70)', margin: 16, borderRadius: 24,
        padding: 20, flexDirection: 'row', justifyContent: 'space-around',
        alignItems: 'center', elevation: 8,
    },
    summaryItem: { alignItems: 'center' },
    summaryValue: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    summaryLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
    summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
    resultCard: {
        backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
        borderRadius: 20, padding: 18, elevation: 3,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    },
    resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
    resultLeft: { flex: 1 },
    courseName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
    courseId: { fontSize: 12, color: '#94a3b8', marginBottom: 6 },
    hoursRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    hoursText: { fontSize: 12, color: '#94a3b8' },
    resultRight: { alignItems: 'center' },
    scoreBadge: {
        width: 60, height: 60, borderRadius: 30,
        borderWidth: 3, alignItems: 'center', justifyContent: 'center',
    },
    scoreText: { fontSize: 18, fontWeight: 'bold' },
    resultBottom: { flexDirection: 'row', gap: 10 },
    gradeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    gradeText: { fontSize: 13, fontWeight: 'bold' },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#94a3b8', marginTop: 16 },
    emptySubText: { fontSize: 14, color: '#cbd5e1', textAlign: 'center', marginTop: 8 },
});