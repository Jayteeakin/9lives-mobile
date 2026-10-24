import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { newRound, startDaily, startGame } from '../services/api';

const difficulties = [
    { key: 'easy',   label: 'Easy',   icon: '🟢', sub: '3–5 letters' },
    { key: 'medium', label: 'Medium', icon: '🟡', sub: '6–8 letters' },
    { key: 'hard',   label: 'Hard',   icon: '🔴', sub: '9+ letters'  },
];

export default function HomeScreen() {
    const [selected, setSelected] = useState('easy');
    const [loading, setLoading]   = useState(false);

    const handleStart = async () => {
        setLoading(true);
        try {
            await startGame(selected);
            const res = await newRound();
            router.push({ pathname: '/play', params: { gameData: JSON.stringify(res.data), isDaily: 'false' } });
        } catch (e) {
            Alert.alert('Error', 'Could not connect to server. Check your internet.');
        } finally {
            setLoading(false);
        }
    };

    const handleDaily = async () => {
        setLoading(true);
        try {
            const res = await startDaily();
            router.push({ pathname: '/play', params: { gameData: JSON.stringify(res.data), isDaily: 'true' } });
        } catch (e) {
            Alert.alert('Error', 'Could not load daily challenge.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>9 LIVES</Text>
            <Text style={styles.sub}>Guess the word before your lives run out</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Choose difficulty</Text>

                <View style={styles.diffRow}>
                    {difficulties.map(d => (
                        <TouchableOpacity
                            key={d.key}
                            style={[styles.diffBtn, selected === d.key && styles.diffBtnActive]}
                            onPress={() => setSelected(d.key)}
                        >
                            <Text style={styles.diffIcon}>{d.icon}</Text>
                            <Text style={[styles.diffLabel, selected === d.key && styles.diffLabelActive]}>
                                {d.label}
                            </Text>
                            <Text style={styles.diffSub}>{d.sub}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loading ? (
                    <ActivityIndicator color="#f0c040" size="large" style={{ marginTop: 20 }} />
                ) : (
                    <>
                        <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
                            <Text style={styles.startBtnText}>Start Game ▶</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dailyBtn} onPress={handleDaily}>
                            <Text style={styles.dailyBtnText}>📅 Daily Challenge</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <TouchableOpacity onPress={() => router.push('/leaderboard')}>
                <Text style={styles.link}>🏆 Leaderboard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/help')}>
                <Text style={styles.link}>❓ How to Play</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/about')}>
                <Text style={styles.link}>ℹ️ About</Text>
                </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.link}>👤 Login / Register</Text>
                </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:       { flex: 1, backgroundColor: '#0e0e12', alignItems: 'center', paddingTop: 40 },
    title:           { fontFamily: 'monospace', fontSize: 42, color: '#f0c040', fontWeight: 'bold', letterSpacing: 4 },
    sub:             { color: '#888899', fontSize: 14, marginBottom: 32, marginTop: 6, textAlign: 'center', paddingHorizontal: 20 },
    card:            { backgroundColor: '#1a1a22', borderRadius: 16, padding: 20, width: '90%', borderWidth: 1, borderColor: '#2e2e3e' },
    label:           { color: '#888899', fontSize: 13, textAlign: 'center', marginBottom: 12 },
    diffRow:         { flexDirection: 'row', gap: 10, marginBottom: 20 },
    diffBtn:         { flex: 1, backgroundColor: '#23232f', borderRadius: 12, borderWidth: 2, borderColor: '#2e2e3e', alignItems: 'center', padding: 12 },
    diffBtnActive:   { borderColor: '#f0c040', backgroundColor: 'rgba(240,192,64,0.1)' },
    diffIcon:        { fontSize: 22, marginBottom: 4 },
    diffLabel:       { color: '#e8e8f0', fontWeight: '700', fontSize: 13 },
    diffLabelActive: { color: '#f0c040' },
    diffSub:         { color: '#888899', fontSize: 10, marginTop: 2 },
    startBtn:        { backgroundColor: '#f0c040', borderRadius: 12, padding: 16, alignItems: 'center' },
    startBtnText:    { color: '#0e0e12', fontWeight: 'bold', fontSize: 16 },
    dailyBtn:        { backgroundColor: '#23232f', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#2e2e3e' },
    dailyBtnText:    { color: '#888899', fontSize: 14 },
    link:            { color: '#f0c040', marginTop: 16, fontSize: 14 },
});
