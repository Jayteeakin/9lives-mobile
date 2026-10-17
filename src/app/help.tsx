import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>How to Play</Text>

                <Text style={styles.heading}>🎯 Objective</Text>
                <Text style={styles.body}>Guess the secret word before your 9 lives run out.</Text>

                <Text style={styles.heading}>🎮 Controls</Text>
                <Text style={styles.body}>Tap a letter on the keyboard to guess one letter at a time. Correctly guessed letters reveal in green.</Text>

                <Text style={styles.heading}>⏱️ Timer</Text>
                <Text style={styles.body}>You have 2 minutes per word. The bar turns red as time runs out.</Text>

                <Text style={styles.heading}>📊 Scoring</Text>
                <Text style={styles.body}>+10 points for each word you solve. Your score carries across rounds.</Text>

                <Text style={styles.heading}>⚙️ Difficulty</Text>
                <Text style={styles.body}>🟢 Easy — 3 to 5 letters{'\n'}🟡 Medium — 6 to 8 letters{'\n'}🔴 Hard — 9+ letters</Text>

                <Text style={styles.heading}>📅 Daily Challenge</Text>
                <Text style={styles.body}>A new word every day — same word for everyone!</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0e0e12' },
    scroll:    { padding: 20, paddingBottom: 40 },
    title:     { color: '#f0c040', fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    heading:   { color: '#f0c040', fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 6 },
    body:      { color: '#888899', fontSize: 14, lineHeight: 22 },
});