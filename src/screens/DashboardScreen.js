import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { colors, shadows, borderRadius } from '../config/theme';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('today'); // today, upcoming, all

  useEffect(() => {
    loadUserData();
    loadBookings();
  }, [filter]);

  const loadUserData = async () => {
    const userData = await authService.getUser();
    setUser(userData);
  };

  const loadBookings = async () => {
    setLoading(true);
    let result;

    if (filter === 'today') {
      result = await bookingService.getTodaysBookings();
    } else if (filter === 'upcoming') {
      result = await bookingService.getUpcomingBookings();
    } else {
      result = await bookingService.getMyBookings();
    }

    if (result.success) {
      setBookings(result.bookings || []);
    } else {
      Alert.alert('Error', result.message);
    }

    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
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
      cancelled_by_customer: 'Cancelled',
      cancelled_by_provider: 'Cancelled',
    };
    return labels[status] || status;
  };

  // Memoized animated booking card component
  const AnimatedBookingCard = useCallback(({ item, index }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, [index]);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        }}
      >
        <TouchableOpacity
          style={styles.bookingCard}
          onPress={() => navigation.navigate('BookingDetail', { bookingId: item._id })}
          activeOpacity={0.7}
        >
          <View style={styles.bookingHeader}>
            <View style={styles.bookingIdContainer}>
              <Text style={styles.bookingIdLabel}>ID</Text>
              <Text style={styles.bookingId}>{item.bookingId}</Text>
            </View>
            <View
              style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}
            >
              <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
            </View>
          </View>

          <Text style={styles.serviceName}>{item.service?.title || 'N/A'}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Customer</Text>
              <Text style={styles.infoValue}>{item.customer?.name || 'N/A'}</Text>
              <Text style={styles.infoSubValue}>{item.customer?.phone || 'N/A'}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Schedule</Text>
              <Text style={styles.infoValue}>
                {new Date(item.scheduledDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short'
                })}
              </Text>
              <Text style={styles.infoSubValue}>
                {item.timeSlot?.start || 'N/A'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Amount</Text>
              <Text style={styles.infoPriceValue}>
                ₹{item.pricing?.total?.toFixed(0) || '0'}
              </Text>
            </View>
          </View>

          <View style={styles.bookingFooter}>
            <Text style={styles.viewDetails}>View Details</Text>
            <Text style={styles.viewDetailsArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [navigation]);

  const renderBookingCard = ({ item, index }) => (
    <AnimatedBookingCard item={item} index={index} />
  );

  return (
    <View style={styles.container}>
      {/* Header with Gradient Effect */}
      <View style={styles.header}>
        {/* Gradient overlay simulation */}
        <View style={styles.headerGradientTop} />
        <View style={styles.headerGradientBottom} />

        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.fullName || 'Provider'}! ✨</Text>
            <Text style={styles.subGreeting}>Here are your bookings</Text>
          </View>
        </View>

        {/* Enhanced Stats Cards with Gradients */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconWrapper}>
              <Text style={styles.statIcon}>📊</Text>
            </View>
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>
              {filter === 'today' ? 'Today' : filter === 'upcoming' ? 'Upcoming' : 'Total'}
            </Text>
          </View>

          <View style={[styles.statCard, styles.statCardSuccess]}>
            <View style={styles.statIconWrapper}>
              <Text style={styles.statIcon}>⚡</Text>
            </View>
            <Text style={styles.statValue}>
              {bookings.filter(b => ['in_progress', 'provider_on_way'].includes(b.status)).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={[styles.statCard, styles.statCardComplete]}>
            <View style={styles.statIconWrapper}>
              <Text style={styles.statIcon}>✅</Text>
            </View>
            <Text style={styles.statValue}>
              {bookings.filter(b => b.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'today' && styles.filterTabActive]}
          onPress={() => setFilter('today')}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.filterText, filter === 'today' && styles.filterTextActive]}
          >
            Today
          </Text>
          {filter === 'today' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'upcoming' && styles.filterTabActive]}
          onPress={() => setFilter('upcoming')}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}
          >
            Upcoming
          </Text>
          {filter === 'upcoming' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
          {filter === 'all' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9333ea" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bookings found</Text>
          <Text style={styles.emptySubText}>
            {filter === 'today'
              ? 'You have no bookings scheduled for today'
              : 'You have no upcoming bookings'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#9333ea']}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: colors.primary[600],
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    overflow: 'hidden',
    position: 'relative',
  },
  headerGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.primary[500],
    opacity: 0.4,
  },
  headerGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: colors.primary[800],
    opacity: 0.3,
  },
  headerContent: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.primary[100],
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    zIndex: 1,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.lg,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...shadows.medium,
  },
  statCardPrimary: {
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    borderColor: 'rgba(192, 132, 252, 0.5)',
  },
  statCardSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: 'rgba(52, 211, 153, 0.5)',
  },
  statCardComplete: {
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  filterTabActive: {
    backgroundColor: '#9333ea',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    height: 3,
    width: 20,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: 18,
    marginBottom: 16,
    ...shadows.medium,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[400],
    borderRightWidth: 0.5,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderRightColor: colors.border.light,
    borderTopColor: colors.border.light,
    borderBottomColor: colors.border.light,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingIdLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
  bookingId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  serviceName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  infoSubValue: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  bookingFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetails: {
    fontSize: 14,
    color: '#9333ea',
    fontWeight: '700',
    marginRight: 4,
  },
  viewDetailsArrow: {
    fontSize: 16,
    color: '#9333ea',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  emptySubText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default DashboardScreen;
