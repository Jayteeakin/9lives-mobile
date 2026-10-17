import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { registerUser } from '../services/api';

export default function RegisterScreen() {
    const [username, setUsername]   = useState('');
    const [password, setPassword]   = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading]     = useState(false);

    const handleRegister = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (password !== password2) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            await registerUser(username, password);
            Alert.alert('Success', 'Account created! You are now logged in.');
            router.replace('/');
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>

                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Choose a username"
                    placeholderTextColor="#888899"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="Choose a password"
                    placeholderTextColor="#888899"
                />

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={password2}
                    onChangeText={setPassword2}
                    secureTextEntry
                    placeholder="Repeat your password"
                    placeholderTextColor="#888899"
                />

                {loading ? (
                    <ActivityIndicator color="#f0c040" style={{ marginTop: 20 }} />
                ) : (
                    <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                        <Text style={styles.btnText}>Create Account</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.link}>Already have an account? Login</Text>
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