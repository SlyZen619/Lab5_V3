import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { auth } from '../firebaseConfig'; // Đảm bảo đường dẫn đúng
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email của bạn');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Thành công', 'Đã gửi liên kết đặt lại mật khẩu tới email của bạn.');
      navigation.navigate('Login'); // Quay lại màn hình đăng nhập
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi email đặt lại mật khẩu. Vui lòng kiểm tra lại địa chỉ email.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Gửi liên kết đặt lại mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e3dcc5',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  resetButton: {
    backgroundColor: '#d95f8e',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
