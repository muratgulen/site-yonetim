import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../storage/storageKeys';

export async function getExpenses() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
}

async function saveExpenses(expenses) {
  await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
}

export async function addExpense(expense) {
  const expenses = await getExpenses();
  const newExpense = { ...expense, id: Date.now().toString() };
  await saveExpenses([newExpense, ...expenses]);
  return newExpense;
}

export async function updateExpense(updated) {
  const expenses = await getExpenses();
  await saveExpenses(expenses.map(e => (e.id === updated.id ? updated : e)));
}

export async function deleteExpense(id) {
  const expenses = await getExpenses();
  await saveExpenses(expenses.filter(e => e.id !== id));
}
