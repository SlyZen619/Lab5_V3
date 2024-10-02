import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Đảm bảo đã import Firebase
import { doc, getDoc } from 'firebase/firestore';

const AccountScreen = () => {
  const [username, setUsername] = useState(''); // State để lưu trữ tên người dùng
  const user = auth.currentUser; // Lấy thông tin người dùng hiện tại

  // Hàm lấy thông tin người dùng từ Firestore
  const fetchUserInfo = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid); // Thay 'users' bằng tên collection của bạn
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || 'Tên không có'); // Cập nhật tên người dùng
        } else {
          console.log('Không tìm thấy thông tin người dùng.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    }
  };

  // Gọi hàm fetchUserInfo khi component được render
  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{username || 'Tên không có'}</Text> 
      <Text style={styles.email}>{user?.email || 'Email không có'}</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e7f2b8',
  },
  name: {
    fontSize: 24,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
  },
});

export default AccountScreen;
