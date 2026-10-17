import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLeaderboard } from '../services/api';

const TABS = ['easy', 'medium', 'hard'];
const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardScreen() {
    const [data, setData]       = useState<Record<string, any[]>>({});
    const [tab, setTab]         = useState('easy');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboard()
            .then(r => setData(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>🏆 Leaderboard</Text>

            <View style={styles.tabs}>
                {TABS.map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tab, tab === t && styles.tabActive]}
                        onPress={() => setTab(t)}
                    >
                        <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator color="#f0c040" size="large" style={{ marginTop: 40 }} />
            ) : (
                <ScrollView style={styles.list}>
                    {(data[tab] || []).length === 0 ? (
                        <Text style={styles.empty}>No scores yet — be the first!</Text>
                    ) : (
                        (data[tab] || []).map((s, i) => (
                            <View key={i} style={styles.row}>
                                <Text style={styles.rank}>{MEDALS[i] || `${i + 1}`}</Text>
                                <Text style={styles.player}>{s.player}</Text>
                                <Text style={styles.score}>{s.score}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:    { flex: 1, backgroundColor: '#0e0e12', padding: 16 },
    title:        { color: '#f0c040', fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    tabs:         { flexDirection: 'row', gap: 8, marginBottom: 16 },
    tab:          { flex: 1, padding: 10, backgroundColor: '#23232f', borderRadius: 8, borderWidth: 1.5, borderColor: '#2e2e3e', alignItems: 'center' },
    tabActive:    { borderColor: '#f0c040' },
    tabText:      { color: '#888899', fontWeight: '600' },
    tabTextActive:{ color: '#f0c040' },
    list:         { flex: 1 },
    row:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2e2e3e' },
    rank:         { width: 36, fontSize: 18 },
    player:       { flex: 1, color: '#e8e8f0', fontSize: 15 },
    score:        { color: '#f0c040', fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' },
    empty:        { color: '#888899', textAlign: 'center', marginTop: 40 },
    backBtn:      { marginTop: 16, padding: 14, backgroundColor: '#23232f', borderRadius: 12, alignItems: 'center' },
    backText:     { color: '#888899', fontSize: 14 },
});