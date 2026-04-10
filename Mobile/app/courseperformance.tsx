import React, { useCallback, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    ActivityIndicator, StatusBar, Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { getCourseAnalytics } from '../api/studentApi';

const CoursePerformance = () => {
    const { courseId, courseName } = useLocalSearchParams<{
        courseId: string;
        courseName: string;
    }>();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLang, setSelectedLang] = useState<'en' | 'ar'>('en');

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;
            const fetch = async () => {
                try {
                    setLoading(true);
                    const analytics = await getCourseAnalytics(courseId);
                    if (isMounted) setData(analytics);
                } catch (err) {
                    console.log('Analytics error:', err);
                } finally {
                    if (isMounted) setLoading(false);
                }
            };
            fetch();
            return () => { isMounted = false; };
        }, [courseId])
    );

    const getAttendanceColor = (pct: number) => {
        if (pct >= 75) return '#10b981';
        if (pct >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreColor = (score: number, outOf: number) => {
        const pct = outOf > 0 ? (score / outOf) * 100 : 0;
        if (pct >= 75) return '#10b981';
        if (pct >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const renderProgressBar = (value: number, max: number, color: string) => {
        const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
        return (
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: color }]} />
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="rgb(23, 42, 70)" />
                <Text style={styles.loadingText}>Loading performance data...</Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#ef4444" />
                <Text style={styles.errorText}>Failed to load data</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => router.back()}>
                    <Text style={styles.retryText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const attendancePct = data.attendance?.percentage || 0;
    const attendanceColor = getAttendanceColor(attendancePct);
    const totalScore = data.grades?.total?.score ?? 0;
    const totalOutOf = 40;
    const totalPct = Math.round((totalScore / totalOutOf) * 100);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="rgb(23, 42, 70)" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={26} color="white" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{courseName}</Text>
                    <Text style={styles.headerSub}>{courseId}</Text>
                </View>
                <View style={{ width: 26 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

                {/* Overall Score Card */}
                <View style={styles.overallCard}>
                    <View style={styles.overallLeft}>
                        <Text style={styles.overallLabel}>Overall Score</Text>
                        <Text style={styles.overallScore}>{totalScore}<Text style={styles.overallMax}>/40</Text></Text>
                        <View style={[styles.gradeBadge, { backgroundColor: getScoreColor(totalScore, totalOutOf) + '20' }]}>
                            <Text style={[styles.gradeText, { color: getScoreColor(totalScore, totalOutOf) }]}>
                                {totalPct >= 85 ? 'Excellent ⭐' : totalPct >= 75 ? 'Very Good 👍' : totalPct >= 60 ? 'Good ✅' : 'Needs Work ⚠️'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.overallRight}>
                        <View style={styles.circleContainer}>
                            <Text style={styles.circleText}>{totalPct}%</Text>
                        </View>
                    </View>
                </View>

                {/* Attendance Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardTitleRow}>
                            <MaterialCommunityIcons name="calendar-check" size={22} color={attendanceColor} />
                            <Text style={styles.cardTitle}>Attendance</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: attendanceColor + '20' }]}>
                            <Text style={[styles.badgeText, { color: attendanceColor }]}>{attendancePct}%</Text>
                        </View>
                    </View>

                    {renderProgressBar(data.attendance?.attended || 0, data.course?.totalSessions || 1, attendanceColor)}

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{data.attendance?.attended || 0}</Text>
                            <Text style={styles.statLabel}>Present</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: '#ef4444' }]}>{data.attendance?.absent || 0}</Text>
                            <Text style={styles.statLabel}>Absent</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{data.course?.totalSessions || 0}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                    </View>

                    {attendancePct < 75 && (
                        <View style={styles.warningRow}>
                            <MaterialCommunityIcons name="alert" size={14} color="#f59e0b" />
                            <Text style={styles.warningText}>Attendance below 75% may affect your grade</Text>
                        </View>
                    )}
                </View>

                {/* Grades + Quizzes Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.cardTitleRow}>
                            <MaterialCommunityIcons name="file-document-outline" size={22} color="#6366f1" />
                            <Text style={styles.cardTitle}>Grades</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#6366f120' }]}>
                            <Text style={[styles.badgeText, { color: '#6366f1' }]}>{totalScore}/40</Text>
                        </View>
                    </View>

                    {Object.entries(data.grades || {}).map(([key, val]: any) => {
                        if (key === 'total' || key === 'final' || key === 'assignments') return null;
                        const score = val?.score ?? null;
                        const outOf = val?.outOf ?? 0;
                        const color = score !== null ? getScoreColor(score, outOf) : '#94a3b8';
                        return (
                            <View key={key} style={styles.gradeRow}>
                                <Text style={styles.gradeLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                <View style={styles.gradeBarWrapper}>
                                    {renderProgressBar(score ?? 0, outOf, color)}
                                </View>
                                <Text style={[styles.gradeScore, { color }]}>
                                    {score !== null ? `${score}/${outOf}` : 'Pending'}
                                </Text>
                            </View>
                        );
                    })}

                    {data.quizzes && data.quizzes.length > 0 && (
                        <>
                            <View style={styles.divider} />
                            <View style={[styles.cardTitleRow, { marginBottom: 10 }]}>
                                <MaterialCommunityIcons name="pencil-box-multiple" size={18} color="#f59e0b" />
                                <Text style={[styles.cardTitle, { fontSize: 14, color: '#f59e0b' }]}>Quizzes</Text>
                            </View>
                            {data.quizzes.map((q: any, i: number) => {
                                const color = getScoreColor(q.score, q.outOf);
                                return (
                                    <View key={i} style={styles.gradeRow}>
                                        <Text style={styles.gradeLabel}>{q.name}</Text>
                                        <View style={styles.gradeBarWrapper}>
                                            {renderProgressBar(q.score, q.outOf, color)}
                                        </View>
                                        <Text style={[styles.gradeScore, { color }]}>{q.score}/{q.outOf}</Text>
                                    </View>
                                );
                            })}
                        </>
                    )}
                </View>

                {/* Language Selector */}
                <View style={styles.langCard}>
                    <Text style={styles.langTitle}>🌐 Analysis Language</Text>
                    <View style={styles.langRow}>
                        <TouchableOpacity
                            style={[styles.langBtn, selectedLang === 'en' && styles.langBtnActive]}
                            onPress={() => setSelectedLang('en')}
                        >
                            <Text style={[styles.langBtnText, selectedLang === 'en' && styles.langBtnTextActive]}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.langBtn, selectedLang === 'ar' && styles.langBtnActive]}
                            onPress={() => setSelectedLang('ar')}
                        >
                            <Text style={[styles.langBtnText, selectedLang === 'ar' && styles.langBtnTextActive]}>Arabic </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* AI Analysis Button */}
                <TouchableOpacity
                    style={styles.aiBtn}
                    activeOpacity={0.85}
                    onPress={() => router.push({
                        pathname: '/aianalysis' as any,
                        params: {
                            courseId,
                            courseName,
                            analyticsData: JSON.stringify(data),
                            language: selectedLang,
                        }
                    })}
                >
                    <View style={styles.aiBtnLeft}>
                        <MaterialCommunityIcons name="robot" size={28} color="#fff" />
                        <View>
                            <Text style={styles.aiBtnTitle}>Get AI Analysis</Text>
                            <Text style={styles.aiBtnSub}>Personalized insights & recommendations</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default CoursePerformance;

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
        paddingBottom: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
    },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    headerSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
    overallCard: {
        backgroundColor: 'rgb(23, 42, 70)', margin: 16, borderRadius: 24,
        padding: 22, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        elevation: 8, shadowColor: '#000', shadowOpacity: 0.2,
    },
    overallLeft: { flex: 1 },
    overallLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 },
    overallScore: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    overallMax: { color: 'rgba(255,255,255,0.5)', fontSize: 20 },
    gradeBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 8 },
    gradeText: { fontSize: 13, fontWeight: 'bold' },
    overallRight: { alignItems: 'center' },
    circleContainer: {
        width: 80, height: 80, borderRadius: 40,
        borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center', justifyContent: 'center',
    },
    circleText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    card: {
        backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 14,
        borderRadius: 20, padding: 18, elevation: 3,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 13, fontWeight: 'bold' },
    progressTrack: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
    progressFill: { height: '100%', borderRadius: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#1e293b' },
    statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
    statDivider: { width: 1, backgroundColor: '#f1f5f9' },
    warningRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: '#fef3c7', padding: 10, borderRadius: 10 },
    warningText: { fontSize: 12, color: '#92400e', flex: 1 },
    gradeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
    gradeLabel: { width: 90, fontSize: 13, color: '#64748b', fontWeight: '600' },
    gradeBarWrapper: { flex: 1 },
    gradeScore: { width: 60, fontSize: 13, fontWeight: 'bold', textAlign: 'right' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
    langCard: {
        backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 14,
        borderRadius: 20, padding: 18, elevation: 3,
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    },
    langTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
    langRow: { flexDirection: 'row', gap: 12 },
    langBtn: {
        flex: 1, paddingVertical: 12, borderRadius: 14,
        borderWidth: 2, borderColor: '#e2e8f0',
        alignItems: 'center', backgroundColor: '#f8faff',
    },
    langBtnActive: { borderColor: 'rgb(23, 42, 70)', backgroundColor: 'rgb(23, 42, 70)' },
    langBtnText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
    langBtnTextActive: { color: '#fff' },
    aiBtn: {
        backgroundColor: 'rgb(23, 42, 70)', marginHorizontal: 16, marginTop: 4,
        borderRadius: 20, padding: 18, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        elevation: 6, shadowColor: '#000', shadowOpacity: 0.2,
    },
    aiBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    aiBtnTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    aiBtnSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
});