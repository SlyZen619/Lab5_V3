import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './AuthContext';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import AddServiceScreen from './screens/AddServiceScreen';
import AccountScreen from './screens/AccountScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig'; 
import { TouchableOpacity, Text, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'; 
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { doc, deleteDoc } from 'firebase/firestore'; 

const Stack = createStackNavigator();

const App = () => {
  // Hàm để xử lý việc xóa dịch vụ
  const handleDeleteService = async (navigation, serviceId) => {
    try {
      const serviceRef = doc(db, 'services', serviceId);
      await deleteDoc(serviceRef);
      Alert.alert('Thành công', 'Dịch vụ đã được xóa.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home'); // Điều hướng về màn hình chính
          },
        },
      ]);
    } catch (error) {
      console.error('Lỗi khi xóa dịch vụ:', error);
      Alert.alert('Lỗi', 'Không thể xóa dịch vụ.');
    }
  };

  return (
    <AuthProvider>
      <MenuProvider>
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
              options={({ navigation }) => ({
                headerTitle: () => null,
                headerLeft: () => (
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Account')} 
                    style={{ marginLeft: 15 }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} size={24} color="white" />
                  </TouchableOpacity>
                ),
                headerRight: () => (
                  <TouchableOpacity 
                    onPress={async () => {
                      try {
                        await signOut(auth);
                        navigation.navigate('Login'); 
                      } catch (error) {
                        console.error('Lỗi đăng xuất:', error);
                      }
                    }}
                    style={{ marginRight: 15 }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} size={24} color="white" />
                  </TouchableOpacity>
                ),
              })} 
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen} 
              options={{ title: 'Quên mật khẩu' }} 
            />
            <Stack.Screen
              name="AddService"
              component={AddServiceScreen}
              options={{ title: 'Thêm Dịch Vụ' }} 
            />
            <Stack.Screen 
              name="Account" 
              component={AccountScreen} 
              options={{ title: 'Tài khoản' }} 
            />
            <Stack.Screen 
              name="ServiceDetail" 
              component={ServiceDetailScreen} 
              options={({ navigation, route }) => ({
                title: 'Chi tiết dịch vụ',
                headerRight: () => (
                  <Menu>
                    <MenuTrigger>
                      <Text style={{ marginRight: 15, marginLeft: 10, color: 'white', fontSize: 24 }}>⋮</Text>
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: { padding: 5, borderRadius: 10, backgroundColor: '#f0f0f0', margin: -10, marginTop: 5 } }}>
                      <MenuOption 
                        onSelect={() => {
                          navigation.navigate('ServiceDetail', { 
                            serviceId: route.params.serviceId,
                            isEditing: true // Đặt isEditing thành true khi chọn cập nhật
                          });
                        }}
                      >
                        <Text style={{ padding: 10, fontSize: 16 }}>Cập nhật dịch vụ</Text>
                      </MenuOption>
                      <MenuOption 
                        onSelect={() => {
                          Alert.alert(
                            'Xác nhận',
                            'Bạn có chắc chắn muốn xóa dịch vụ này?',
                            [
                              { text: 'Hủy', style: 'cancel' },
                              { text: 'Xóa', onPress: () => handleDeleteService(navigation, route.params.serviceId) },
                            ],
                            { cancelable: false }
                          );
                        }}
                      >
                        <Text style={{ padding: 10, fontSize: 16 }}>Xóa dịch vụ</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                ),
              })} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    </AuthProvider>
  );
};

export default App;
