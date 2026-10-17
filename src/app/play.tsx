import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert, ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { submitGuess } from '../services/api';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const TIME_LIMIT = 120;

export default function PlayScreen() {
    const params     = useLocalSearchParams();
    const gameData   = JSON.parse(params.gameData as string);
    const isDaily    = params.isDaily === 'true';

    const [clue, setClue]                   = useState<string[]>(gameData.clue);
    const [lives, setLives]                 = useState<number>(gameData.lives);
    const [hint, setHint]                   = useState<string>(gameData.hint);
    const [score, setScore]                 = useState<number>(gameData.score);
    const [wrongGuesses, setWrongGuesses]   = useState<string[]>([]);
    const [usedLetters, setUsedLetters]     = useState<Record<string, string>>({});
    const [message, setMessage]             = useState('');
    const [timeLeft, setTimeLeft]           = useState(TIME_LIMIT);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);

    const mounted = useRef(true);
    useEffect(() => {
    return () => { mounted.current = false; };
}, []);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    router.replace({
                        pathname: '/result',
                        params: { won: 'false', message: "⏰ Time's up!", score: String(score), isDaily: String(isDaily) }
                    });
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    const formatTime = (s: number) =>
        `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const timerPct   = (timeLeft / TIME_LIMIT) * 100;
    const timerColor = timerPct > 50 ? '#4caf82' : timerPct > 25 ? '#f0c040' : '#e05a5a';

    const handleGuess = async (letter: string) => {
        if (usedLetters[letter]) return;
        clearInterval(timerRef.current);

        try {
            const res  = await submitGuess(letter);
            const data = res.data;

            if (data.result === 'won' || data.result === 'lost' || data.result === 'timeout') {
                router.replace({
                    pathname: '/result',
                    params: {
                        won:     String(data.won),
                        message: data.message,
                        score:   String(data.score),
                        isDaily: String(isDaily),
                    }
                });
                return;
            }

            const letterStatus = data.clue.includes(letter) ? 'right' : 'wrong';
            setUsedLetters(prev => ({ ...prev, [letter]: letterStatus }));
            setClue(data.clue);
            setLives(data.lives);
            setWrongGuesses(data.wrong_guesses);
            setScore(data.score);
            setMessage(data.message || '');
            startTimer();

        } catch (e: any) {
    console.log('Error status:', e?.response?.status);
    console.log('Error data:', JSON.stringify(e?.response?.data));
    console.log('Error message:', e?.message);
    Alert.alert('Error', 'Connection failed.');
    startTimer();
}
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>

                <View style={styles.header}>
                    <View style={styles.hearts}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <Text key={i} style={{ fontSize: 18, opacity: i < lives ? 1 : 0.2 }}>❤️</Text>
                        ))}
                    </View>
                    <Text style={styles.scoreText}>⭐ {score}</Text>
                </View>

                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <View style={styles.timerTrack}>
                    <View style={[styles.timerBar, { width: `${timerPct}%` as any, backgroundColor: timerColor }]} />
                </View>

                <View style={styles.clueRow}>
                    {clue.map((c, i) => (
                        <View key={i} style={[styles.tile, c !== '?' && styles.tileRevealed]}>
                            <Text style={[styles.tileText, c !== '?' && styles.tileTextRevealed]}>
                                {c.toUpperCase()}
                            </Text>
                        </View>
                    ))}
                </View>

                {hint ? (
                    <View style={styles.hintBox}>
                        <Text style={styles.hintText}>
                            <Text style={{ color: '#e8e8f0' }}>Hint: </Text>{hint}
                        </Text>
                    </View>
                ) : null}

                {wrongGuesses.length > 0 && (
                    <View style={styles.wrongRow}>
                        {wrongGuesses.map((g, i) => (
                            <View key={i} style={styles.wrongBadge}>
                                <Text style={styles.wrongText}>{g.toUpperCase()}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {message ? <Text style={styles.message}>{message}</Text> : null}

                <View style={styles.keyboard}>
                    {ALPHABET.map(letter => (
                        <TouchableOpacity
                            key={letter}
                            style={[
                                styles.key,
                                usedLetters[letter] === 'wrong' && styles.keyWrong,
                                usedLetters[letter] === 'right' && styles.keyRight,
                            ]}
                            onPress={() => handleGuess(letter)}
                            disabled={!!usedLetters[letter]}
                        >
                            <Text style={[
                                styles.keyText,
                                usedLetters[letter] === 'wrong' && styles.keyTextWrong,
                                usedLetters[letter] === 'right' && styles.keyTextRight,
                                !!usedLetters[letter] && { opacity: 0.4 },
                            ]}>
                                {letter.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:        { flex: 1, backgroundColor: '#0e0e12' },
    scroll:           { padding: 16, paddingBottom: 40 },
    header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    hearts:           { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
    scoreText:        { color: '#f0c040', fontFamily: 'monospace', fontSize: 14 },
    timerText:        { color: '#888899', fontFamily: 'monospace', fontSize: 12, textAlign: 'right', marginBottom: 4 },
    timerTrack:       { height: 6, backgroundColor: '#2e2e3e', borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
    timerBar:         { height: '100%', borderRadius: 3 },
    clueRow:          { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 16 },
    tile:             { width: 38, height: 46, backgroundColor: '#23232f', borderRadius: 8, borderWidth: 2, borderColor: '#2e2e3e', alignItems: 'center', justifyContent: 'center' },
    tileRevealed:     { borderColor: '#4caf82', backgroundColor: 'rgba(76,175,130,0.1)' },
    tileText:         { color: '#888899', fontFamily: 'monospace', fontSize: 18, fontWeight: 'bold' },
    tileTextRevealed: { color: '#4caf82' },
    hintBox:          { backgroundColor: '#23232f', borderLeftWidth: 3, borderLeftColor: '#f0c040', borderRadius: 8, padding: 12, marginBottom: 12 },
    hintText:         { color: '#888899', fontSize: 13 },
    wrongRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    wrongBadge:       { backgroundColor: 'rgba(224,90,90,0.15)', borderWidth: 1, borderColor: 'rgba(224,90,90,0.3)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
    wrongText:        { color: '#e05a5a', fontFamily: 'monospace', fontSize: 12, fontWeight: 'bold' },
    message:          { color: '#e05a5a', textAlign: 'center', fontSize: 13, marginBottom: 10 },
    keyboard:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 8 },
    key:              { width: 34, height: 42, backgroundColor: '#23232f', borderRadius: 6, borderWidth: 1, borderColor: '#2e2e3e', alignItems: 'center', justifyContent: 'center' },
    keyWrong:         { backgroundColor: 'rgba(224,90,90,0.15)', borderColor: 'rgba(224,90,90,0.3)' },
    keyRight:         { backgroundColor: 'rgba(76,175,130,0.15)', borderColor: 'rgba(76,175,130,0.3)' },
    keyText:          { color: '#e8e8f0', fontFamily: 'monospace', fontWeight: 'bold', fontSize: 13 },
    keyTextWrong:     { color: '#e05a5a' },
    keyTextRight:     { color: '#4caf82' },
});

