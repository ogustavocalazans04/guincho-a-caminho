import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="tracking" />
        <Stack.Screen name="vehicles" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="receipts" />
        <Stack.Screen name="profile" />
      </Stack>
    </>
  );
}
