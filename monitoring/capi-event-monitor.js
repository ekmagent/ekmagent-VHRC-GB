// Facebook CAPI Event Monitor
// Add this to your Make.com scenario to log all CAPI events

const CAPI_MONITOR = {
  // Log every event that gets sent to Facebook
  logEvent: (eventData) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event_name: eventData.event_name,
      event_id: eventData.event_id,
      user_data_present: {
        fbc: !!eventData.user_data?.fbc,
        fbp: !!eventData.user_data?.fbp, 
        em: !!eventData.user_data?.em,
        client_ip_address: !!eventData.user_data?.client_ip_address,
        client_user_agent: !!eventData.user_data?.client_user_agent
      },
      custom_data: eventData.custom_data,
      // Add any other fields you want to monitor
      utm_source: eventData.custom_data?.utm_source,
      completion_status: eventData.custom_data?.completion_status
    };
    
    // In Make.com, you can:
    // 1. Save this to Google Sheets
    // 2. Send to Slack
    // 3. Store in a database
    // 4. Email yourself
    
    console.log('📊 CAPI Event Logged:', JSON.stringify(logEntry, null, 2));
    return logEntry;
  },

  // Create a dashboard URL for easy monitoring
  dashboardQueries: {
    allEvents: "https://business.facebook.com/events_manager/pixel/YOUR_PIXEL_ID/events",
    serverEvents: "https://business.facebook.com/events_manager/pixel/YOUR_PIXEL_ID/events?event_source=server",
    diagnostics: "https://business.facebook.com/events_manager/pixel/YOUR_PIXEL_ID/diagnostics"
  }
};

// Example usage in Make.com:
// 1. Add this as a "JavaScript" module after your CAPI call
// 2. Pass the event data through this function
// 3. Log the results to your preferred monitoring system

module.exports = CAPI_MONITOR;
