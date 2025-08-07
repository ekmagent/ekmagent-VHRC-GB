// Real Form Test Instructions
// Use these steps to create trackable real events

const REAL_TEST_STEPS = {
  // Step 1: Use your own form with identifiable data
  testData: {
    firstName: "TestUser", // Use distinctive name
    lastName: "FacebookTest", // Easy to find
    email: "your-test-email+fbtest@gmail.com", // Use + addressing
    phone: "555-TEST-123", // Distinctive number
    webinarTime: "Pick any available time"
  },

  // Step 2: Complete the form normally
  process: [
    "1. Go to your landing page",
    "2. Fill out form with test data above", 
    "3. Complete through step 5 (consent) - triggers initial webhook",
    "4. Complete all steps - triggers final webhook",
    "5. Check Facebook Events Manager in 5-10 minutes"
  ],

  // Step 3: What to look for in Events Manager
  verification: {
    location: "Events Manager → Your Pixel → Events Tab",
    filters: {
      timeRange: "Last 1 hour",
      eventSource: "Server", 
      eventName: "CompleteRegistration or Lead"
    },
    checkFor: [
      "Event appears with your test name",
      "Click through to event details",
      "Verify fbc (Click ID) is present", 
      "Verify fbp (Browser ID) is present",
      "Check user_data section for your test email hash",
      "Confirm custom_data values are correct"
    ]
  }
};

console.log("Use the steps above to test real CAPI events");
