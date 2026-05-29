import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="residents" options={{ title: 'Sakinler' }} />
      <Tabs.Screen name="dues" options={{ title: 'Aidat' }} />
      <Tabs.Screen name="expenses" options={{ title: 'Giderler' }} />
      <Tabs.Screen name="logbook" options={{ title: 'Kayıt Defteri' }} />
    </Tabs>
  );
}
