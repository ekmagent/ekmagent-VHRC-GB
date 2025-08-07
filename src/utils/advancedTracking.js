// Advanced Tracking Utilities for Facebook Conversions API and Attribution
// Captures comprehensive user data for better signal quality

const convertToGHLTimezone = (timezone, offset) => {
  // Convert offset from minutes to hours (JavaScript offset is opposite of GMT)
  const offsetHours = Math.abs(offset) / 60;
  const sign = offset > 0 ? '-' : '+'; 
  
  // Format GMT offset (pad single digits with 0)
  const hours = Math.floor(offsetHours).toString().padStart(2, '0');
  const minutes = ((offsetHours % 1) * 60).toString().padStart(2, '0');
  const gmtOffset = `GMT${sign}${hours}:${minutes}`;
  
  // Get timezone abbreviation
  const now = new Date();
  let timezoneName = '';
  try {
    timezoneName = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'short'
    }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || '';
  } catch (error) {
    console.warn('Could not get timezone abbreviation:', error);
    timezoneName = timezone.split('/')[1] || timezone;
  }
  
  // Map common timezones to GHL-expected format
  const timezoneMap = {
    'America/Los_Angeles': 'America/Los_Angeles',
    'America/New_York': 'America/New_York', 
    'America/Chicago': 'America/Chicago',
    'America/Denver': 'America/Denver',
    'America/Phoenix': 'America/Phoenix',
    'America/Anchorage': 'America/Juneau',
    'Pacific/Honolulu': 'Pacific/Honolulu',
    'Europe/London': 'Europe/London',
    'America/Toronto': 'America/Toronto'
  };
  
  const mappedTimezone = timezoneMap[timezone] || timezone;
  
  return `${gmtOffset} ${mappedTimezone} (${timezoneName})`;
};

export const getAdvancedTrackingData = async () => {
  let data = {};
  
  try {
    // 1. FACEBOOK TRACKING (Critical for Conversions API)
    const urlParams = new URLSearchParams(window.location.search);
    
    // Facebook Click ID (from URL parameter)
    data.fbc = (() => {
      const fbclid = urlParams.get('fbclid');
      if (fbclid) {
        return `fb.1.${Date.now()}.${fbclid}`;
      }
      
      const fbcCookie = getCookie('_fbc');
      if (fbcCookie) {
        return fbcCookie.startsWith('fb.1.') ? fbcCookie : `fb.1.${Date.now()}.${fbcCookie}`;
      }
      
      return '';
    })();
    
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
    
    // 6. TIMEZONE DATA - Updated for GHL format
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneOffset = new Date().getTimezoneOffset();
    
    // Keep original for internal use/debugging
    data.timezone_raw = timezone;
    data.timezone_offset_raw = timezoneOffset;
    
    // Add GHL-formatted timezone
    data.timezone = convertToGHLTimezone(timezone, timezoneOffset);
    data.timezone_offset = timezoneOffset; // Keep as number for other uses

    // 7. CONNECTION INFO
    if (navigator.connection) {
      data.connection_type = navigator.connection.effectiveType;
      data.connection_downlink = navigator.connection.downlink;
    }

    // 8. SESSION DATA
    data.session_id = getOrCreateSessionId();
    data.page_load_time = performance.now();
    data.is_mobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    data.is_tablet = /iPad|Android(?!.*Mobile)/.test(navigator.userAgent);
    
    // 9. FACEBOOK-SPECIFIC ENHANCEMENTS
    // External ID (hashed email for better matching)
    data.external_id = ''; // Will be populated after email is entered
    
    // Facebook Advanced Matching Parameters
    data.client_ip_address = data.ip_address; // Facebook prefers this field name
    data.client_user_agent = data.user_agent; // Facebook prefers this field name
    
    // 10. ATTRIBUTION DATA
    data.utm_source = urlParams.get('utm_source') || '';
    data.utm_medium = urlParams.get('utm_medium') || '';
    data.utm_campaign = urlParams.get('utm_campaign') || '';
    data.utm_content = urlParams.get('utm_content') || '';
    data.utm_term = urlParams.get('utm_term') || '';
    data.gclid = urlParams.get('gclid') || ''; // Google Click ID
    data.msclkid = urlParams.get('msclkid') || ''; // Microsoft Click ID
    
    // 11. ENGAGEMENT METRICS
    data.page_view_id = generateUniqueId();
    data.session_duration = 0; // Will be updated as user interacts
    data.scroll_depth = 0; // Will be updated as user scrolls
    data.form_interactions = 0; // Will be updated as user fills form
    
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
