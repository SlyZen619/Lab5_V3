import React, { useContext } from 'react'; // Import useContext
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
import { ThemeProvider, ThemeContext } from './ThemeContext'; // Import ThemeProvider
import { doc, deleteDoc } from 'firebase/firestore'; // Import deleteDoc

const Stack = createStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MenuProvider>
          <MainNavigator /> 
        </MenuProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Tạo một component riêng cho Navigation
const MainNavigator = () => {
  const { isDarkMode } = useContext(ThemeContext); // Lấy trạng thái chế độ tối

  // Hàm để xóa dịch vụ
  const handleDeleteService = async (navigation, serviceId) => {
    try {
      await deleteDoc(doc(db, 'services', serviceId)); // Xóa tài liệu dịch vụ trong Firestore
      Alert.alert('Thành công', 'Dịch vụ đã được xóa.');
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa dịch vụ.');
      console.error('Error deleting service:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: isDarkMode ? '#333' : '#1E90FF', // Màu nền của header
          },
          headerTintColor: '#fff', // Màu chữ trên header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        })}
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
          options={({ navigation }) => ({
            title: 'Tài khoản',
            headerRight: () => (
              <TouchableOpacity 
                onPress={async () => {
                  try {
                    await signOut(auth);
                    navigation.navigate('Login'); // Điều hướng về màn hình đăng nhập
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
  );
};

export default App;
