import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Shield, CheckCircle, Star, CheckCircle2, Award, ShieldCheck } from 'lucide-react';

import ProgressIndicator from '../components/webinar/ProgressIndicator';
import TimeSelectionStep from '../components/webinar/TimeSelectionStep';
import FirstNameStep from '../components/webinar/FirstNameStep';
import LastNameStep from '../components/webinar/LastNameStep';
import EmailStep from '../components/webinar/EmailStep';
import PhoneStep from '../components/webinar/PhoneStep';
import ConsentStep from '../components/webinar/ConsentStep';
import Turning65Step from '../components/webinar/Turning65Step';
import InsuranceStep from '../components/webinar/InsuranceStep';
import InsuranceCostStep from '../components/webinar/InsuranceCostStep';
import BirthMonthStep from '../components/webinar/BirthMonthStep';
import BirthYearStep from '../components/webinar/BirthYearStep';

export default function MedicareLanding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    webinarTime: '',
    consent: false,
    birthMonth: '',        // New field
    birthYear: '',         // New field
    currentInsurance: '',
    insuranceCost: '', // Added new field
    utm_source: '',
    utm_campaign: ''
  });
  const [pixelEventId, setPixelEventId] = useState('');
  
  // Add dev mode state (defaults to false for safety)
  const [devMode, setDevMode] = useState(false);

  const totalSteps = 11; // Time (0), FirstName (1), LastName (2), Email (3), Phone (4), Consent (5), BirthMonth (6), BirthYear (7), Insurance (8), InsuranceCost (9)

  useEffect(() => {
    // Check for dev mode via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const isDevMode = urlParams.get('dev') === 'true';
    setDevMode(isDevMode);
    
    // Log current mode for clarity
    if (isDevMode) {
      console.log('🧪 DEV MODE ACTIVATED - No webhooks or pixels will fire');
      console.log('To disable dev mode, remove ?dev=true from URL');
    } else {
      console.log('✅ PRODUCTION MODE - Webhooks and pixels will fire normally');
    }

    // Fire PageView pixel event on component mount (only if not dev mode)
    if (typeof window !== 'undefined' && window.fbq && !isDevMode) {
      window.fbq('track', 'PageView');
    } else if (isDevMode) {
      console.log('🧪 DEV MODE: Skipped PageView pixel event');
    }
    
    setFormData((prev) => ({
      ...prev,
      utm_source: urlParams.get('utm_source') || '',
      utm_campaign: urlParams.get('utm_campaign') || ''
    }));
    
    const savedData = localStorage.getItem('webinarFormData');
    if (savedData) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedData) }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('webinarFormData', JSON.stringify(formData));
  }, [formData]);

  const nextStep = async (dataToSave = {}) => {
    const updatedFormData = { ...formData, ...dataToSave };
    setFormData(updatedFormData);

    // Fire FB Pixel events for micro-conversions
    if (typeof window !== 'undefined' && window.fbq) {
      switch (currentStep) {
        case 0: // After selecting time (this step is currentStep 0, so when moving to 1)
          window.fbq('track', 'ViewContent', { content_name: 'Webinar Time Selected' });
          break;
        case 2: // After submitting last name (this step is currentStep 2, so when moving to 3)
          window.fbq('track', 'InitiateCheckout', { content_name: 'Webinar q 2 completed' });
          break;
      }
    }

    setCurrentStep((prev) => prev + 1); 
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleInitialSubmit = async () => {
    setIsSubmitting(true);
    const eventId = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    setPixelEventId(eventId);

    const leadData = { ...formData, consent: true };
    setFormData(leadData);

    try {
      const webhookData = {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        webinarTime: leadData.webinarTime,
        webinarTime_unix: Math.floor(new Date(leadData.webinarTime).getTime() / 1000),
        ...(leadData.utm_source && { utm_source: leadData.utm_source }),
        ...(leadData.utm_campaign && { utm_campaign: leadData.utm_campaign }),
        pixel_event_id: eventId
      };

      if (!devMode) {
        console.log('Sending initial webhook data:', webhookData);
        const response = await fetch('https://hook.us1.make.com/r1kbh1gkk5j31prdnhcn1dq8hsk2gyd9', {
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
        console.log('🧪 DEV MODE: Would send initial webhook:', webhookData);
      }

      // Fire CompleteRegistration pixel event (only if not dev mode)
      if (typeof window !== 'undefined' && window.fbq && !devMode) {
        window.fbq('track', 'CompleteRegistration', {
          content_name: 'Webinar Registration',
          value: 12,
          currency: 'USD'
        }, { eventID: eventId });
      } else if (devMode) {
        console.log('🧪 DEV MODE: Would fire CompleteRegistration pixel event');
      }

      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error('Error on initial submission webhook:', error);
      setCurrentStep((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSubmit = async (finalData) => {
    setIsSubmitting(true);
    const eventId = pixelEventId;
    const fullLeadData = { ...formData, ...finalData };
    setFormData(fullLeadData);

    try {
      const webhookData = {
        ...fullLeadData,
        pixel_event_id: eventId,
        pixel_event_name: 'CompleteRegistration',
        registration_completed_at: new Date().toISOString()
      };

      if (!devMode) {
        console.log('Sending final webhook data (with event_id):', webhookData);
        const response = await fetch('https://hook.us1.make.com/sdv55xk1d8iacpxbhnagymcgrkuf6ju5', {
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
        window.location.href = 'https://go.easykindmedicare.com/confirmation-webinar-7550';
      } else {
        console.log('🧪 DEV MODE: Would send final webhook:', webhookData);
        console.log('🧪 DEV MODE: Form completed! Check console for all collected data.');
        alert('✅ Test completed! Check browser console for data that would be sent.');
      }
    } catch (error) {
      console.error('Error on final submit webhook:', error);
      if (!devMode) {
        localStorage.removeItem('webinarFormData');
        window.location.href = 'https://go.easykindmedicare.com/confirmation-webinar-7550';
      }
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <TimeSelectionStep
          selectedTime={formData.webinarTime}
          onTimeSelect={(time) => nextStep({ webinarTime: time })} />;

      case 1:
        return <FirstNameStep
          formData={formData}
          onNext={(firstName) => nextStep({ firstName })}
          onBack={prevStep} />;

      case 2:
        return <LastNameStep
          formData={formData}
          onNext={(lastName) => nextStep({ lastName })}
          onBack={prevStep} />;

      case 3:
        return <EmailStep
          formData={formData}
          onNext={(email) => nextStep({ email })}
          onBack={prevStep} />;

      case 4:
        return <PhoneStep
          formData={formData}
          onNext={(phone) => nextStep({ phone })}
          onBack={prevStep} />;

      case 5:
        return <ConsentStep
          firstName={formData.firstName}
          onSubmit={handleInitialSubmit}
          onBack={prevStep}
          isSubmitting={isSubmitting} />;

      case 6:
        return <BirthMonthStep
          firstName={formData.firstName}
          selectedMonth={formData.birthMonth}
          onNext={(birthMonth) => nextStep({ birthMonth })}
          onBack={prevStep} />;

      case 7:
        return <BirthYearStep
          firstName={formData.firstName}
          selectedYear={formData.birthYear}
          onNext={(birthYear) => nextStep({ birthYear })}
          onBack={prevStep} />;

      case 8:
        return <InsuranceStep
          firstName={formData.firstName}
          onNext={(currentInsurance) => nextStep({ currentInsurance })}
          onBack={prevStep} />;

      case 9:
        return <InsuranceCostStep
          firstName={formData.firstName}
          onSubmit={(insuranceCost) => handleFinalSubmit({ insuranceCost })}
          onBack={prevStep}
          isSubmitting={isSubmitting} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4 py-8">
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

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FFB400]/10 border border-[#FFB400]/20 mb-4">
            <Calendar className="w-4 h-4 text-[#FFB400] mr-2" />
            <span className="text-sm font-semibold text-[#0D2C4C]">FREE Live Webinar</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0D2C4C] leading-tight mb-3">
            Turning 65? Join Our Private Medicare Session to Discover:
          </h1>
          
          <div className="flex justify-center mt-3 text-base text-gray-700">
            <ul className="space-y-1.5 text-left max-w-lg mx-auto">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start">

                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>How to find the <span className="font-bold text-[#0D2C4C]">best coverage</span> without overpaying.</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start">

                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Ways to <span className="font-bold text-[#0D2C4C]">protect your retirement savings</span> from unexpected medical costs.</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start">

                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>The <span className="font-bold text-[#0D2C4C]">critical enrollment deadlines</span> you can't afford to miss.</span>
              </motion.li>
            </ul>
          </div>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">

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

          <div className="flex justify-around items-start text-center mb-8 text-[#0D2C4C] px-4">
            <div className="flex flex-col items-center space-y-1 w-1/3">
              <Award className="w-8 h-8 text-[#FFB400]" />
              <p className="text-sm font-semibold leading-tight mt-1">Expert Guidance</p>
              <p className="text-xs text-gray-500">by Licensed Agents</p>
            </div>
            <div className="flex flex-col items-center space-y-1 w-1/3">
              <Star className="w-8 h-8 text-yellow-400 fill-current" />
              <p className="text-sm font-semibold leading-tight mt-1">5-Star Rated</p>
              <p className="text-xs text-gray-500">from Real Clients</p>
            </div>
            <div className="flex flex-col items-center space-y-1 w-1/3">
              <ShieldCheck className="w-8 h-8 text-[#FFB400]" />
              <p className="text-sm font-semibold leading-tight mt-1">100% Secure</p>
              <p className="text-xs text-gray-500">Private Registration</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ca4a92a4_IMG_5861.png"
              alt="Anthony Orner" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-white flex-shrink-0"
/>


            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-[#0D2C4C] font-extrabold">Your Host: Anthony Orner
                  </p>
                  <p className="text-xs text-gray-500">Founder of easyKind Medicare</p>
                </div>
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">“We know Medicare is confusing, and the stakes are high. That’s why our promise is simple: we guide every client as if they were our own mother—so you can feel confident you’re getting the right coverage, with no pressure and no surprises.”</p>
            </div>
          </div>

          <div className="text-center mt-6 space-y-3">
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1"><CheckCircle className="w-4 h-4" /><span>100% Free & No Obligation</span></div>
            </div>
            <p className="text-xs text-gray-400">🔒 Your information is secure and will never be shared</p>
          </div>
        </motion.div>
      </div>
    </div>);

}