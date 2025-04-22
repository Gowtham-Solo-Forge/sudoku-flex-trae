import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../utils/themeStyles';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const colors = getThemeColors(theme);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileSection}>
        {user.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>
              {user.displayName?.charAt(0) || user.email?.charAt(0)}
            </Text>
          </View>
        )}
        <Text style={[styles.name, { color: colors.text }]}>{user.displayName}</Text>
        <Text style={[styles.email, { color: colors.text }]}>{user.email}</Text>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
            disabled
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.dangerButtonBackground }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: colors.dangerButtonText }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderImage: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    marginTop: 30,
    marginBottom: 20,
    borderRadius: 8,
    padding: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
});