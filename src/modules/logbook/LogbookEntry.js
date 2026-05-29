import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const TAGS = [
  { label: 'Genel Not', color: '#6b7280' },
  { label: 'Toplantı Kararı', color: '#2563eb' },
  { label: 'Önemli', color: '#dc2626' },
  { label: 'Duyuru', color: '#d97706' },
  { label: 'Şikayet', color: '#7c3aed' },
  { label: 'Bakım', color: '#059669' },
];

function today() {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${d}/${m}/${now.getFullYear()}`;
}

function isoToDisplay(isoDate) {
  if (!isoDate) return today();
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [y, m, d] = parts;
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
}

function displayToIso(displayDate) {
  if (!displayDate) return '';
  const parts = displayDate.split('/');
  if (parts.length !== 3) return displayDate;
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export default function LogbookEntryForm({ visible, entry, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(today());
  const [tag, setTag] = useState('Genel Not');

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
      setDate(isoToDisplay(entry.date));
      setTag(entry.tag || 'Genel Not');
    } else {
      setTitle('');
      setContent('');
      setDate(today());
      setTag('Genel Not');
    }
  }, [entry, visible]);

  const canSave = title.trim() !== '';

  function handleSave() {
    if (!canSave) return;
    onSave({
      title: title.trim(),
      content: content.trim(),
      date: displayToIso(date.trim()),
      tag,
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{entry ? 'Kaydı Düzenle' : 'Yeni Kayıt'}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Başlık *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Kayıt başlığı"
              autoFocus={!entry}
            />

            <Text style={styles.label}>Etiket</Text>
            <View style={styles.tagGrid}>
              {TAGS.map(t => (
                <TouchableOpacity
                  key={t.label}
                  style={[
                    styles.tagChip,
                    tag === t.label && { backgroundColor: t.color, borderColor: t.color },
                  ]}
                  onPress={() => setTag(t.label)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      tag === t.label && styles.tagTextSelected,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>İçerik</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              value={content}
              onChangeText={setContent}
              placeholder="Not içeriği..."
              multiline
              numberOfLines={5}
            />

            <Text style={styles.label}>Tarih</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="GG/AA/YYYY"
            />
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, !canSave && styles.disabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '92%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  inputMulti: {
    height: 110,
    textAlignVertical: 'top',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  tagText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
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
    paddingVertical: 14,
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
