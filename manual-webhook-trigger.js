// Manual webhook trigger script
// Use this to send the initial webhook for the lead that was missed

const leadData = {
  "firstName": "Kathy",
  "lastName": "McOwen", 
  "email": "crzy4teapots@verizon.net",
  "phone": "(760) 713-1640",
  "webinarTime": "2025-08-05T22:30:00.000Z",
  "consent": true, // Override to true for initial webhook
  "medicareJourney": "Just starting to look into it",
  "birthMonth": "September",
  "birthYear": 1960,
  "currentInsurance": "Employer / Spouse Plan",
  "insuranceCost": "Feels a bit expensive",
  "utm_source": "fb",
  "utm_medium": "1 - Testing - T65 - Webinar",
  "utm_campaign": "Lifetime",
  "utm_content": "Test - t65 - Web - Vibe 3 things - Close Hook - Copy 2",
  "utm_term": "120228893999970657",
  "ip_address": "47.146.158.223",
  "fbc": "IwZXh0bgNhZW0BMABhZGlkAasjiup-_7EBHhAVK0X1BPGTQnkcAnQvU4lgAcaSZDS0ZU6r8EnAngHxv5uMzQXSHF87_51j_aem_efJCq9qq5TH0Ytb2B3fOvQ",
  "fbp": "fb.1.1754239099968.410209156810785191",
  "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22F76 [FBAN/FBIOS;FBAV/516.0.0.47.97;FBBV/743277063;FBDV/iPhone11,8;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/2;FBID/phone;FBLC/en_US;FBOP/5;FBRV/748262425;IABMV/1]",
  "referrer": "http://m.facebook.com/",
  "completion_status": "partial", // Change to partial for initial webhook
  "pixel_event_id": "event_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
  "content_name": "Webinar Registration",
  "event_name": "CompleteRegistration", // Change to CompleteRegistration
  "timestamp": new Date().toISOString(),
  // Add all the other tracking data...
  "screen_resolution": "414x896",
  "viewport_size": "414x728", 
  "device_pixel_ratio": 2,
  "platform": "iPhone",
  "language": "en-US",
  "timezone": "America/Los_Angeles",
  "timezone_offset": 420,
  "session_id": "evt_1754239237184_iia76wno0",
  "page_load_time": 196737,
  "is_mobile": true,
  "is_tablet": false,
  "client_ip_address": "47.146.158.223",
  "client_user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/22F76 [FBAN/FBIOS;FBAV/516.0.0.47.97;FBBV/743277063;FBDV/iPhone11,8;FBMD/iPhone;FBSN/iOS;FBSV/18.5;FBSS/2;FBID/phone;FBLC/en_US;FBOP/5;FBRV/748262425;IABMV/1]",
  "event_time": Math.floor(Date.now() / 1000),
  "event_id": "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
  "action_source": "website",
  "external_id": "1750a734a4aea1807b589f3cd8b01954097841bc2847821ad6d7556329e43528",
  "em": "1750a734a4aea1807b589f3cd8b01954097841bc2847821ad6d7556329e43528"
};

// Function to send the initial webhook
async function sendInitialWebhook() {
  try {
    console.log('🚀 Sending initial webhook for Kathy McOwen...');
    
    const response = await fetch('https://hook.us1.make.com/r1kbh1gkk5j31prdnhcn1dq8hsk2gyd9', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(leadData)
    });
    
    if (response.ok) {
      console.log('✅ Initial webhook sent successfully!');
      console.log('Response status:', response.status);
    } else {
      console.error('❌ Webhook failed with status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error sending webhook:', error);
  }
}

// Run the function
sendInitialWebhook();
