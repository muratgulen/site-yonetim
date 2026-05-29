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

export default function ResidentForm({ visible, resident, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [block, setBlock] = useState('');
  const [unit, setUnit] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (resident) {
      setName(resident.name);
      setBlock(resident.block);
      setUnit(resident.unit);
      setPhone(resident.phone);
    } else {
      setName('');
      setBlock('');
      setUnit('');
      setPhone('');
    }
  }, [resident, visible]);

  function handleSave() {
    if (!name.trim() || !unit.trim()) return;
    onSave({ name: name.trim(), block: block.trim(), unit: unit.trim(), phone: phone.trim() });
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
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, (!name.trim() || !unit.trim()) && styles.disabled]}
              onPress={handleSave}
              disabled={!name.trim() || !unit.trim()}
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
