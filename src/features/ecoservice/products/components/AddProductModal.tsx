import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { inventoryRepository } from '@/repositories/inventory.repository';
import { useQueryClient } from '@tanstack/react-query';

interface Category {
  id_categoria: number;
  nombre_categoria: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  ecoServiceId: string;
}

export function AddProductModal({ visible, onClose, ecoServiceId }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCats, setIsLoadingCats] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (visible) {
      loadCategories();
      resetForm();
    }
  }, [visible]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId(null);
    setImageUri(null);
    setIsSubmitting(false);
  };

  const loadCategories = async () => {
    try {
      setIsLoadingCats(true);
      const res = await inventoryRepository.getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setIsLoadingCats(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos permisos para acceder a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !price || !categoryId || !imageUri) {
      Alert.alert('Faltan datos', 'Por favor llena todos los campos y selecciona una imagen.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      await inventoryRepository.createProduct({
        name,
        description,
        price: parseFloat(price),
        categoryId,
        ecoServiceId: parseInt(ecoServiceId, 10),
        imageUri,
      });

      // Invalidate to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['my-products', ecoServiceId] });

      Alert.alert('Éxito', 'Producto agregado correctamente', [
        { text: 'OK', onPress: onClose }
      ]);
    } catch (error: any) {
      console.error('Create product error:', error);
      Alert.alert('Error', error.message || 'No se pudo crear el producto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView 
        style={s.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.header}>
          <Text style={s.headerTitle}>Agregar Producto</Text>
          <Pressable onPress={onClose} disabled={isSubmitting} hitSlop={10}>
            <Ionicons name="close" size={24} color="#374151" />
          </Pressable>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.content}>
          
          <Pressable style={s.imagePicker} onPress={pickImage} disabled={isSubmitting}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={s.imagePreview} contentFit="cover" />
            ) : (
              <View style={s.imagePlaceholder}>
                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                <Text style={s.imagePlaceholderText}>Toca para seleccionar imagen</Text>
              </View>
            )}
          </Pressable>

          <View style={s.inputGroup}>
            <Text style={s.label}>Nombre del producto <Text style={s.req}>*</Text></Text>
            <TextInput
              style={s.input}
              value={name}
              onChangeText={setName}
              placeholder="Ej. Kit Sostenible"
              editable={!isSubmitting}
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Descripción</Text>
            <TextInput
              style={[s.input, s.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Detalles sobre el producto..."
              multiline
              numberOfLines={3}
              editable={!isSubmitting}
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Precio (Bs) <Text style={s.req}>*</Text></Text>
            <TextInput
              style={s.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Ej. 45"
              keyboardType="numeric"
              editable={!isSubmitting}
            />
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>Categoría <Text style={s.req}>*</Text></Text>
            {isLoadingCats ? (
              <ActivityIndicator size="small" color="#059669" style={{ alignSelf: 'flex-start', marginTop: 10 }} />
            ) : (
              <View style={s.catGrid}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat.id_categoria}
                    style={[s.catChip, categoryId === cat.id_categoria && s.catChipActive]}
                    onPress={() => setCategoryId(cat.id_categoria)}
                    disabled={isSubmitting}
                  >
                    <Text style={[s.catChipText, categoryId === cat.id_categoria && s.catChipTextActive]}>
                      {cat.nombre_categoria}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

        </ScrollView>

        <View style={s.footer}>
          <Pressable 
            style={[s.submitBtn, isSubmitting && s.submitBtnDisabled]} 
            onPress={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.submitBtnText}>Guardar Producto</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 20, paddingBottom: 40 },
  
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  imagePreview: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  imagePlaceholderText: { color: '#6B7280', fontSize: 14, fontWeight: '500' },

  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151' },
  req: { color: '#EF4444' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  catChipActive: { backgroundColor: '#064E3B', borderColor: '#064E3B' },
  catChipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  catChipTextActive: { color: '#fff', fontWeight: '700' },

  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitBtn: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
