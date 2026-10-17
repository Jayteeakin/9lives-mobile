import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { newRound } from '../services/api';

export default function ResultScreen() {
    const params   = useLocalSearchParams();
    const won      = params.won === 'true';
    const message  = params.message as string;
    const score    = Number(params.score);
    const isDaily  = params.isDaily === 'true';

    const handleNextWord = async () => {
        const res = await newRound();
        router.replace({
            pathname: '/play',
            params: { gameData: JSON.stringify(res.data), isDaily: 'false' }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.icon}>{won ? (isDaily ? '🏆' : '🎉') : '💀'}</Text>

                <Text style={[styles.title, won ? styles.titleWon : styles.titleLost]}>
                    {isDaily && won ? 'You Won the Daily Challenge!' : message}
                </Text>

                {isDaily && won && (
                    <Text style={styles.sub}>Come back tomorrow for a new word!</Text>
                )}

                <View style={styles.scoreBox}>
                    <View style={styles.stat}>
                        <Text style={styles.statVal}>{score}</Text>
                        <Text style={styles.statLabel}>SCORE</Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    {!isDaily && won && (
                        <TouchableOpacity style={styles.btnPrimary} onPress={handleNextWord}>
                            <Text style={styles.btnPrimaryText}>▶ Next Word</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.btnPrimary} onPress={() => router.replace('/')}>
                        <Text style={styles.btnPrimaryText}>🏠 Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => router.push('/leaderboard')}>
                        <Text style={styles.btnSecondaryText}>🏆 Leaderboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:        { flex: 1, backgroundColor: '#0e0e12', justifyContent: 'center', alignItems: 'center' },
    card:             { backgroundColor: '#1a1a22', borderRadius: 16, padding: 28, width: '88%', borderWidth: 1, borderColor: '#2e2e3e', alignItems: 'center' },
    icon:             { fontSize: 56, marginBottom: 12 },
    title:            { fontFamily: 'monospace', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    titleWon:         { color: '#4caf82' },
    titleLost:        { color: '#e05a5a' },
    sub:              { color: '#888899', fontSize: 13, textAlign: 'center', marginBottom: 8 },
    scoreBox:         { flexDirection: 'row', gap: 32, marginVertical: 20 },
    stat:             { alignItems: 'center' },
    statVal:          { color: '#f0c040', fontFamily: 'monospace', fontSize: 36, fontWeight: 'bold' },
    statLabel:        { color: '#888899', fontSize: 11, letterSpacing: 1 },
    actions:          { width: '100%', gap: 10 },
    btnPrimary:       { backgroundColor: '#f0c040', borderRadius: 12, padding: 14, alignItems: 'center' },
    btnPrimaryText:   { color: '#0e0e12', fontWeight: 'bold', fontSize: 15 },
    btnSecondary:     { backgroundColor: '#23232f', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#2e2e3e' },
    btnSecondaryText: { color: '#e8e8f0', fontSize: 15 },
});
