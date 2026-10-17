import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const screens = [
    { name: 'index',       title: '🐾 9 Lives' },
    { name: 'play',        title: 'Play' },
    { name: 'result',      title: 'Result',         headerBackVisible: false },
    { name: 'leaderboard', title: 'Leaderboard' },
    { name: 'help',        title: 'How to Play' },
    { name: 'about',       title: 'About' },
    { name: 'login',       title: 'Login' },
    { name: 'register',    title: 'Create Account' },
];

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#0e0e12' },
                    headerTintColor: '#f0c040',
                    headerTitleStyle: { fontWeight: 'bold' },
                    contentStyle: { backgroundColor: '#0e0e12' },
                }}
            >
                {screens.map(({ name, title, ...options }) => (
                    <Stack.Screen
                        key={name}
                        name={name}
                        options={{ title, ...options }}
                    />
                ))}
            </Stack>
        </SafeAreaProvider>
    );
}