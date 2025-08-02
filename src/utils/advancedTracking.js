// Advanced Tracking Utilities for Facebook Conversions API and Attribution
// Captures comprehensive user data for better signal quality

export const getAdvancedTrackingData = async () => {
  const data = {};
  
  try {
    // 1. FACEBOOK TRACKING (Critical for Conversions API)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Facebook Click ID (from URL parameter)
    data.fbc = urlParams.get('fbclid') || '';
    
    // Facebook Browser ID (from cookie)
    data.fbp = getCookie('_fbp') || '';
    
    // Facebook Pixel ID (if you want to track which pixel)
    data.facebook_pixel_id = window.fbq && window.fbq.pixelId || '';

    // 2. IP ADDRESS (Required for Facebook Conversions API)
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      data.ip_address = ipData.ip;
    } catch (error) {
      console.warn('Could not fetch IP address:', error);
      data.ip_address = '';
    }

    // 3. USER AGENT (Device/Browser fingerprinting)
    data.user_agent = navigator.userAgent;
    
    // 4. REFERRER DATA
    data.referrer = document.referrer || '';
    data.landing_url = window.location.href;
    
    // 5. DEVICE & BROWSER INFO
    data.screen_resolution = `${screen.width}x${screen.height}`;
    data.viewport_size = `${window.innerWidth}x${window.innerHeight}`;
    data.device_pixel_ratio = window.devicePixelRatio || 1;
    data.color_depth = screen.colorDepth;
    data.platform = navigator.platform;
    data.language = navigator.language;
    data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    data.timezone_offset = new Date().getTimezoneOffset();

    // 6. CONNECTION INFO
    if (navigator.connection) {
      data.connection_type = navigator.connection.effectiveType;
      data.connection_downlink = navigator.connection.downlink;
    }

    // 7. SESSION DATA
    data.session_id = getOrCreateSessionId();
    data.page_load_time = performance.now();
    data.is_mobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    data.is_tablet = /iPad|Android(?!.*Mobile)/.test(navigator.userAgent);
    
    // 8. FACEBOOK-SPECIFIC ENHANCEMENTS
    // External ID (hashed email for better matching)
    data.external_id = ''; // Will be populated after email is entered
    
    // Facebook Advanced Matching Parameters
    data.client_ip_address = data.ip_address; // Facebook prefers this field name
    data.client_user_agent = data.user_agent; // Facebook prefers this field name
    
    // 9. ATTRIBUTION DATA
    data.utm_source = urlParams.get('utm_source') || '';
    data.utm_medium = urlParams.get('utm_medium') || '';
    data.utm_campaign = urlParams.get('utm_campaign') || '';
    data.utm_content = urlParams.get('utm_content') || '';
    data.utm_term = urlParams.get('utm_term') || '';
    data.gclid = urlParams.get('gclid') || ''; // Google Click ID
    data.msclkid = urlParams.get('msclkid') || ''; // Microsoft Click ID
    
    // 10. ENGAGEMENT METRICS
    data.page_view_id = generateUniqueId();
    data.session_duration = 0; // Will be updated as user interacts
    data.scroll_depth = 0; // Will be updated as user scrolls
    data.form_interactions = 0; // Will be updated as user fills form
    
    // 11. GEOLOCATION (if permission granted)
    if (navigator.geolocation) {
      try {
        const position = await getCurrentPosition();
        data.latitude = position.coords.latitude;
        data.longitude = position.coords.longitude;
        data.location_accuracy = position.coords.accuracy;
      } catch (error) {
        // User denied location or error occurred
        data.latitude = '';
        data.longitude = '';
      }
    }

    // 12. ADDITIONAL FACEBOOK SIGNALS
    data.event_time = Math.floor(Date.now() / 1000); // Unix timestamp
    data.event_id = generateUniqueId(); // Unique event identifier
    data.action_source = 'website'; // Facebook Conversions API requirement
    
    return data;
    
  } catch (error) {
    console.error('Error collecting tracking data:', error);
    return data; // Return partial data even if some collection fails
  }
};

// Helper Functions
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

export const setCookie = (name, value, days = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

export const getOrCreateSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = generateUniqueId();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export const generateUniqueId = () => {
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 5000,
      enableHighAccuracy: false
    });
  });
};

// Hash function for PII (Facebook Conversions API best practice)
export const hashPII = async (value) => {
  if (!value) return '';
  
  // Normalize the value
  const normalized = value.toLowerCase().trim();
  
  // Create hash using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Enhanced event tracking for Facebook
export const trackEnhancedEvent = async (eventName, eventData = {}, userEmail = '') => {
  const trackingData = await getAdvancedTrackingData();
  
  // Hash email for Facebook Advanced Matching
  if (userEmail) {
    trackingData.external_id = await hashPII(userEmail);
    trackingData.em = await hashPII(userEmail); // Facebook field name
  }
  
  const enhancedEventData = {
    ...trackingData,
    ...eventData,
    event_name: eventName,
    timestamp: new Date().toISOString()
  };
  
  return enhancedEventData;
};
