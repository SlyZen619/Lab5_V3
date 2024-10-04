import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Đảm bảo đã import Firebase
import { doc, getDoc } from 'firebase/firestore';
import { ThemeContext } from '../ThemeContext'; // Import ThemeContext

const AccountScreen = () => {
  const [username, setUsername] = useState(''); // State để lưu trữ tên người dùng
  const user = auth.currentUser; // Lấy thông tin người dùng hiện tại

  // Lấy giá trị từ ThemeContext
  const { isDarkMode } = useContext(ThemeContext);

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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#e7f2b8' }]}>
      <Text style={[styles.name, { color: isDarkMode ? '#fff' : '#000' }]}>{username || 'Tên không có'}</Text> 
      <Text style={[styles.email, { color: isDarkMode ? '#fff' : '#000' }]}>{user?.email || 'Email không có'}</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
