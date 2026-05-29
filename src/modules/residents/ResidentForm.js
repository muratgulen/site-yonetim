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

const OCCUPANCY_OPTIONS = [
  { label: 'Ev Sahibi', color: '#10b981' },
  { label: 'Kiracı',    color: '#2563eb' },
  { label: 'Boş',       color: '#6b7280' },
];

export default function ResidentForm({ visible, resident, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [block, setBlock] = useState('');
  const [unit, setUnit] = useState('');
  const [phone, setPhone] = useState('');
  const [occupancy, setOccupancy] = useState('Ev Sahibi');
  const [plate, setPlate] = useState('');

  useEffect(() => {
    if (resident) {
      setName(resident.name || '');
      setBlock(resident.block || '');
      setUnit(resident.unit || '');
      setPhone(resident.phone || '');
      setOccupancy(resident.occupancy || 'Ev Sahibi');
      setPlate(resident.plate || '');
    } else {
      setName('');
      setBlock('');
      setUnit('');
      setPhone('');
      setOccupancy('Ev Sahibi');
      setPlate('');
    }
  }, [resident, visible]);

  const canSave = name.trim() !== '' && unit.trim() !== '';

  function handleSave() {
    if (!canSave) return;
    onSave({
      name: name.trim(),
      block: block.trim(),
      unit: unit.trim(),
      phone: phone.trim(),
      occupancy,
      plate: plate.trim().toUpperCase(),
    });
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{resident ? 'Sakini Düzenle' : 'Yeni Sakin'}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Ad Soyad *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ad Soyad"
              autoFocus
            />

            <Text style={styles.label}>Blok</Text>
            <TextInput
              style={styles.input}
              value={block}
              onChangeText={setBlock}
              placeholder="A, B, C..."
            />

            <Text style={styles.label}>Daire No *</Text>
            <TextInput
              style={styles.input}
              value={unit}
              onChangeText={setUnit}
              placeholder="1, 2, 3..."
              keyboardType="numeric"
            />

            <Text style={styles.label}>Telefon</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="0555 000 00 00"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>İkamet Eden *</Text>
            <View style={styles.chipRow}>
              {OCCUPANCY_OPTIONS.map(opt => {
                const active = occupancy === opt.label;
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[
                      styles.chip,
                      active && { backgroundColor: opt.color, borderColor: opt.color },
                    ]}
                    onPress={() => setOccupancy(opt.label)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Araç Plakası</Text>
            <TextInput
              style={styles.input}
              value={plate}
              onChangeText={setPlate}
              placeholder="34 ABC 123"
              autoCapitalize="characters"
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
    maxHeight: '85%',
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
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
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
