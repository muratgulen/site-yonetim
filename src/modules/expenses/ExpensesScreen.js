import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getExpenses, addExpense, updateExpense, deleteExpense } from './expensesStorage';
import ExpenseForm from './ExpenseForm';

const CATEGORY_COLORS = {
  Temizlik: '#6366f1',
  Elektrik: '#f59e0b',
  Su: '#0ea5e9',
  Doğalgaz: '#f97316',
  Asansör: '#8b5cf6',
  Güvenlik: '#10b981',
  Bahçe: '#22c55e',
  Tamirat: '#ef4444',
  Diğer: '#6b7280',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
}

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  async function loadExpenses() {
    const data = await getExpenses();
    data.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    setExpenses(data);
  }

  async function handleSave(data) {
    if (editing) {
      await updateExpense({ ...editing, ...data });
    } else {
      await addExpense(data);
    }
    setFormVisible(false);
    setEditing(null);
    loadExpenses();
  }

  function handleEdit(expense) {
    setEditing(expense);
    setFormVisible(true);
  }

  function handleDelete(expense) {
    Alert.alert(
      'Gideri Sil',
      `${expense.description || expense.category || 'Bu gider'} silinsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteExpense(expense.id);
            loadExpenses();
          },
        },
      ]
    );
  }

  function handleCancel() {
    setFormVisible(false);
    setEditing(null);
  }

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Group totals by category
  const categoryTotals = expenses.reduce((acc, e) => {
    const cat = e.category || 'Diğer';
    acc[cat] = (acc[cat] || 0) + (e.amount || 0);
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  function renderExpense({ item }) {
    const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Diğer'];
    return (
      <View style={styles.card}>
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <View style={styles.cardInfo}>
          <View style={styles.cardRow}>
            <Text style={styles.cardAmount}>{item.amount?.toLocaleString('tr-TR')} ₺</Text>
            {item.category ? (
              <View style={[styles.catBadge, { backgroundColor: color + '22' }]}>
                <Text style={[styles.catBadgeText, { color }]}>{item.category}</Text>
              </View>
            ) : null}
          </View>
          {item.description ? (
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
          ) : null}
          <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
            <Text style={styles.editText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
            <Text style={styles.deleteText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Summary header */}
      {expenses.length > 0 && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{total.toLocaleString('tr-TR')} ₺</Text>
            <Text style={styles.summaryLabel}>Toplam Gider</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{expenses.length}</Text>
            <Text style={styles.summaryLabel}>Kayıt</Text>
          </View>
          {topCategory && (
            <>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{topCategory[0]}</Text>
                <Text style={styles.summaryLabel}>En Yüksek</Text>
              </View>
            </>
          )}
        </View>
      )}

      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={renderExpense}
        contentContainerStyle={expenses.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Henüz gider yok</Text>
            <Text style={styles.emptyText}>Sağ alttaki + butonuna dokunarak gider ekle</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setFormVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <ExpenseForm
        visible={formVisible}
        expense={editing}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#1e3a5f',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#93c5fd',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#2d5a8e',
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryDot: {
    width: 4,
    borderRadius: 2,
    alignSelf: 'stretch',
    marginRight: 12,
    minHeight: 40,
  },
  cardInfo: {
    flex: 1,
    marginRight: 8,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cardActions: {
    flexDirection: 'column',
    gap: 6,
  },
  editBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  editText: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: '#fee2e2',
  },
  deleteText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    lineHeight: 32,
  },
});
