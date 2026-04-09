import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    ActivityIndicator, StatusBar, Platform, Animated
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';

interface AnalysisResult {
    overallAssessment: string;
    overallEmoji: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    predictedGrade: string;
    motivationalMessage: string;
}

const AIAnalysis = () => {
    const { courseName, analyticsData } = useLocalSearchParams<{
        courseId: string;
        courseName: string;
        analyticsData: string;
    }>();

    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        generateAnalysis();
    }, []);

    const generateAnalysis = async () => {
        try {
            setLoading(true);
            setError(false);

            const data = JSON.parse(analyticsData || '{}');
            const promptText = buildPrompt(data, courseName || 'Course');

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'openrouter/auto',
                    messages: [{ role: 'user', content: promptText }],
                }),
            });

            const result = await response.json();
            const text = result?.choices?.[0]?.message?.content;
            if (!text) throw new Error('No content returned');

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : text;

            const parsed: AnalysisResult = JSON.parse(cleanJson);
            setAnalysis(parsed);

            Animated.timing(fadeAnim, {
                toValue: 1, duration: 600, useNativeDriver: true
            }).start();

        } catch (err: any) {
            console.error('❌ Error Message:', err.message);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const buildPrompt = (data: any, course: string) => {
        const attendance = data.attendance?.percentage || 0;
        const grades = data.grades || {};
        const quizzes = data.quizzes || [];
        const totalScore = grades.total?.score ?? 0;
        const totalOutOf = 40;
        const midScore = grades.mid?.score ?? null;
        const midOutOf = grades.mid?.outOf ?? 0;

        return `Analyze this student's academic performance in the course "${course}".
        Respond ONLY with a valid JSON object. Predicted Grade based on totalScore/40 (A=36-40, B=28-35, C=20-27, D=12-19, F=below 12).
        {
          "overallAssessment": "summary",
          "overallEmoji": "🎯",
          "strengths": [],
          "improvements": [],
          "recommendations": [],
          "predictedGrade": "A",
          "motivationalMessage": "message"
        }`;
    };

    // --- كود الانتظار (Loading) زي ما طلبت بالظبط ---
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.loadingCard}>
                    <MaterialCommunityIcons name="robot" size={50} color="rgb(23, 42, 70)" />
                    <ActivityIndicator size="large" color="rgb(23, 42, 70)" style={{ marginTop: 16 }} />
                    <Text style={styles.loadingTitle}>AI is analyzing...</Text>
                </View>
            </View>
        );
    }

    if (error || !analysis) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#ef4444" />
                <Text style={styles.errorText}>Failed to generate analysis</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={generateAnalysis}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- التصميم الجديد (Premium Design) لباقي الصفحة ---
    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar backgroundColor="#0f172a" barStyle="light-content" />

            {/* Header عصري */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerIconBtn}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color="white" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>AI Analysis 🤖</Text>
                    <Text style={styles.headerSub}>{courseName}</Text>
                </View>
                <TouchableOpacity onPress={generateAnalysis} style={styles.headerIconBtn}>
                    <MaterialCommunityIcons name="refresh" size={22} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                
                {/* كارت النتيجة الرئيسي */}
                <View style={styles.overallCard}>
                    <View style={styles.trophyIcon}>
                        <MaterialCommunityIcons name="trophy" size={35} color="#fbbf24" />
                    </View>
                    <Text style={styles.overallTitle}>Overall Assessment</Text>
                    <Text style={styles.overallText}>{analysis.overallAssessment}</Text>
                    
                    <View style={styles.predictedBadge}>
                        <Text style={styles.predictedLabel}>PREDICTED GRADE</Text>
                        <Text style={styles.predictedValue}>{analysis.predictedGrade}</Text>
                    </View>
                </View>

                {/* كروت التفاصيل المقسمة */}
                <View style={styles.sectionContainer}>
                    {/* Strengths */}
                    <View style={[styles.infoCard, { borderLeftColor: '#10b981' }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="check-decagram" size={20} color="#10b981" />
                            <Text style={[styles.cardTitle, { color: '#064e3b' }]}>Your Strengths</Text>
                        </View>
                        {analysis.strengths.map((s, i) => (
                            <Text key={i} style={styles.bulletText}>• {s}</Text>
                        ))}
                    </View>

                    {/* Improvements */}
                    <View style={[styles.infoCard, { borderLeftColor: '#f59e0b' }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="trending-up" size={20} color="#f59e0b" />
                            <Text style={[styles.cardTitle, { color: '#7c2d12' }]}>Areas to Improve</Text>
                        </View>
                        {analysis.improvements.map((s, i) => (
                            <Text key={i} style={styles.bulletText}>• {s}</Text>
                        ))}
                    </View>

                    {/* Recommendations */}
                    <View style={[styles.infoCard, { borderLeftColor: '#6366f1' }]}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="lightbulb" size={20} color="#6366f1" />
                            <Text style={[styles.cardTitle, { color: '#1e1b4b' }]}>Recommendations</Text>
                        </View>
                        {analysis.recommendations.map((s, i) => (
                            <Text key={i} style={styles.bulletText}>• {s}</Text>
                        ))}
                    </View>
                </View>

                {/* Motivational Footer */}
                <View style={styles.motivationCard}>
                    <MaterialCommunityIcons name="rocket-launch" size={26} color="#fff" />
                    <Text style={styles.motivationText}>{analysis.motivationalMessage}</Text>
                </View>
            </ScrollView>
        </Animated.View>
    );
};

export default AIAnalysis;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    
    // ستايل الانتظار الأصلي
    loadingContainer: { flex: 1, backgroundColor: '#f8faff', alignItems: 'center', justifyContent: 'center', padding: 30 },
    loadingCard: { backgroundColor: '#fff', borderRadius: 24, padding: 30, alignItems: 'center', elevation: 5, width: '100%' },
    loadingTitle: { fontSize: 18, fontWeight: 'bold', color: 'rgb(23, 42, 70)', marginTop: 12 },
    errorText: { fontSize: 16, fontWeight: 'bold', color: '#ef4444', marginTop: 12 },
    retryBtn: { backgroundColor: 'rgb(23, 42, 70)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 16 },
    retryText: { color: '#fff', fontWeight: 'bold' },

    // التصميم الجديد
    header: {
        backgroundColor: '#0f172a',
        paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 10,
        paddingBottom: 25, paddingHorizontal: 20,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
        elevation: 15,
    },
    headerIconBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 12 },
    headerCenter: { alignItems: 'center' },
    headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },

    overallCard: {
        backgroundColor: '#1e293b', margin: 20, borderRadius: 30,
        padding: 25, alignItems: 'center', elevation: 10,
        shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10,
    },
    trophyIcon: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 100, marginBottom: 10 },
    overallTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    overallText: { color: '#fff', fontSize: 16, fontWeight: '500', textAlign: 'center', marginTop: 10, lineHeight: 24 },
    
    predictedBadge: {
        backgroundColor: '#fff', marginTop: 20, paddingVertical: 10,
        paddingHorizontal: 25, borderRadius: 20, alignItems: 'center',
    },
    predictedLabel: { color: '#64748b', fontSize: 10, fontWeight: '900' },
    predictedValue: { color: '#0f172a', fontSize: 28, fontWeight: '900' },

    sectionContainer: { paddingHorizontal: 20 },
    infoCard: {
        backgroundColor: '#fff', borderRadius: 22, padding: 20, marginBottom: 15,
        borderLeftWidth: 6, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    bulletText: { color: '#475569', fontSize: 14, lineHeight: 22, marginBottom: 5, paddingLeft: 5 },

    motivationCard: {
        backgroundColor: '#4f46e5', margin: 20, borderRadius: 22,
        padding: 20, flexDirection: 'row', alignItems: 'center', gap: 15, elevation: 5,
    },
    motivationText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700', lineHeight: 20 },
});