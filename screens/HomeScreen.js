import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSignOutAlt, faClipboardList, faUsers, faCog, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
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

  useEffect(() => {
    fetchServices();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.serviceItem}>
      <Text>{item.name}</Text>
      <Text>{item.price} đ</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách dịch vụ</Text>
        <TouchableOpacity style={styles.addButton}>
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

const AccountScreen = () => {
  const user = auth.currentUser; // Lấy thông tin người dùng hiện tại
  return (
    <View style={styles.container}>
      <Text>Tên: {user.displayName || 'Chưa có tên'}</Text>
      <Text>Email: {user.email}</Text>
      {user.photoURL && <Image source={{ uri: user.photoURL }} style={styles.avatar} />}
    </View>
  );
};

const AppNavigator = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login', { reset: true });
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <FontAwesomeIcon icon={faUserCircle} size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
          <FontAwesomeIcon icon={faSignOutAlt} size={24} color="black" />
        </TouchableOpacity>
      ),
      headerLeft: () => null,
    });
  }, [navigation]);

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
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default AppNavigator;
