import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { authService } from '../services/authService';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const phoneInputScale = useRef(new Animated.Value(1)).current;
  const passwordInputScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleInputFocus = (input) => {
    const scaleAnim = input === 'phone' ? phoneInputScale : passwordInputScale;
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = (input) => {
    const scaleAnim = input === 'phone' ? phoneInputScale : passwordInputScale;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    // Validation
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter phone and password');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login(phone, password);

      if (result.success) {
        // Navigation will be handled by App.js checking auth state
        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo/Header */}
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>HOH108</Text>
            <View style={styles.logoBadge}>
              <Text style={styles.badgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Provider App</Text>
          <Text style={styles.tagline}>Manage your bookings on the go</Text>
        </Animated.View>

        {/* Login Form */}
        <View style={styles.form}>
          <Animated.View
            style={[
              styles.inputGroup,
              {
                transform: [{ scale: phoneInputScale }],
              },
            ]}
          >
            <Text style={styles.label}>Phone Number</Text>
            <View style={[
              styles.inputContainer,
              phoneFocused && styles.inputContainerFocused,
            ]}>
              <Text style={styles.inputPrefix}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit phone number"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                onFocus={() => {
                  setPhoneFocused(true);
                  handleInputFocus('phone');
                }}
                onBlur={() => {
                  setPhoneFocused(false);
                  handleInputBlur('phone');
                }}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!loading}
              />
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.inputGroup,
              {
                transform: [{ scale: passwordInputScale }],
              },
            ]}
          >
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputContainer,
              passwordFocused && styles.inputContainerFocused,
            ]}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                onFocus={() => {
                  setPasswordFocused(true);
                  handleInputFocus('password');
                }}
                onBlur={() => {
                  setPasswordFocused(false);
                  handleInputBlur('password');
                }}
                secureTextEntry
                editable={!loading}
              />
            </View>
          </Animated.View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.loadingText}>Logging in...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.divider} />
          <Text style={styles.footerText}>
            For provider registration, please contact admin
          </Text>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#9333ea',
    letterSpacing: -1,
  },
  logoBadge: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 10,
    marginTop: -10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 22,
    color: '#333',
    fontWeight: '600',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 15,
    color: '#666',
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: '#9333ea',
    shadowColor: '#9333ea',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  inputPrefix: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordInput: {
    paddingLeft: 0,
  },
  loginButton: {
    backgroundColor: '#9333ea',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#9333ea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LoginScreen;
