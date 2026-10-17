import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>About 9 Lives</Text>

                <Text style={styles.heading}>🐾 What is it?</Text>
                <Text style={styles.body}>9 Lives is a word-guessing game. You get 9 chances to identify a hidden word before your lives run out.</Text>

                <Text style={styles.heading}>🛠️ Built with</Text>
                <Text style={styles.body}>• Python & Django (backend){'\n'}• React Native & Expo (mobile){'\n'}• Datamuse API (words & hints){'\n'}•</Text>

                <Text style={styles.heading}>🎯 Goal</Text>
                <Text style={styles.body}>Created to practise Django and React Native development — covering APIs, sessions, models and mobile deployment.</Text>
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