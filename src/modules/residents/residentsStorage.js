import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../storage/storageKeys';

export async function getResidents() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.RESIDENTS);
  return data ? JSON.parse(data) : [];
}

async function saveResidents(residents) {
  await AsyncStorage.setItem(STORAGE_KEYS.RESIDENTS, JSON.stringify(residents));
}

export async function addResident(resident) {
  const residents = await getResidents();
  const newResident = { ...resident, id: Date.now().toString() };
  await saveResidents([...residents, newResident]);
  return newResident;
}

export async function updateResident(updated) {
  const residents = await getResidents();
  await saveResidents(residents.map(r => (r.id === updated.id ? updated : r)));
}

export async function deleteResident(id) {
  const residents = await getResidents();
  await saveResidents(residents.filter(r => r.id !== id));
}
