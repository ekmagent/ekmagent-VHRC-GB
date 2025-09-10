import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Shield, CheckCircle, Star, CheckCircle2, Award, ShieldCheck } from 'lucide-react';
import { getAdvancedTrackingData, trackEnhancedEvent } from '../utils/advancedTracking';
import { enhanceWebhookWithFacebookData } from '../utils/facebookConversionsAPI';

import ProgressIndicator from '../components/webinar/ProgressIndicator';
import FirstNameStep from '../components/webinar/FirstNameStep';
import LastNameStep from '../components/webinar/LastNameStep';
import PhoneStep from '../components/webinar/PhoneStep';
import ConsentStep from '../components/webinar/ConsentStep';
import MilitaryBranchStep from '../components/webinar/Turning65Step'; // Using existing Turning65Step as MilitaryBranchStep
import MilitaryHealthStep from '../components/webinar/MilitaryHealthStep';
import VAMedicationsStep from '../components/webinar/VAMedicationsStep';
import PartBPremiumStep from '../components/webinar/PartBPremiumStep';
import MedicareAdvantageStep from '../components/webinar/MedicareAdvantageStep';
import AspirationStep from '../components/webinar/AspirationStep';
import ComplianceStep from '../components/webinar/ComplianceStep';
import StartDateStep from '../components/webinar/StartDateStep';
import ZipCodeStep from '../components/webinar/ZipCodeStep';
import PhoneConfirmationStep from '../components/webinar/PhoneConfirmationStep';
import NotQualifiedPage from './NotQualifiedPage';
import QualifiedPage from './QualifiedPage';

export default function MedicareLanding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotQualified, setShowNotQualified] = useState(false);
  const [showQualifiedPage, setShowQualifiedPage] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const totalSteps = 14; // Total number of form steps
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    zipCode: '',
    consent: false,
    militaryBranch: '',
    militaryHealth: '',
    vaMedications: '',
    partBPremium: '',
    medicareAdvantage: '',
    aspiration: '',
    compliance: '',
    startDate: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    // Enhanced tracking data
    ip_address: '',
    fbc: '',  // Facebook Click ID
    fbp: '',  // Facebook Browser ID
    user_agent: '',
    referrer: '',
    url: '',
    // Advanced tracking fields
    screen_resolution: '',
    viewport_size: '',
    device_pixel_ratio: '',
    platform: '',
    language: '',
    timezone: '',
    timezone_offset: '',
    connection_type: '',
    connection_downlink: '',
    session_id: '',
    page_load_time: '',
    is_mobile: '',
    is_tablet: '',
    client_ip_address: '',
    client_user_agent: '',
    gclid: '',
    msclkid: '',
    event_time: '',
    event_id: '',
    action_source: 'website',
    external_id: '', // Hashed email for Facebook
    em: '' // Hashed email for Facebook Conversions API
  });
  const [pixelEventId, setPixelEventId] = useState('');
  const [devMode, setDevMode] = useState(false);
  const [testSessionId] = useState(() => 'test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
  const [inactivityTimer, setInactivityTimer] = useState(null);
  const [partialSent, setPartialSent] = useState(false);
  const [initialSubmitted, setInitialSubmitted] = useState(false);
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  // Add these state variables at the top
  const [fbData, setFbData] = useState({
    ip_address: '',
    fbc: '',
    fbp: '',
    user_agent: '',
    referrer: ''
  });

  const handleDisqualification = (reason) => {
    setDisqualificationReason(reason);
    setShowNotQualified(true);
  };

  const handleRestart = () => {
    setShowNotQualified(false);
    setCurrentStep(0);
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      consent: false,
      militaryBranch: '',
      militaryHealth: '',
      vaMedications: '',
      partBPremium: '',
      medicareAdvantage: '',
      aspiration: '',
      compliance: '',
      startDate: '',
      utm_source: formData.utm_source,
      utm_medium: formData.utm_medium,
      utm_campaign: formData.utm_campaign,
      utm_content: formData.utm_content,
      utm_term: formData.utm_term,
    });
  };

  const sendPartialData = async (data) => {
    console.log('🔍 sendPartialData called:', {
      consent: data.consent,
      partialSent,
      initialSubmitted,
      devMode,
      timestamp: new Date().toISOString()
    });
    
    if (data.consent && !partialSent && initialSubmitted && !devMode) {
      try {
        console.log('✅ Proceeding with partial data send');
        // Create enhanced tracking data for abandonment
        const enhancedData = await trackEnhancedEvent('FormAbandonment', {
          completion_status: 'partial',
          last_step: currentStep,
          abandoned_at: new Date().toISOString(),
          abandonment_reason: 'inactivity_timer'
        }, data.firstName + ' ' + data.lastName);

        // Enhance with comprehensive tracking data
        const partialWebhook = enhanceWebhookWithFacebookData({
          ...data,
          ...enhancedData,
          completion_status: 'partial',
          last_step: currentStep,
          abandoned_at: new Date().toISOString()
        });
        
        // Use sendBeacon for reliable delivery during page unload
        const webhookPayload = JSON.stringify(partialWebhook);
        const success = navigator.sendBeacon(
          'https://hook.us1.make.com/hngcspz66w1q367qmpy5c84afsanf9nh',
          new Blob([webhookPayload], { type: 'application/json' })
        );
        
        if (success) {
          console.log('✅ Sent enhanced partial data via sendBeacon:', partialWebhook);
          setPartialSent(true);
        } else {
          console.warn('⚠️ sendBeacon failed, falling back to fetch');
          // Fallback to regular fetch
          await fetch('https://hook.us1.make.com/hngcspz66w1q367qmpy5c84afsanf9nh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: webhookPayload,
            mode: 'no-cors'
          });
          console.log('✅ Sent enhanced partial data via fetch fallback');
          setPartialSent(true);
        }
      } catch (error) {
        console.error('Error sending enhanced partial data:', error);
      }
    } else {
      console.log('🚫 sendPartialData blocked:', {
        reason: !data.consent ? 'no_consent' : partialSent ? 'already_sent' : !initialSubmitted ? 'no_initial_submit' : 'dev_mode',
        consent: data.consent,
        partialSent,
        initialSubmitted,
        devMode
      });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isDevMode = urlParams.get('dev') === 'true';
    setDevMode(isDevMode);
    
    const utmData = {
      utm_source: urlParams.get('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_content: urlParams.get('utm_content') || '',
      utm_term: urlParams.get('utm_term') || '',
    };
    setFormData(prev => ({ ...prev, ...utmData }));
    
    if (isDevMode) {
      console.log('🧪 DEV MODE ACTIVATED - No webhooks or pixels will fire');
      console.log('To disable dev mode, remove ?dev=true from URL');
    } else {
      console.log('✅ PRODUCTION MODE - Webhooks and pixels will fire normally');
    }

    if (typeof window !== 'undefined' && window.fbq && !isDevMode) {
      window.fbq('track', 'PageView', {
        utm_source: utmData.utm_source,
        utm_campaign: utmData.utm_campaign,
        utm_medium: utmData.utm_medium
      });
    } else if (isDevMode) {
      console.log('🧪 DEV MODE: Skipped PageView pixel event');
    }
    
    const savedData = localStorage.getItem('webinarFormData');
    if (savedData) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedData) }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }

    // Capture comprehensive tracking data
    const captureWebData = async () => {
      try {
        // Get advanced tracking data
        const advancedData = await getAdvancedTrackingData();
        
        console.log('📊 Captured advanced tracking data:', advancedData);
        
        setFbData({
          ip_address: advancedData.ip_address,
          fbc: advancedData.fbc,
          fbp: advancedData.fbp,
          user_agent: advancedData.user_agent,
          referrer: advancedData.referrer
        });
        
        // Update formData with all tracking data
        setFormData(prev => ({
          ...prev,
          ...utmData,
          ...advancedData
        }));
        
      } catch (error) {
        console.error('Error capturing advanced tracking data:', error);
      }
    };

    captureWebData();
  }, []);

  useEffect(() => {
    // Add global error handler to prevent uncaught errors from breaking the form
    const handleGlobalError = (event) => {
      console.warn('Global error caught:', event.error);
      // Don't let errors break the form functionality
      event.preventDefault();
    };

    const handleUnhandledRejection = (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      // Don't let promise rejections break the form
      event.preventDefault();
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('webinarFormData', JSON.stringify(formData));
  }, [formData]);

  // Use Page Visibility API to capture form abandonment (better for Facebook in-app browser)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && formData.consent && !partialSent && !finalSubmitted && initialSubmitted) {
        if (!devMode) {
          // Page became hidden - user likely left (especially good for Facebook browser)
          const partialData = {
            ...formData,
            completion_status: 'abandoned_visibility_change',
            last_step: currentStep,
            abandoned_at: new Date().toISOString()
          };

          try {
          const success = navigator.sendBeacon(
            'https://hook.us1.make.com/hngcspz66w1q367qmpy5c84afsanf9nh',
            JSON.stringify(partialData)
          );
          
          if (success) {
            console.log('📵 Page hidden - sent partial data:', partialData);
            setPartialSent(true);
          } else {
            console.warn('📵 SendBeacon failed - data may not have been sent');
          }
        } catch (error) {
          console.error('📵 Error sending visibility change webhook:', error);
        }
        } else {
          console.log('🧪 DEV MODE: Would send data on visibility change');
          console.log('🧪 Visibility change detected but webhook blocked in dev mode');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [formData, currentStep, partialSent, devMode]);

  const nextStep = async (dataToSave = {}) => {
    const updatedFormData = { ...formData, ...dataToSave };
    setFormData(updatedFormData);

    // CLEAR any existing timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    // START 3-minute timer after consent AND initial submission
    if (updatedFormData.consent && !partialSent && initialSubmitted) {
      console.log('⏰ Starting inactivity timer', {
        testSessionId,
        devMode,
        timerDuration: devMode ? '30 seconds' : '3 minutes',
        consent: updatedFormData.consent,
        partialSent,
        currentStep,
        timestamp: new Date().toISOString()
      });
      
      const timer = setTimeout(() => {
        console.log('⏰ 3-minute timer fired!', {
          testSessionId,
          devMode,
          timestamp: new Date().toISOString()
        });
        sendPartialData(updatedFormData);
      }, devMode ? 30 * 1000 : 3 * 60 * 1000); // 30 seconds in dev mode, 3 minutes in production
      setInactivityTimer(timer);
    }

    // Fire FB Pixel events for micro-conversions with UTM data
    if (typeof window !== 'undefined' && window.fbq && !devMode) {
      switch (currentStep) {
        case 0: // After selecting time (this step is currentStep 0, so when moving to 1)
          window.fbq('track', 'ViewContent', { 
            content_name: 'Webinar Time Selected',
            utm_source: updatedFormData.utm_source,
            utm_campaign: updatedFormData.utm_campaign
          });
          break;
        case 2: // After submitting last name (this step is currentStep 2, so when moving to 3)
          window.fbq('track', 'InitiateCheckout', { 
            content_name: 'Webinar q 2 completed',
            utm_source: updatedFormData.utm_source,
            utm_campaign: updatedFormData.utm_campaign
          });
          break;
      }
    }

    setCurrentStep((prev) => prev + 1); 
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleInitialSubmit = async () => {
    // Prevent double submission
    if (initialSubmitted || isSubmitting) {
      console.log('🚫 Initial submission blocked - already submitted or in progress');
      return;
    }
    
    setIsSubmitting(true);
    setInitialSubmitted(true);
    const eventId = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setPixelEventId(eventId);

    const leadData = { ...formData, consent: true };
    setFormData(leadData);

    try {
      // Create enhanced tracking data for the initial submission
      const enhancedData = await trackEnhancedEvent('CompleteRegistration', {
        completion_status: 'partial',
        pixel_event_id: eventId,
        content_name: 'Webinar Registration'
      }, leadData.firstName + ' ' + leadData.lastName);

      // Enhance with Facebook Conversions API data
      const webhookData = enhanceWebhookWithFacebookData({
        ...leadData,
        ...enhancedData,
        consent: true, // Explicitly ensure consent is true
        pixel_event_id: eventId,
        completion_status: 'partial'
      });

      if (!devMode) {
        console.log('📊 Sending enhanced initial webhook data:', webhookData);
        const response = await fetch('https://hook.us1.make.com/hngcspz66w1q367qmpy5c84afsanf9nh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(webhookData),
          mode: 'no-cors'
        });
        console.log('Initial webhook response status:', response.status);
      } else {
        console.log('🧪 DEV MODE: Would send enhanced initial webhook:', webhookData);
      }

      // Fire CompleteRegistration pixel event (no value - let CAPI handle optimization)
      if (typeof window !== 'undefined' && window.fbq && !devMode) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'Webinar Registration',
          utm_source: leadData.utm_source,
          utm_campaign: leadData.utm_campaign
        }, { eventID: eventId });
      } else if (devMode) {
        console.log('🧪 DEV MODE: Would fire CompleteRegistration pixel event');
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error('Error on initial submission webhook:', error);
      // Reset guards on error to allow retry
      setInitialSubmitted(false);
      setCurrentStep((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async (finalData) => {
    // Prevent double submission
    if (finalSubmitted || isSubmitting) {
      console.log('🚫 Final submission blocked - already submitted or in progress');
      return;
    }
    
    setIsSubmitting(true);
    setFinalSubmitted(true);
    
    // CLEAR the timer - they're finishing!
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    const eventId = pixelEventId;
    const fullLeadData = { ...formData, ...finalData };
    setFormData(fullLeadData);

    try {
      // Create enhanced tracking data for the final submission
      const enhancedData = await trackEnhancedEvent('Lead', {
        completion_status: 'completed',
        pixel_event_id: eventId,
        pixel_event_name: 'Lead',
        registration_completed_at: new Date().toISOString(),
        content_name: 'Veteran Health Resource Lead'
      }, fullLeadData.firstName + ' ' + fullLeadData.lastName);

      // Enhance with Facebook Conversions API data and lead scoring
      const webhookData = enhanceWebhookWithFacebookData({
        ...fullLeadData,
        ...enhancedData,
        completion_status: 'completed',
        pixel_event_id: eventId,
        pixel_event_name: 'Lead',
        registration_completed_at: new Date().toISOString()
      });

      if (!devMode) {
        console.log('📊 Sending enhanced final webhook data:', webhookData);
        const response = await fetch('https://hook.us1.make.com/hngcspz66w1q367qmpy5c84afsanf9nh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(webhookData),
          mode: 'no-cors'
        });
        console.log('Final webhook response status:', response.status);
        localStorage.removeItem('webinarFormData');
        await new Promise((resolve) => setTimeout(resolve, 500));
        setShowQualifiedPage(true);
      } else {
        console.log('🧪 DEV MODE: Would send final webhook:', webhookData);
        console.log('🧪 DEV MODE: Form completed! Check console for all collected data.');
        setShowQualifiedPage(true);
      }
    } catch (error) {
      console.error('Error on final submit webhook:', error);
      // Reset guard on error to allow retry
      setFinalSubmitted(false);
      if (!devMode) {
        localStorage.removeItem('webinarFormData');
        setShowQualifiedPage(true);
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // Military Branch
        return <MilitaryBranchStep
          firstName=""
          onNext={(militaryBranch) => nextStep({ militaryBranch })} />;

      case 1: // Military Health Coverage (disqualifies)
        return <MilitaryHealthStep
          firstName=""
          onNext={(militaryHealth) => nextStep({ militaryHealth })}
          onBack={prevStep}
          onDisqualify={handleDisqualification} />;

      case 2: // VA Medications (disqualifies)
        return <VAMedicationsStep
          firstName=""
          onNext={(vaMedications) => nextStep({ vaMedications })}
          onBack={prevStep}
          onDisqualify={handleDisqualification} />;

      case 3: // Part B Premium (disqualifies)
        return <PartBPremiumStep
          firstName=""
          onNext={(partBPremium) => nextStep({ partBPremium })}
          onBack={prevStep}
          onDisqualify={handleDisqualification} />;

      case 4: // First Name
        return <FirstNameStep
          formData={formData}
          onNext={(firstName) => nextStep({ firstName })}
          onBack={prevStep} />;

      case 5: // Last Name
        return <LastNameStep
          formData={formData}
          onNext={(lastName) => nextStep({ lastName })}
          onBack={prevStep} />;

      case 6: // Phone
        return <PhoneStep
          formData={formData}
          onNext={(phone) => nextStep({ phone })}
          onBack={prevStep} />;

      case 7: // Zip Code
        return <ZipCodeStep
          formData={formData}
          onNext={(zipCode) => nextStep({ zipCode })}
          onBack={prevStep} />;

      case 8: // Aspiration Question
        return <AspirationStep
          firstName={formData.firstName || ""}
          onNext={(aspiration) => nextStep({ aspiration })}
          onBack={prevStep} />;

      case 9: // Medicare Advantage
        return <MedicareAdvantageStep
          firstName={formData.firstName || ""}
          onNext={(medicareAdvantage) => nextStep({ medicareAdvantage })}
          onBack={prevStep} />;

      case 10: // Compliance/Education
        return <ComplianceStep
          firstName={formData.firstName || ""}
          onNext={(compliance) => nextStep({ compliance })}
          onBack={prevStep} />;

      case 11: // Consent Step (moved from step 5)
        return <ConsentStep
          firstName={formData.firstName || ""}
          onSubmit={handleInitialSubmit}
          onBack={prevStep}
          isSubmitting={isSubmitting} />;

      case 12: // Phone Confirmation Step
        return <PhoneConfirmationStep
          currentPhone={formData.phone}
          onConfirmed={(confirmedPhone) => {
            // Update formData with confirmed/updated phone number
            setFormData(prev => ({ ...prev, phone: confirmedPhone }));
            nextStep({ phone: confirmedPhone });
          }}
          onBack={prevStep} />;

      case 13: // Start Date (Final submission)
        return <StartDateStep
          firstName={formData.firstName || ""}
          onSubmit={(startDate) => handleFinalSubmit({ startDate })}
          onBack={prevStep}
          isSubmitting={isSubmitting} />;

      default:
        return null;
    }
  };

  // Helper function to get cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  };

  // Show qualified page if completed
  if (showQualifiedPage) {
    return <QualifiedPage formData={formData} />;
  }

  // Show disqualification page if needed
  if (showNotQualified) {
    return <NotQualifiedPage reason={disqualificationReason} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
      {/* Dev Mode Indicator */}
      {devMode && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50 font-semibold">
          🧪 DEV MODE ACTIVE - No data will be sent to webhooks or pixels
        </div>
      )}
      
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4">

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/20 mb-4">
            <Shield className="w-4 h-4 text-[#dc2626] mr-2" />
            <span className="text-sm font-semibold text-[#1e3a8a]">FREE Veteran Benefits Assessment</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1e3a8a] leading-tight mb-3">
            Discover Your Veteran Giveback Benefit: Get Up to $1,800 Back Each Year
          </h1>
          
          <div className="flex justify-center mt-3 text-base text-gray-700">
            <ul className="space-y-1.5 text-left max-w-lg mx-auto">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start">

                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Get a <span className="font-bold text-[#1e3a8a]">Part B credit</span> that puts money back in your pocket.</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start">

                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Access <span className="font-bold text-[#1e3a8a]">extra benefits</span> like dental, vision, and hearing coverage.</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start">

                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><span className="font-bold text-[#dc2626]">Does not affect</span> your current VA benefits—only enhances them.</span>
              </motion.li>
            </ul>
          </div>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl p-8 border border-blue-200">

          <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}>

              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8">

                    <div className="flex justify-around items-start text-center mb-8 text-[#1e3a8a] px-4">
            <div className="flex flex-col items-center space-y-1 w-1/3">
              <Award className="w-8 h-8 text-[#dc2626]" />
              <p className="text-sm font-semibold leading-tight mt-1">Veteran Specialists</p>
              <p className="text-xs text-gray-500">Who Understand Your Benefits</p>
            </div>
            <div className="flex flex-col items-center space-y-1 w-1/3">
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
              <p className="text-sm font-semibold leading-tight mt-1">5-Star Rated</p>
              <p className="text-xs text-gray-500">from Veterans Like You</p>
            </div>
            <div className="flex flex-col items-center space-y-1 w-1/3">
              <ShieldCheck className="w-8 h-8 text-[#1e3a8a]" />
              <p className="text-sm font-semibold leading-tight mt-1">100% Secure</p>
              <p className="text-xs text-gray-500">Private Assessment</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ca4a92a4_IMG_5861.png"
              alt="Veteran Benefits Specialist" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-white flex-shrink-0"
/>


            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-[#1e3a8a] font-extrabold">Veteran Health Resource Center
                  </p>
                  <p className="text-xs text-gray-500">Serving Veterans Since 2018</p>
                </div>
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">"We know navigating veteran benefits can be overwhelming. That's why we're here to help you discover every benefit you've earned through your service—with no pressure and complete transparency."</p>
            </div>
          </div>

          

          <div className="text-center mt-6 space-y-3">
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1"><CheckCircle className="w-4 h-4" /><span>100% Free & No Obligation</span></div>
            </div>
            <p className="text-xs text-gray-400">🔒 Your information is secure and will never be shared</p>
            <p className="text-xs text-gray-400">Thank you for your service to our country 🇺🇸</p>
          </div>
        </motion.div>
      </div>
    </div>);

}