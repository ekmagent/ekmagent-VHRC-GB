// GoHighLevel Custom Fields Mapping for Enhanced Tracking Data
// Maps comprehensive tracking data to GHL custom field format

export const mapToGHLCustomFields = (webhookData) => {
  // Extract the core data
  const customFields = {
    // LEAD QUALITY & SCORING (Priority 1)
    cf_lead_quality_score: webhookData.lead_quality_score || 0,
    cf_device_quality_score: webhookData.device_quality_score || 0,
    cf_engagement_score: webhookData.engagement_score || 0,
    cf_data_completeness: webhookData.data_completeness || 0,
    cf_tracking_confidence: webhookData.tracking_confidence || 0,
    
    // ATTRIBUTION DATA (Priority 1)
    cf_utm_source: webhookData.utm_source || '',
    cf_utm_medium: webhookData.utm_medium || '',
    cf_utm_campaign: webhookData.utm_campaign || '',
    cf_utm_content: webhookData.utm_content || '',
    cf_utm_term: webhookData.utm_term || '',
    
    // FACEBOOK TRACKING IDs (Critical for CAPI)
    cf_facebook_click_id: webhookData.fbc || '',
    cf_facebook_browser_id: webhookData.fbp || '',
    cf_google_click_id: webhookData.gclid || '',
    cf_microsoft_click_id: webhookData.msclkid || '',
    
    // DEVICE INTELLIGENCE (Priority 2)
    cf_device_type: getDeviceType(webhookData),
    cf_platform: webhookData.platform || '',
    cf_screen_resolution: webhookData.screen_resolution || '',
    cf_connection_type: webhookData.connection_type || '',
    cf_is_mobile: webhookData.is_mobile || false,
    cf_is_tablet: webhookData.is_tablet || false,
    cf_device_pixel_ratio: webhookData.device_pixel_ratio || 1,
    
    // BEHAVIORAL & ENGAGEMENT (Priority 3)
    cf_page_load_time: webhookData.page_load_time || 0,
    cf_session_duration: calculateSessionDuration(webhookData),
    cf_form_completion_time: calculateFormCompletionTime(webhookData),
    cf_session_id: webhookData.session_id || '',
    cf_pixel_event_id: webhookData.pixel_event_id || '',
    
    // GEOGRAPHIC & TECHNICAL (Priority 4)
    cf_timezone: webhookData.timezone || '',
    cf_language: webhookData.language || '',
    cf_ip_address: hashForPrivacy(webhookData.ip_address), // Hash for privacy
    cf_referrer: webhookData.referrer || '',
    cf_landing_url: webhookData.url || '',
    
    // CONVERSION DATA
    cf_completion_status: webhookData.completion_status || 'unknown',
    cf_webinar_time: webhookData.webinarTime || '',
    cf_webinar_time_unix: webhookData.webinarTime_unix || 0,
    cf_registration_completed_at: webhookData.registration_completed_at || '',
    
    // MEDICARE-SPECIFIC DATA
    cf_medicare_journey: webhookData.medicareJourney || '',
    cf_current_insurance: webhookData.currentInsurance || '',
    cf_insurance_cost: webhookData.insuranceCost || '',
    cf_birth_year: webhookData.birthYear || '',
    cf_birth_month: webhookData.birthMonth || '',
    
    // TECHNICAL TRACKING
    cf_user_agent_hash: hashForPrivacy(webhookData.user_agent), // Hash for privacy
    cf_event_time: webhookData.event_time || 0,
    cf_event_id: webhookData.event_id || '',
    cf_external_id: webhookData.external_id || '', // Hashed email
  };
  
  return customFields;
};

// Helper Functions
const getDeviceType = (data) => {
  if (data.is_mobile) return 'mobile';
  if (data.is_tablet) return 'tablet';
  return 'desktop';
};

const calculateSessionDuration = (data) => {
  // Calculate from tracking data or return 0
  return data.session_duration || 0;
};

const calculateFormCompletionTime = (data) => {
  // Calculate time from page load to completion
  if (data.registration_completed_at && data.page_load_time) {
    const completedAt = new Date(data.registration_completed_at).getTime();
    const startTime = completedAt - (data.page_load_time || 0);
    return completedAt - startTime;
  }
  return 0;
};

// Hash sensitive data for privacy (simple hash for demo)
const hashForPrivacy = (value) => {
  if (!value) return '';
  // In production, use proper hashing like SHA-256
  return btoa(value).substring(0, 12) + '...'; // Simple base64 truncation for demo
};

// GHL Webhook payload with custom fields
export const createGHLWebhookPayload = (webhookData) => {
  const customFields = mapToGHLCustomFields(webhookData);
  
  return {
    // Standard contact fields
    firstName: webhookData.firstName || '',
    lastName: webhookData.lastName || '',
    email: webhookData.email || '',
    phone: webhookData.phone || '',
    
    // Custom fields for enhanced tracking
    customFields,
    
    // Original webhook data for reference
    originalData: {
      source: 'enhanced_medicare_webinar',
      timestamp: new Date().toISOString(),
      version: '2.0'
    }
  };
};

// Facebook CAPI payload using GHL custom field data
export const createCAPIFromGHL = (ghlCustomFields) => {
  return {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: ghlCustomFields.cf_event_id || `evt_${Date.now()}`,
      action_source: 'website',
      
      user_data: {
        // Use the Facebook IDs from custom fields
        fbc: ghlCustomFields.cf_facebook_click_id || '',
        fbp: ghlCustomFields.cf_facebook_browser_id || '',
        external_id: ghlCustomFields.cf_external_id || '',
        client_ip_address: ghlCustomFields.cf_ip_address || '',
        client_user_agent: ghlCustomFields.cf_user_agent_hash || ''
      },
      
      custom_data: {
        // Lead qualification from custom fields
        lead_quality_score: ghlCustomFields.cf_lead_quality_score,
        device_quality_score: ghlCustomFields.cf_device_quality_score,
        engagement_score: ghlCustomFields.cf_engagement_score,
        
        // Attribution from custom fields
        utm_source: ghlCustomFields.cf_utm_source,
        utm_campaign: ghlCustomFields.cf_utm_campaign,
        
        // Device intelligence
        device_type: ghlCustomFields.cf_device_type,
        platform: ghlCustomFields.cf_platform,
        
        // Medicare-specific data
        medicare_journey: ghlCustomFields.cf_medicare_journey,
        current_insurance: ghlCustomFields.cf_current_insurance,
        insurance_cost: ghlCustomFields.cf_insurance_cost,
        
        // Engagement metrics
        completion_status: ghlCustomFields.cf_completion_status,
        form_completion_time: ghlCustomFields.cf_form_completion_time
      }
    }]
  };
};

// Usage example:
/*
// 1. Transform your enhanced webhook data to GHL format
const ghlPayload = createGHLWebhookPayload(yourEnhancedWebhookData);

// 2. Send to GHL webhook
await fetch('YOUR_GHL_WEBHOOK_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(ghlPayload)
});

// 3. Later, use GHL custom fields to create Facebook CAPI payload
const capiPayload = createCAPIFromGHL(ghlPayload.customFields);

// 4. Send to Facebook CAPI
await fetch('https://graph.facebook.com/v18.0/YOUR_PIXEL_ID/events', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify(capiPayload)
});
*/
