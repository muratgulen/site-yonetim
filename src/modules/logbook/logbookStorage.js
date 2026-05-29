import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../storage/storageKeys';

export async function getEntries() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.LOGBOOK);
  return data ? JSON.parse(data) : [];
}

async function saveEntries(entries) {
  await AsyncStorage.setItem(STORAGE_KEYS.LOGBOOK, JSON.stringify(entries));
}

export async function addEntry(entry) {
  const entries = await getEntries();
  const newEntry = { ...entry, id: Date.now().toString() };
  await saveEntries([newEntry, ...entries]);
  return newEntry;
}

export async function updateEntry(updated) {
  const entries = await getEntries();
  await saveEntries(entries.map(e => (e.id === updated.id ? updated : e)));
}

export async function deleteEntry(id) {
  const entries = await getEntries();
  await saveEntries(entries.filter(e => e.id !== id));
}
