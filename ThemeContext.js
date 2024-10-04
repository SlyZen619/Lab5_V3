// ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  // Khôi phục trạng thái chế độ tối từ AsyncStorage khi khởi động ứng dụng
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('darkMode');
        if (storedTheme !== null) {
          setIsDarkMode(JSON.parse(storedTheme));
        }
      } catch (error) {
        console.error('Lỗi khi lấy trạng thái dark mode:', error);
      }
    };

    loadTheme();
  }, []);

  // Hàm để chuyển đổi chế độ tối
  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    await AsyncStorage.setItem('darkMode', JSON.stringify(newTheme)); // Lưu trạng thái mới vào AsyncStorage
    setIsDarkMode(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
