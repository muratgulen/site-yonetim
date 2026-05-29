import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getResidents } from '../residents/residentsStorage';
import { getDuesForMonth, togglePayment, setMonthlyAmount } from './duesStorage';

const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

function toMonthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export default function DuesScreen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [residents, setResidents] = useState([]);
  const [dues, setDues] = useState({ amount: 0, payments: {} });
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  const monthKey = toMonthKey(year, month);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [monthKey])
  );

  async function loadData() {
    const [res, d] = await Promise.all([getResidents(), getDuesForMonth(monthKey)]);
    setResidents(res);
    setDues(d);
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  async function handleToggle(resident) {
    const currentPaid = dues.payments[resident.id]?.paid || false;
    await togglePayment(monthKey, resident.id, !currentPaid);
    loadData();
  }

  function handleSetAmount() {
    setAmountInput(dues.amount > 0 ? String(dues.amount) : '');
    setAmountModalVisible(true);
  }

  async function handleSaveAmount() {
    const val = parseInt(amountInput, 10);
    if (!isNaN(val) && val >= 0) {
      await setMonthlyAmount(monthKey, val);
      setAmountModalVisible(false);
      loadData();
    }
  }

  const paidCount = residents.filter(r => dues.payments[r.id]?.paid).length;
  const totalCount = residents.length;
  const totalCollected = paidCount * (dues.amount || 0);

  function renderResident({ item }) {
    const paid = dues.payments[item.id]?.paid || false;
    const paidDate = dues.payments[item.id]?.paidDate;
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleToggle(item)} activeOpacity={0.7}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardSub}>
            {item.block ? `Blok ${item.block} / ` : ''}Daire {item.unit}
          </Text>
          {paid && paidDate ? (
            <Text style={styles.paidDate}>Ödeme: {paidDate}</Text>
          ) : null}
        </View>
        <View style={[styles.badge, paid ? styles.badgePaid : styles.badgeUnpaid]}>
          <Text style={[styles.badgeText, paid ? styles.badgeTextPaid : styles.badgeTextUnpaid]}>
            {paid ? 'Ödedi' : 'Ödemedi'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Month selector */}
      <View style={styles.monthBar}>
        <TouchableOpacity style={styles.monthArrow} onPress={prevMonth}>
          <Text style={styles.monthArrowText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{MONTHS_TR[month]} {year}</Text>
        <TouchableOpacity style={styles.monthArrow} onPress={nextMonth}>
          <Text style={styles.monthArrowText}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{paidCount}/{totalCount}</Text>
          <Text style={styles.summaryLabel}>Ödedi</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {dues.amount > 0 ? `${dues.amount} ₺` : '—'}
          </Text>
          <Text style={styles.summaryLabel}>Aidat Tutarı</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {dues.amount > 0 ? `${totalCollected} ₺` : '—'}
          </Text>
          <Text style={styles.summaryLabel}>Tahsilat</Text>
        </View>
      </View>

      {/* Set amount button */}
      <TouchableOpacity style={styles.amountBtn} onPress={handleSetAmount}>
        <Text style={styles.amountBtnText}>
          {dues.amount > 0 ? `Aidat tutarını değiştir (${dues.amount} ₺)` : 'Aidat tutarını belirle'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={residents}
        keyExtractor={item => item.id}
        renderItem={renderResident}
        contentContainerStyle={residents.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Sakin bulunamadı</Text>
            <Text style={styles.emptyText}>Önce Sakinler sekmesinden sakin ekleyin</Text>
          </View>
        }
      />

      {/* Amount modal */}
      <Modal visible={amountModalVisible} transparent animationType="fade" onRequestClose={() => setAmountModalVisible(false)}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{MONTHS_TR[month]} {year} — Aidat Tutarı</Text>
            <TextInput
              style={styles.modalInput}
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="numeric"
              placeholder="Örn: 500"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setAmountModalVisible(false)}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, !amountInput.trim() && styles.disabled]}
                onPress={handleSaveAmount}
                disabled={!amountInput.trim()}
              >
                <Text style={styles.saveText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  monthArrow: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  monthArrowText: {
    fontSize: 28,
    color: '#2563eb',
    lineHeight: 32,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    minWidth: 160,
    textAlign: 'center',
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#bfdbfe',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#3b82f6',
  },
  amountBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    alignItems: 'center',
  },
  amountBtnText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
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
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 13,
    color: '#6b7280',
  },
  paidDate: {
    fontSize: 11,
    color: '#10b981',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgePaid: {
    backgroundColor: '#d1fae5',
  },
  badgeUnpaid: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeTextPaid: {
    color: '#059669',
  },
  badgeTextUnpaid: {
    color: '#dc2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    backgroundColor: '#fafafa',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '700',
  },
  disabled: {
    backgroundColor: '#93c5fd',
  },
});
