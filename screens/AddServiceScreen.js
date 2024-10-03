import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { db, auth } from '../firebaseConfig'; // Đảm bảo bạn đã import auth từ firebaseConfig
import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';

const AddServiceScreen = ({ navigation }) => {
  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState('');
  const [creatorUsername, setCreatorUsername] = useState('');

  // Hàm để lấy username từ collection users
  const fetchCreatorUsername = async () => {
    const user = auth.currentUser; // Lấy thông tin người dùng hiện tại
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid)); // Truy vấn tài liệu của người dùng
      if (userDoc.exists()) {
        setCreatorUsername(userDoc.data().username); // Lưu username vào state
      } else {
        console.error('User document does not exist');
      }
    }
  };

  useEffect(() => {
    fetchCreatorUsername(); // Gọi hàm để lấy username
  }, []);

  const handleAddService = async () => {
    if (!serviceName || !price) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin dịch vụ.');
      return;
    }

    try {
      await addDoc(collection(db, 'services'), {
        name: serviceName,
        price: parseFloat(price), // Đảm bảo giá là số
        createdBy: creatorUsername || 'Unknown', // Lưu username người tạo
        createdAt: serverTimestamp(), // Thời gian tạo
        updatedAt: serverTimestamp() // Thời gian cập nhật
      });

      Alert.alert('Thành công', 'Dịch vụ đã được thêm.');
      navigation.navigate('Home'); // Quay lại màn hình chính sau khi thêm dịch vụ
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm dịch vụ.');
      console.error('Error adding service:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.label}>Tên dịch vụ:</Text>
      <TextInput
        style={styles.input}
        value={serviceName}
        onChangeText={setServiceName}
        placeholder="Nhập tên dịch vụ"
      />

      <Text style={styles.label}>Giá:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="0"
        keyboardType="numeric" // Để chỉ cho phép nhập số
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
        <Text style={styles.buttonText}>Thêm</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e7f2b8',
    justifyContent: 'flex-start', // Để các phần tử nằm ở phía trên
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5, // Thay đổi padding theo chiều dọc
    paddingHorizontal: 15, // Giữ lại padding theo chiều ngang
    alignItems: 'center',
    borderRadius: 5,
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddServiceScreen;
