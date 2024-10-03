import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Hoặc getDatabase() cho Realtime Database
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyBBgmMgUEZWoLextaoIkQUTAisph_MdI1k",
  authDomain: "fir-app-a9aca.firebaseapp.com",
  projectId: "fir-app-a9aca",
  storageBucket: "fir-app-a9aca.appspot.com",
  messagingSenderId: "360913767544-pd5r35kg4gdok5gd69sm0c48099bq9f2.apps.googleusercontent.com",
  appId: "1:360913767544:android:cddee6e682734d1997f18d"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Auth với AsyncStorage để lưu trữ trạng thái xác thực
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Khởi tạo Firestore
export const db = getFirestore(app); // Hoặc sử dụng getDatabase(app) nếu dùng Realtime Database

//DẶN DÒ
//Data trong Firestore phải có 2 collection users và services, với collection users mỗi document 
//phải có 2 field là email và username, với collection services phải có đủ 5 field là name, price,
//createdBy, createdAt, updatedAt.
//Phải đủ mấy cái đấy mới link được data từ dưới Firestore lên không là lỗi