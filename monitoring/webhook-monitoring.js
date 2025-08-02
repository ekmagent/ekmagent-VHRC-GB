// Webhook Monitoring Dashboard
// Add this to your Make.com scenarios

const WEBHOOK_MONITORING = {
  // Set up alerts for unexpected patterns
  alerts: {
    // Alert if dev mode data comes through
    devModeData: {
      condition: "completion_status contains 'dev' OR url contains 'dev=true'",
      action: "Send email alert: DEV MODE DATA DETECTED IN PRODUCTION!"
    },
    
    // Alert for unusual abandonment rates
    abandonmentSpike: {
      condition: "completion_status = 'abandoned_visibility_change' > 80% in last hour",
      action: "Send Slack alert: High abandonment rate detected"
    },
    
    // Alert for missing required fields
    dataQuality: {
      condition: "firstName is empty OR email is empty",
      action: "Log to error tracking system"
    }
  },

  // Daily health check
  healthCheck: {
    schedule: "0 9 * * *", // 9 AM daily
    checks: [
      "Webhook response times < 2s",
      "No dev mode data in last 24h",
      "Form completion rate > 15%",
      "All required tracking data present"
    ]
  }
};
