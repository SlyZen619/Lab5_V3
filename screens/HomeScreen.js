import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSignOutAlt, faClipboardList, faUsers, faCog } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const fetchedServices = [];
      querySnapshot.forEach((doc) => {
        fetchedServices.push({ ...doc.data(), id: doc.id });
      });
      setServices(fetchedServices);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy dữ liệu dịch vụ.');
      console.error('Error fetching services:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchServices();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <Text>{item.name}</Text>
      <Text>{item.price} đ</Text>
    </TouchableOpacity>
  );

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Điều hướng về màn hình đăng nhập
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  // Thiết lập tiêu đề và icon đăng xuất
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Danh sách dịch vụ',
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <FontAwesomeIcon icon={faSignOutAlt} size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách dịch vụ</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddService')}>
          <FontAwesomeIcon icon={faPlus} size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Chưa có dịch vụ nào.</Text>}
      />
    </View>
  );
};

// Các màn hình khác
const TransactionsScreen = () => (
  <View style={styles.container}>
    <Text>Giao dịch</Text>
  </View>
);

const CustomersScreen = () => (
  <View style={styles.container}>
    <Text>Khách hàng</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text>Cài đặt</Text>
  </View>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Dịch vụ" 
        component={HomeScreen} 
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faClipboardList} color={color} size={24} /> 
        }} 
      />
      <Tab.Screen 
        name="Giao dịch" 
        component={TransactionsScreen} 
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faClipboardList} color={color} size={24} /> 
        }} 
      />
      <Tab.Screen 
        name="Khách hàng" 
        component={CustomersScreen} 
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faUsers} color={color} size={24} /> 
        }} 
      />
      <Tab.Screen 
        name="Cài đặt" 
        component={SettingsScreen} 
        options={{ 
          headerShown: false, 
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faCog} color={color} size={24} /> 
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e7f2b8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    flex: 1,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    padding: 5,
  },
  iconButton: {
    padding: 5,
  },
});

export default AppNavigator;
