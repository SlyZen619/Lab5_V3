import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './AuthContext';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'; // Nhập màn hình quên mật khẩu
import AddServiceScreen from './screens/AddServiceScreen'; // Nhập màn hình thêm dịch vụ
import AccountScreen from './screens/AccountScreen'; // Nhập màn hình Tài khoản

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1E90FF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Đăng nhập' }} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ title: 'Đăng ký' }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Trang chủ' }} 
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ title: 'Quên mật khẩu' }} 
          />
          <Stack.Screen
            name="AddService"
            component={AddServiceScreen} // Thêm màn hình Thêm Dịch Vụ
            options={{ title: 'Thêm Dịch Vụ' }} 
          />
          <Stack.Screen 
            name="Account" 
            component={AccountScreen} 
            options={{ title: 'Tài khoản' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
