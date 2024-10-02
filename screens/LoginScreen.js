import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth, db } from '../firebaseConfig'; // Đảm bảo đường dẫn đúng
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin email và mật khẩu');
      return;
    }

    try {
      // Đăng nhập người dùng
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kiểm tra xem email đã được xác thực chưa
      if (!user.emailVerified) {
        Alert.alert(
          'Xác thực email',
          'Email của bạn chưa được xác thực. Vui lòng kiểm tra hộp thư và xác thực email trước khi đăng nhập.'
        );
        return;
      }

      // Lấy dữ liệu người dùng từ Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        Alert.alert('Đăng nhập thành công!', `Chào mừng bạn trở lại, ${userData.username}`);
        
        // Reset các trường nhập liệu
        setEmail('');
        setPassword('');
        navigation.navigate('Home', { username: userData.username });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      }
    } catch (error) {
      console.error("Đăng nhập lỗi:", error); // Ghi lại lỗi để dễ theo dõi
      let errorMessage = 'Sai mật khẩu hoặc tài khoản.';
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Sai mật khẩu.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Tài khoản không tồn tại.';
      }
      Alert.alert('Lỗi', errorMessage);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword'); // Điều hướng tới màn hình quên mật khẩu
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}
    >
      <View style={styles.scrollContainer}>
        <TextInput
          style={[styles.input, styles.enhancedInput]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, styles.enhancedInput]}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
        
        {/* Nút quên mật khẩu */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      {/* Nút chuyển đến màn hình đăng ký */}
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e3dcc5', // Thêm màu nền
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginTop: 80,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  enhancedInput: {
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: '#d95f8e',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%', // Đảm bảo nút chiếm toàn bộ chiều rộng của buttonContainer
    alignSelf: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff', // Màu chữ trên nút
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#1E90FF', // Màu chữ cho phần quên mật khẩu
    fontSize: 16,
    textDecorationLine: 'underline', // Gạch chân
    textAlign: 'center', // Căn giữa
    marginVertical: 10,
  },
  registerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  registerText: {
    color: '#1E90FF', // Màu chữ cho phần đăng ký
    fontSize: 16,
    textDecorationLine: 'underline', // Gạch chân
  },
});

export default LoginScreen;
