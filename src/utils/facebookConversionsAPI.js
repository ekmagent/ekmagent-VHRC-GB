// Facebook Conversions API Enhanced Implementation
// Use this with your Make.com webhook to send high-quality data to Facebook

export const createFacebookConversionsAPIPayload = async (formData, eventName = 'Lead') => {
  const payload = {
    // Required Facebook Conversions API structure
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000), // Current Unix timestamp
      event_id: formData.event_id || `evt_${Date.now()}`, // Unique event ID for deduplication
      action_source: 'website',
      
      // User Data (for matching) - all should be hashed
      user_data: {
        // Email (hashed)
        em: formData.em || '', // Already hashed in advancedTracking.js
        
        // Phone (would need to be hashed if collected)
        // ph: hashedPhone,
        
        // Facebook Click ID
        fbc: formData.fbc || '',
        
        // Facebook Browser ID  
        fbp: formData.fbp || '',
        
        // IP Address (required)
        client_ip_address: formData.client_ip_address || formData.ip_address,
        
        // User Agent (required)
        client_user_agent: formData.client_user_agent || formData.user_agent,
        
        // External ID (for better matching)
        external_id: formData.external_id || ''
      },
      
      // Custom Data (business-specific information)
      custom_data: {
        // Lead qualification data
        medicare_journey: formData.medicareJourney || '',
        current_insurance: formData.currentInsurance || '',
        insurance_cost: formData.insuranceCost || '',
        birth_year: formData.birthYear || '',
        birth_month: formData.birthMonth || '',
        webinar_time: formData.webinarTime || '',
        
        // Attribution data
        utm_source: formData.utm_source || '',
        utm_medium: formData.utm_medium || '',
        utm_campaign: formData.utm_campaign || '',
        utm_content: formData.utm_content || '',
        utm_term: formData.utm_term || '',
        
        // Device intelligence
        device_type: formData.is_mobile ? 'mobile' : (formData.is_tablet ? 'tablet' : 'desktop'),
        screen_resolution: formData.screen_resolution || '',
        platform: formData.platform || '',
        language: formData.language || '',
        timezone: formData.timezone || '',
        
        // Engagement metrics
        session_id: formData.session_id || '',
        page_load_time: formData.page_load_time || '',
        form_completion_time: Date.now() - (formData.page_load_time || Date.now()),
        
        // Geographic data (if available)
        latitude: formData.latitude || '',
        longitude: formData.longitude || '',
        
        // Technical data
        referrer: formData.referrer || '',
        landing_url: formData.url || window.location.href
      }
    }],
    
    // Test event code (remove in production)
    test_event_code: process.env.NODE_ENV === 'development' ? 'TEST_EVENT_CODE' : undefined
  };
  
  return payload;
};

// Example usage in your webhook payload
export const enhanceWebhookWithFacebookData = (formData) => {
  return {
    // Your existing webhook data
    ...formData,
    
    // Enhanced Facebook Conversions API payload
    facebook_conversions_api: createFacebookConversionsAPIPayload(formData),
    
    // Lead scoring enhancements
    lead_quality_score: calculateLeadQualityScore(formData),
    device_quality_score: calculateDeviceQualityScore(formData),
    engagement_score: calculateEngagementScore(formData),
    
    // Data completeness metrics
    data_completeness: calculateDataCompleteness(formData),
    tracking_confidence: calculateTrackingConfidence(formData)
  };
};

// Lead quality scoring based on collected data
const calculateLeadQualityScore = (data) => {
  let score = 0;
  
  // Attribution quality (40 points max)
  if (data.utm_source === 'facebook') score += 15;
  else if (data.utm_source === 'google') score += 12;
  else if (data.utm_source) score += 8;
  
  if (data.fbc) score += 10; // Direct Facebook click
  if (data.gclid) score += 8; // Direct Google click
  if (data.referrer && !data.referrer.includes('facebook.com')) score += 7;
  
  // Device quality (25 points max)
  if (data.is_mobile === false) score += 10; // Desktop users often higher value
  if (data.device_pixel_ratio > 1) score += 5; // High-res devices
  if (data.connection_type === '4g') score += 5;
  if (data.platform && data.platform.includes('Mac')) score += 5;
  
  // Geographic quality (20 points max)
  if (data.timezone && data.timezone.includes('America')) score += 10;
  if (data.language === 'en-US') score += 10;
  
  // Engagement quality (15 points max)
  if (data.page_load_time && data.page_load_time < 3000) score += 5; // Fast load
  if (data.session_duration > 120000) score += 5; // 2+ minutes on page
  if (data.scroll_depth > 50) score += 5; // Engaged with content
  
  return Math.min(score, 100); // Cap at 100
};

const calculateDeviceQualityScore = (data) => {
  let score = 50; // Base score
  
  // Premium device indicators
  if (data.device_pixel_ratio > 2) score += 20;
  if (data.platform && data.platform.includes('Mac')) score += 15;
  if (data.screen_resolution && data.screen_resolution.includes('1920x1080')) score += 10;
  if (!data.is_mobile) score += 10;
  if (data.connection_type === '4g') score += 5;
  
  return Math.min(score, 100);
};

const calculateEngagementScore = (data) => {
  let score = 0;
  
  // Time-based engagement
  if (data.session_duration > 300000) score += 30; // 5+ minutes
  else if (data.session_duration > 120000) score += 20; // 2+ minutes
  else if (data.session_duration > 60000) score += 10; // 1+ minute
  
  // Interaction-based engagement
  if (data.scroll_depth > 75) score += 25;
  else if (data.scroll_depth > 50) score += 15;
  else if (data.scroll_depth > 25) score += 10;
  
  if (data.form_interactions > 10) score += 20;
  else if (data.form_interactions > 5) score += 15;
  else if (data.form_interactions > 2) score += 10;
  
  // Completion indicators
  if (data.consent) score += 25; // Completed to consent step
  
  return Math.min(score, 100);
};

const calculateDataCompleteness = (data) => {
  const criticalFields = ['ip_address', 'user_agent', 'session_id', 'event_time'];
  const importantFields = ['fbc', 'fbp', 'utm_source', 'referrer'];
  const niceToHaveFields = ['platform', 'language', 'timezone', 'screen_resolution'];
  
  let completeness = 0;
  
  // Critical fields (60% weight)
  const criticalComplete = criticalFields.filter(field => data[field]).length;
  completeness += (criticalComplete / criticalFields.length) * 60;
  
  // Important fields (30% weight)
  const importantComplete = importantFields.filter(field => data[field]).length;
  completeness += (importantComplete / importantFields.length) * 30;
  
  // Nice-to-have fields (10% weight)
  const niceComplete = niceToHaveFields.filter(field => data[field]).length;
  completeness += (niceComplete / niceToHaveFields.length) * 10;
  
  return Math.round(completeness);
};

const calculateTrackingConfidence = (data) => {
  let confidence = 0;
  
  // Multiple ID sources increase confidence
  if (data.fbc) confidence += 25; // Facebook Click ID
  if (data.fbp) confidence += 20; // Facebook Browser ID
  if (data.gclid) confidence += 15; // Google Click ID
  if (data.session_id) confidence += 10; // Session tracking
  if (data.ip_address) confidence += 15; // IP address
  if (data.external_id) confidence += 15; // Hashed email
  
  return Math.min(confidence, 100);
};
