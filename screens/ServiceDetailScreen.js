import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';

const ServiceDetailScreen = ({ route, navigation }) => {
  const { serviceId, isEditing } = route.params;
  const [serviceDetails, setServiceDetails] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const docRef = doc(db, 'services', serviceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setServiceDetails(data);
          setUpdatedName(data.name);
          setUpdatedPrice(data.price.toString());
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy dịch vụ.');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy dữ liệu dịch vụ.');
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const handleUpdateService = async () => {
    if (updatedName === '' || updatedPrice === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập đủ thông tin.');
      return;
    }
  
    try {
      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, {
        name: updatedName,
        price: parseFloat(updatedPrice),
        updatedAt: new Date(),
      });
  
      // Cập nhật lại serviceDetails trong state với giá trị mới
      setServiceDetails(prevDetails => ({
        ...prevDetails,
        name: updatedName,
        price: parseFloat(updatedPrice),
        updatedAt: new Date(),
      }));
  
      // Cập nhật lại isEditing thành false
      navigation.setParams({ isEditing: false });
  
    } catch (error) {
      console.error('Error updating service:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật dịch vụ.');
    }
  };
  
  
  

  const handleCancelUpdate = () => {
    if (serviceDetails) {
      setUpdatedName(serviceDetails.name);
      setUpdatedPrice(serviceDetails.price.toString());
      navigation.setParams({ isEditing: false }); // Chuyển isEditing về false
    }
  };

  if (!serviceDetails) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin dịch vụ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết dịch vụ</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Tên dịch vụ:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={updatedName}
            onChangeText={setUpdatedName}
          />
        ) : (
          <Text style={styles.value}>{serviceDetails.name}</Text>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Giá:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={updatedPrice}
            keyboardType="numeric"
            onChangeText={setUpdatedPrice}
          />
        ) : (
          <Text style={styles.value}>{serviceDetails.price} đ</Text>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Người tạo:</Text>
        <Text style={styles.value}>{serviceDetails.createdBy}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Ngày tạo:</Text>
        <Text style={styles.value}>{formatDate(serviceDetails.createdAt)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Ngày cập nhật:</Text>
        <Text style={styles.value}>{formatDate(serviceDetails.updatedAt)}</Text>
      </View>

      {isEditing && (
        <>
          <TouchableOpacity onPress={handleUpdateService} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Lưu cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelUpdate} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Huỷ cập nhật</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

const formatDate = (timestamp) => {
  const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  return date.toLocaleString('vi-VN', options);
};

export default ServiceDetailScreen;
