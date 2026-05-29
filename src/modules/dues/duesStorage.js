import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../storage/storageKeys';

// Data shape: { "2025-01": { amount: 500, payments: { residentId: { paid: bool, paidDate: string|null } } } }

async function getAllDues() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.DUES);
  return data ? JSON.parse(data) : {};
}

async function saveAllDues(dues) {
  await AsyncStorage.setItem(STORAGE_KEYS.DUES, JSON.stringify(dues));
}

export async function getDuesForMonth(monthKey) {
  const all = await getAllDues();
  return all[monthKey] || { amount: 0, payments: {} };
}

export async function setMonthlyAmount(monthKey, amount) {
  const all = await getAllDues();
  if (!all[monthKey]) all[monthKey] = { amount: 0, payments: {} };
  all[monthKey].amount = amount;
  await saveAllDues(all);
}

export async function togglePayment(monthKey, residentId, paid) {
  const all = await getAllDues();
  if (!all[monthKey]) all[monthKey] = { amount: 0, payments: {} };
  all[monthKey].payments[residentId] = {
    paid,
    paidDate: paid ? new Date().toISOString().slice(0, 10) : null,
  };
  await saveAllDues(all);
}
