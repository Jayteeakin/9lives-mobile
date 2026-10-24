import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../services/api';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter username and password.');
            return;
        }
        setLoading(true);
        try {
            await loginUser(username, password);
            Alert.alert('Success', `Welcome back, ${username}!`);
            router.replace('/');
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.error || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Login</Text>

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Enter username"
                    placeholderTextColor="#888899"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Enter password"
                    placeholderTextColor="#888899"
                />

                {loading ? (
                    <ActivityIndicator color="#f0c040" style={{ marginTop: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                        <Text style={styles.btnText}>Login</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.link}>No account? Register here</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0e0e12', justifyContent: 'center', alignItems: 'center' },
    card:      { backgroundColor: '#1a1a22', borderRadius: 16, padding: 24, width: '90%', borderWidth: 1, borderColor: '#2e2e3e' },
    title:     { color: '#f0c040', fontFamily: 'monospace', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    label:     { color: '#888899', fontSize: 13, marginBottom: 6 },
    input:     { backgroundColor: '#23232f', borderWidth: 1.5, borderColor: '#2e2e3e', borderRadius: 8, padding: 12, color: '#e8e8f0', fontSize: 15, marginBottom: 14 },
    btn:       { backgroundColor: '#f0c040', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 6 },
    btnText:   { color: '#0e0e12', fontWeight: 'bold', fontSize: 15 },
    link:      { color: '#f0c040', textAlign: 'center', marginTop: 16, fontSize: 13 },
});