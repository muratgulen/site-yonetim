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
import { getEntries, addEntry, updateEntry, deleteEntry } from './logbookStorage';
import LogbookEntryForm from './LogbookEntry';

const TAG_COLORS = {
  'Genel Not': '#6b7280',
  'Toplantı Kararı': '#2563eb',
  'Önemli': '#dc2626',
  'Duyuru': '#d97706',
  'Şikayet': '#7c3aed',
  'Bakım': '#059669',
};

const MONTHS_TR = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const monthIdx = parseInt(m, 10) - 1;
  return `${parseInt(d, 10)} ${MONTHS_TR[monthIdx] || m} ${y}`;
}

const ALL_FILTER = 'Tümü';

export default function LogbookScreen() {
  const [entries, setEntries] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  async function loadEntries() {
    const data = await getEntries();
    setEntries(data);
  }

  async function handleSave(data) {
    if (editing) {
      await updateEntry({ ...editing, ...data });
    } else {
      await addEntry(data);
    }
    setFormVisible(false);
    setEditing(null);
    loadEntries();
  }

  function handleEdit(entry) {
    setEditing(entry);
    setFormVisible(true);
  }

  function handleDelete(entry) {
    Alert.alert(
      'Kaydı Sil',
      `"${entry.title}" silinsin mi?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteEntry(entry.id);
            loadEntries();
          },
        },
      ]
    );
  }

  function handleCancel() {
    setFormVisible(false);
    setEditing(null);
  }

  const filterTags = [ALL_FILTER, ...Object.keys(TAG_COLORS)];
  const filtered = activeFilter === ALL_FILTER
    ? entries
    : entries.filter(e => e.tag === activeFilter);

  function renderEntry({ item }) {
    const color = TAG_COLORS[item.tag] || TAG_COLORS['Genel Not'];
    return (
      <View style={[styles.card, { borderLeftColor: color }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <View style={[styles.tagBadge, { backgroundColor: color + '1a' }]}>
              <Text style={[styles.tagBadgeText, { color }]}>{item.tag}</Text>
            </View>
          </View>
          <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
        </View>
        {item.content ? (
          <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
        ) : null}
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
      {/* Filter chips */}
      <View style={styles.filterBar}>
        <FlatList
          data={filterTags}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const active = item === activeFilter;
            const color = TAG_COLORS[item] || '#2563eb';
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  active && { backgroundColor: color, borderColor: color },
                ]}
                onPress={() => setActiveFilter(item)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderEntry}
        contentContainerStyle={filtered.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {entries.length === 0 ? 'Henüz kayıt yok' : 'Bu etikette kayıt yok'}
            </Text>
            <Text style={styles.emptyText}>
              {entries.length === 0
                ? 'Sağ alttaki + butonuna dokunarak kayıt ekle'
                : 'Farklı bir etiket seçin veya yeni kayıt ekleyin'}
            </Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => setFormVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <LogbookEntryForm
        visible={formVisible}
        entry={editing}
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
  filterBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  filterText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '700',
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
    paddingTop: 100,
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
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 8,
    gap: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDate: {
    fontSize: 12,
    color: '#9ca3af',
    flexShrink: 0,
  },
  cardContent: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 7,
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
    paddingVertical: 5,
    borderRadius: 7,
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
