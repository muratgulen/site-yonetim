import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function icon(name) {
  return ({ color, size }) => <Ionicons name={name} size={size} color={color} />;
}

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="residents" options={{ title: 'Sakinler', tabBarIcon: icon('people') }} />
      <Tabs.Screen name="dues" options={{ title: 'Aidat', tabBarIcon: icon('wallet') }} />
      <Tabs.Screen name="expenses" options={{ title: 'Giderler', tabBarIcon: icon('receipt') }} />
      <Tabs.Screen name="logbook" options={{ title: 'Kayıt Defteri', tabBarIcon: icon('book') }} />
    </Tabs>
  );
}
