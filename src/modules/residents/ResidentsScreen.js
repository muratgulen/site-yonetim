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

const OCCUPANCY_STYLE = {
  'Ev Sahibi': { color: '#10b981', bg: '#d1fae5' },
  'Kiracı':    { color: '#2563eb', bg: '#dbeafe' },
  'Boş':       { color: '#6b7280', bg: '#f3f4f6' },
};
import { useFocusEffect } from 'expo-router';
import { getResidents, addResident, updateResident, deleteResident } from './residentsStorage';
import ResidentForm from './ResidentForm';

export default function ResidentsScreen() {
  const [residents, setResidents] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadResidents();
    }, [])
  );

  async function loadResidents() {
    const data = await getResidents();
    setResidents(data);
  }

  async function handleSave(data) {
    if (editing) {
      await updateResident({ ...editing, ...data });
    } else {
      await addResident(data);
    }
    setFormVisible(false);
    setEditing(null);
    loadResidents();
  }

  function handleEdit(resident) {
    setEditing(resident);
    setFormVisible(true);
  }

  function handleDelete(resident) {
    Alert.alert(
      'Sakini Sil',
      `${resident.name} silinsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteResident(resident.id);
            loadResidents();
          },
        },
      ]
    );
  }

  function handleCancel() {
    setFormVisible(false);
    setEditing(null);
  }

  function renderResident({ item }) {
    const occ = item.occupancy || 'Ev Sahibi';
    const occStyle = OCCUPANCY_STYLE[occ] || OCCUPANCY_STYLE['Ev Sahibi'];
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName}>{item.name}</Text>
            <View style={[styles.occBadge, { backgroundColor: occStyle.bg }]}>
              <Text style={[styles.occBadgeText, { color: occStyle.color }]}>{occ}</Text>
            </View>
          </View>
          <Text style={styles.cardSub}>
            {item.block ? `Blok ${item.block} / ` : ''}Daire {item.unit}
          </Text>
          {item.phone ? <Text style={styles.cardPhone}>{item.phone}</Text> : null}
          {item.plate ? <Text style={styles.cardPlate}>🚗 {item.plate}</Text> : null}
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
      <FlatList
        data={residents}
        keyExtractor={item => item.id}
        renderItem={renderResident}
        contentContainerStyle={residents.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Henüz sakin yok</Text>
            <Text style={styles.emptyText}>Sağ alttaki + butonuna dokunarak sakin ekle</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setFormVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <ResidentForm
        visible={formVisible}
        resident={editing}
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
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  occBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  occBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 13,
    color: '#6b7280',
  },
  cardPhone: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cardPlate: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  editText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  deleteText: {
    fontSize: 12,
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
