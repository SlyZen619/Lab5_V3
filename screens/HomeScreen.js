import React, { useLayoutEffect, useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Switch, BackHandler } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faSignOutAlt, faClipboardList, faUsers, faCog } from '@fortawesome/free-solid-svg-icons';
import { useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const { isDarkMode } = useContext(ThemeContext);

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

      const onBackPress = () => {
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{item.name}</Text>
      <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{item.price} đ</Text>
    </TouchableOpacity>
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Danh sách dịch vụ</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddService')}>
          <FontAwesomeIcon icon={faPlus} size={24} color={isDarkMode ? '#fff' : 'black'} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Chưa có dịch vụ nào.</Text>}
      />
    </View>
  );
};

const TransactionsScreen = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Giao dịch</Text>
    </View>
  );
};

const CustomersScreen = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Khách hàng</Text>
    </View>
  );
};

const SettingsScreen = () => {
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <Text style={{ color: isDarkMode ? '#fff' : '#000', fontSize: 20 }}>
        Chuyển đổi chế độ tối
      </Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
      />
    </View>
  );
};

const AppNavigator = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: isDarkMode ? '#1E1E1E' : '#fff' },
        tabBarActiveTintColor: isDarkMode ? '#fff' : '#1E90FF',
        tabBarInactiveTintColor: isDarkMode ? '#aaa' : '#555',
      }}
    >
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
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faCog} color={color} size={24} />,
        }}
      >
        {() => <SettingsScreen />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
