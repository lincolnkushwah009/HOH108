/**
 * Notification Sound Utility
 *
 * Handles playing notification sounds for new leads
 */

import notificationSound from '../assets/sound.mp3';

// Create audio element for notification
let audioElement = null;
let isInitialized = false;

// Initialize audio element (needs user interaction first)
const initAudioElement = () => {
  if (!isInitialized) {
    audioElement = new Audio(notificationSound);
    audioElement.volume = 0.7; // Set volume to 70%
    isInitialized = true;
  }
  return audioElement;
};

// Play notification sound from audio file
const playNotificationSound = () => {
  try {
    const audio = initAudioElement();

    // Reset audio to start if it's already playing
    audio.currentTime = 0;

    // Play the sound
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('🔔 Notification sound played');
        })
        .catch(error => {
          console.error('Error playing notification sound:', error);
        });
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Play sound with user permission check
export const playNewLeadNotification = () => {
  // ALWAYS play sound first
  playNotificationSound();

  // Then try to show browser notification if supported
  if ('Notification' in window) {
    // Request permission if not already granted
    if (Notification.permission === 'granted') {
      // Show browser notification
      new Notification('New Lead Received! 🎉', {
        body: 'A new lead has been submitted. Check the Leads panel.',
        icon: '/favicon.png',
        badge: '/favicon.png'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('New Lead Received! 🎉', {
            body: 'A new lead has been submitted. Check the Leads panel.',
            icon: '/favicon.png',
            badge: '/favicon.png'
          });
        }
      });
    }
  }
};

// Initialize audio element on user interaction
export const initNotificationSystem = () => {
  initAudioElement();
};
