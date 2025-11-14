import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { authService } from '../services/authService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await authService.getUser();
    setUser(userData);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.fullName?.charAt(0)?.toUpperCase() || 'P'}
          </Text>
        </View>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.role}>Service Provider</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>

          {user.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}

          {user.experience?.years && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experience:</Text>
              <Text style={styles.infoValue}>{user.experience.years} years</Text>
            </View>
          )}

          {user.rating?.average && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rating:</Text>
              <Text style={styles.infoValue}>
                ⭐ {user.rating.average.toFixed(1)}/5.0
              </Text>
            </View>
          )}

          {user.rating?.count > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Reviews:</Text>
              <Text style={styles.infoValue}>{user.rating.count}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Service Categories */}
      {user.serviceCategories && user.serviceCategories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <View style={styles.card}>
            {user.serviceCategories.map((category, index) => (
              <View key={index} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Account Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Status</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                user.isAvailable ? styles.statusAvailable : styles.statusUnavailable,
              ]}
            >
              <Text style={styles.statusText}>
                {user.isAvailable ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Verified:</Text>
            <Text style={styles.infoValue}>{user.isVerified ? '✅ Yes' : '❌ No'}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>HOH108 Provider App v1.0.0</Text>
        <Text style={styles.footerText}>© 2024 HOH108. All rights reserved.</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#9333ea',
    padding: 30,
    alignItems: 'center',
    paddingTop: 60,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    color: '#e9d5ff',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#9333ea',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusAvailable: {
    backgroundColor: '#dcfce7',
  },
  statusUnavailable: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
});

export default ProfileScreen;
