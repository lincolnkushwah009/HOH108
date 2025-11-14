import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { bookingService } from '../services/bookingService';

const { width } = Dimensions.get('window');

const BookingDetailScreen = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const modalSlideAnim = useRef(new Animated.Value(600)).current;
  const modalBackdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadBookingDetails();
  }, []);

  useEffect(() => {
    if (!loading && booking) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, booking]);

  const loadBookingDetails = async () => {
    setLoading(true);
    const result = await bookingService.getBookingDetails(bookingId);

    if (result.success) {
      setBooking(result.booking);
    } else {
      Alert.alert('Error', result.message);
      navigation.goBack();
    }

    setLoading(false);
  };

  const showOtpModal = () => {
    setOtpModalVisible(true);
    setOtp('');
    setOtpError('');

    Animated.parallel([
      Animated.timing(modalBackdropAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideOtpModal = () => {
    Animated.parallel([
      Animated.timing(modalBackdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnim, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setOtpModalVisible(false);
      setOtp('');
      setOtpError('');
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a 6-digit OTP');
      return;
    }

    setUpdating(true);
    const result = await bookingService.verifyOtp(booking._id, otp);

    if (result.success) {
      hideOtpModal();
      Alert.alert('Success', 'Work completed successfully!', [
        { text: 'OK', onPress: () => loadBookingDetails() }
      ]);
    } else {
      setOtpError(result.message || 'Invalid OTP');
    }

    setUpdating(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === 'completed') {
      showOtpModal();
      return;
    }

    Alert.alert(
      'Update Status',
      `Change booking status to "${getStatusLabel(newStatus)}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setUpdating(true);
            const result = await bookingService.updateBookingStatus(
              booking._id,
              newStatus
            );

            if (result.success) {
              Alert.alert('Success', 'Booking status updated successfully');
              loadBookingDetails();
            } else {
              Alert.alert('Error', result.message);
            }

            setUpdating(false);
          },
        },
      ]
    );
  };

  const handleCallCustomer = () => {
    if (booking?.customer?.phone) {
      Linking.openURL(`tel:${booking.customer.phone}`);
    }
  };

  const handleOpenMaps = () => {
    if (booking?.serviceAddress) {
      const address = `${booking.serviceAddress.addressLine1}, ${booking.serviceAddress.city}, ${booking.serviceAddress.state} ${booking.serviceAddress.pincode}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
      Linking.openURL(url);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      provider_on_way: '#8b5cf6',
      in_progress: '#6366f1',
      work_completed: '#10b981',
      completed: '#059669',
      cancelled_by_customer: '#ef4444',
      cancelled_by_provider: '#dc2626',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      provider_on_way: 'On the Way',
      in_progress: 'In Progress',
      work_completed: 'Work Completed',
      completed: 'Completed',
      cancelled_by_customer: 'Cancelled by Customer',
      cancelled_by_provider: 'Cancelled by Provider',
    };
    return labels[status] || status;
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusFlow = {
      confirmed: ['provider_on_way', 'cancelled_by_provider'],
      provider_on_way: ['in_progress', 'cancelled_by_provider'],
      in_progress: ['work_completed'],
      work_completed: ['completed'],
    };
    return statusFlow[currentStatus] || [];
  };

  const getProgressSteps = () => {
    const allSteps = [
      { key: 'confirmed', label: 'Confirmed', icon: '✓' },
      { key: 'provider_on_way', label: 'On the Way', icon: '🚗' },
      { key: 'in_progress', label: 'In Progress', icon: '⚙️' },
      { key: 'work_completed', label: 'Completed', icon: '✓' },
    ];

    const currentIndex = allSteps.findIndex(step => step.key === booking?.status);

    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  if (!booking) {
    return null;
  }

  const nextStatusOptions = getNextStatusOptions(booking.status);
  const progressSteps = getProgressSteps();

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Animated Hero Header */}
        <Animated.View
          style={[
            styles.heroHeader,
            { backgroundColor: getStatusColor(booking.status) },
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.heroContent}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{getStatusLabel(booking.status)}</Text>
            </View>
            <Text style={styles.heroTitle}>{booking.service?.title}</Text>
            <Text style={styles.heroSubtitle}>Booking ID: {booking.bookingId}</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Progress Timeline */}
          {!['cancelled_by_customer', 'cancelled_by_provider', 'completed'].includes(booking.status) && (
            <View style={styles.timelineContainer}>
              <Text style={styles.sectionTitle}>Progress</Text>
              <View style={styles.timeline}>
                {progressSteps.map((step, index) => (
                  <View key={step.key} style={styles.timelineItem}>
                    <View style={styles.timelineIconWrapper}>
                      <View
                        style={[
                          styles.timelineIcon,
                          step.completed && styles.timelineIconCompleted,
                          step.active && styles.timelineIconActive,
                        ]}
                      >
                        <Text style={styles.timelineIconText}>{step.icon}</Text>
                      </View>
                      {index < progressSteps.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            step.completed && styles.timelineLineCompleted,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text
                        style={[
                          styles.timelineLabel,
                          step.active && styles.timelineLabelActive,
                        ]}
                      >
                        {step.label}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleCallCustomer}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📞</Text>
              </View>
              <Text style={styles.quickActionLabel}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleOpenMaps}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📍</Text>
              </View>
              <Text style={styles.quickActionLabel}>Navigate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              activeOpacity={0.7}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>💬</Text>
              </View>
              <Text style={styles.quickActionLabel}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* Customer Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer</Text>
            <View style={styles.customerCard}>
              <View style={styles.customerAvatar}>
                <Text style={styles.customerAvatarText}>
                  {booking.customer?.name?.charAt(0) || 'C'}
                </Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{booking.customer?.name}</Text>
                <Text style={styles.customerContact}>{booking.customer?.phone}</Text>
                <Text style={styles.customerContact}>{booking.customer?.email}</Text>
              </View>
            </View>
          </View>

          {/* Schedule Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.scheduleCard}>
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIconWrapper}>
                  <Text style={styles.scheduleIcon}>📅</Text>
                </View>
                <View>
                  <Text style={styles.scheduleLabel}>Date</Text>
                  <Text style={styles.scheduleValue}>
                    {new Date(booking.scheduledDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.scheduleItem}>
                <View style={styles.scheduleIconWrapper}>
                  <Text style={styles.scheduleIcon}>⏰</Text>
                </View>
                <View>
                  <Text style={styles.scheduleLabel}>Time</Text>
                  <Text style={styles.scheduleValue}>
                    {booking.timeSlot?.start} - {booking.timeSlot?.end}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Address Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Location</Text>
            <View style={styles.addressCard}>
              <Text style={styles.addressText}>
                {booking.serviceAddress?.addressLine1}
                {booking.serviceAddress?.addressLine2 &&
                  `, ${booking.serviceAddress.addressLine2}`}
              </Text>
              <Text style={styles.addressText}>
                {booking.serviceAddress?.city}, {booking.serviceAddress?.state}{' '}
                {booking.serviceAddress?.pincode}
              </Text>
            </View>
          </View>

          {/* Special Instructions */}
          {booking.serviceDetails?.specialInstructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsIcon}>📝</Text>
                <Text style={styles.instructionsText}>
                  {booking.serviceDetails.specialInstructions}
                </Text>
              </View>
            </View>
          )}

          {/* Pricing Card */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.pricingCard}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Service Charge</Text>
                <Text style={styles.pricingValue}>
                  ₹{booking.pricing?.serviceCharge?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Tax (18%)</Text>
                <Text style={styles.pricingValue}>₹{booking.pricing?.tax?.toFixed(2)}</Text>
              </View>
              <View style={styles.pricingDivider} />
              <View style={styles.pricingRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{booking.pricing?.total?.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {nextStatusOptions.length > 0 && (
            <View style={styles.actionsSection}>
              {nextStatusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.actionButton,
                    status.includes('cancelled') && styles.actionButtonDanger,
                  ]}
                  onPress={() => handleUpdateStatus(status)}
                  disabled={updating}
                  activeOpacity={0.8}
                >
                  {updating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.actionButtonText}>
                        {status === 'completed' ? '✓ Complete Job' : `Mark as ${getStatusLabel(status)}`}
                      </Text>
                      {status === 'completed' && (
                        <Text style={styles.actionButtonSubtext}>Requires OTP verification</Text>
                      )}
                    </>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 30 }} />
        </Animated.View>
      </ScrollView>

      {/* OTP Modal */}
      <Modal
        visible={otpModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideOtpModal}
      >
        <Animated.View
          style={[
            styles.modalBackdrop,
            {
              opacity: modalBackdropAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.modalBackdropTouchable}
            activeOpacity={1}
            onPress={hideOtpModal}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: modalSlideAnim }],
            },
          ]}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrapper}>
                <Text style={styles.modalIcon}>🔐</Text>
              </View>
              <Text style={styles.modalTitle}>Verify OTP</Text>
              <Text style={styles.modalSubtitle}>
                Enter the 6-digit OTP shared by customer
              </Text>
            </View>

            <View style={styles.otpInputContainer}>
              <TextInput
                style={styles.otpInput}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  setOtpError('');
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="000000"
                placeholderTextColor="#ccc"
                autoFocus={true}
              />
            </View>

            {otpError ? (
              <Text style={styles.otpError}>{otpError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={hideOtpModal}
                disabled={updating}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalVerifyButton,
                  updating && styles.modalVerifyButtonDisabled,
                ]}
                onPress={handleVerifyOtp}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalVerifyButtonText}>Verify & Complete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  heroHeader: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  heroContent: {
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  timelineContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  timeline: {
    marginTop: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineIconWrapper: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: '#9333ea',
  },
  timelineIconActive: {
    backgroundColor: '#9333ea',
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineIconText: {
    fontSize: 18,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 8,
  },
  timelineLineCompleted: {
    backgroundColor: '#9333ea',
  },
  timelineContent: {
    flex: 1,
    paddingTop: 8,
  },
  timelineLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  timelineLabelActive: {
    color: '#9333ea',
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIconText: {
    fontSize: 28,
  },
  quickActionLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  customerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9333ea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  customerAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  customerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  customerContact: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scheduleIcon: {
    fontSize: 22,
  },
  scheduleLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '700',
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  addressText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 4,
  },
  instructionsCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fbbf24',
    flexDirection: 'row',
  },
  instructionsIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  instructionsText: {
    flex: 1,
    fontSize: 15,
    color: '#92400e',
    lineHeight: 22,
  },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  pricingLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  pricingValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  pricingDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  actionsSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  actionButton: {
    backgroundColor: '#9333ea',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonDanger: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  actionButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    marginTop: 4,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBackdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
  },
  modalContent: {
    padding: 24,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  otpInputContainer: {
    marginBottom: 16,
  },
  otpInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 20,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
    color: '#111827',
  },
  otpError: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '700',
  },
  modalVerifyButton: {
    flex: 2,
    backgroundColor: '#9333ea',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  modalVerifyButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  modalVerifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default BookingDetailScreen;
