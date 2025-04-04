'use client';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg'
import grainImage from '@/assets/images/grain.jpg'
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SectionHeader } from '@/components/SectionHeader';

// Types for contact form data
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Types for contact info
interface ContactInfo {
  email: string;
  github: string;
  location: string;
  timezone: string;
  availability: string[];
}

export const ContactSection = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Static contact info - can be moved to a config file later
  const contactInfo: ContactInfo = {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'zebkhan0620@gmail.com',
    github: 'https://github.com/ZebKhan0620',
    location: 'HAL TOKYO College',
    timezone: 'UTC+5',
    availability: [t('contact.info.availability.fullTime'), t('contact.info.availability.fullStack'), t('contact.info.availability.frontend')]
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // if (!response.ok) throw new Error('Failed to submit form');
      
      // Simulate successful submission for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(t('contact.form.errorMessage'));
      console.error('Contact form submission error:', error);
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };
  
  return (
    <section className="py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1280px]">
        <SectionHeader
          title={t('contact.title')}
          eyebrow={t('contact.title')}
          description={t('contact.subtitle')}
        />
        {/* Header Section */}
        <div className="mb-4 xs:mb-6 sm:mb-8 md:mb-10 text-center">
          
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Main contact card with accent border */}
          <motion.div 
            className="rounded-xl xs:rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-r from-emerald-400/20 via-sky-400/20 to-emerald-400/20"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-[calc(1rem-1px)] xs:rounded-[calc(1.5rem-1px)] sm:rounded-[calc(2rem-1px)] p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{
                backgroundImage: `url(${grainImage.src})`,
                backgroundSize: 'cover'
              }}></div>
              
              {/* Content container */}
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
                  {/* Left column - Contact form */}
                  <div className="lg:col-span-7">
                    <h3 className={`text-lg xs:text-xl font-semibold text-white mb-3 sm:mb-4 ${
                      language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-serif)]'
                    }`}>
                      {t('contact.form.title')}
                    </h3>
                    <p className={`text-white/60 mb-3 xs:mb-4 sm:mb-6 text-xs xs:text-sm sm:text-base ${
                      language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                    }`}>
                      {t('contact.form.description')}
                    </p>
                    
                    {submitSuccess ? (
                      <motion.div 
                        className="bg-gradient-to-r from-emerald-500/20 to-sky-500/20 rounded-lg xs:rounded-xl sm:rounded-2xl p-4 xs:p-6 sm:p-8 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 flex items-center justify-center mb-2 xs:mb-3 sm:mb-4">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <h4 className={`text-base xs:text-lg sm:text-xl font-semibold text-white mb-1 xs:mb-2 ${
                            language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                          }`}>
                            {t('contact.form.successTitle')}
                          </h4>
                          <p className="text-white/70 text-xs xs:text-sm sm:text-base">{t('contact.form.successMessage')}</p>
                        </div>
                      </motion.div>
                    ) : (
                      <form ref={formRef} onSubmit={handleSubmit} className="space-y-2 xs:space-y-3 sm:space-y-4">
                        <div>
                          <label htmlFor="name" className={`block text-white/80 text-xs xs:text-sm font-medium mb-1 ${
                            language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                          }`}>
                            {t('contact.form.nameLabel')}
                          </label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 xs:px-4 py-2 bg-white/5 border border-white/10 rounded-lg xs:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-transparent text-white text-xs xs:text-sm sm:text-base transition-all duration-200"
                            placeholder={t('contact.form.namePlaceholder')}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className={`block text-white/80 text-xs xs:text-sm font-medium mb-1 ${
                            language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                          }`}>
                            {t('contact.form.emailLabel')}
                          </label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 xs:px-4 py-2 bg-white/5 border border-white/10 rounded-lg xs:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-transparent text-white text-xs xs:text-sm sm:text-base transition-all duration-200"
                            placeholder={t('contact.form.emailPlaceholder')}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className={`block text-white/80 text-xs xs:text-sm font-medium mb-1 ${
                            language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                          }`}>
                            {t('contact.form.messageLabel')}
                          </label>
                          <textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-3 xs:px-4 py-2 bg-white/5 border border-white/10 rounded-lg xs:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-transparent text-white text-xs xs:text-sm sm:text-base resize-none transition-all duration-200"
                            placeholder={t('contact.form.messagePlaceholder')}
                          ></textarea>
                        </div>
                        
                        <motion.button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-emerald-400 to-sky-400 text-gray-900 px-3 xs:px-4 sm:px-6 py-2 rounded-lg xs:rounded-xl font-semibold 
                            flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 
                            transform transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 group text-xs xs:text-sm sm:text-base"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t('contact.form.submitting')}
                            </>
                          ) : (
                            <>
                              {t('contact.form.submitButton')}
                              <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none">
                                <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </>
                          )}
                        </motion.button>
                        
                        {/* Error message */}
                        {errorMessage && (
                          <motion.div 
                            className="mt-3 xs:mt-4 bg-red-500/10 border border-red-500/30 text-red-400 p-2 xs:p-3 rounded-lg text-xs xs:text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="flex items-start">
                              <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              <span>{errorMessage}</span>
                            </div>
                          </motion.div>
                        )}
                      </form>
                    )}
                  </div>
                  
                  {/* Right column - Contact info */}
                  <div className="lg:col-span-5">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 h-full flex flex-col">
                      <h3 className={`text-lg xs:text-xl font-semibold text-white mb-3 sm:mb-4 ${
                        language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-serif)]'
                      }`}>
                        {t('contact.info.title')}
                      </h3>
                      <p className={`text-white/60 mb-3 xs:mb-4 sm:mb-6 text-xs xs:text-sm sm:text-base ${
                        language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                      }`}>
                        {t('contact.info.description')}
                      </p>
                      
                      <div className="space-y-4 xs:space-y-5 sm:space-y-6 flex-1">
                        {/* Contact Info Cards */}
                        <motion.div 
                          className="grid grid-cols-1 gap-3 xs:gap-4"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {/* Email Card */}
                          <div className="bg-gradient-to-br from-emerald-400/10 to-sky-400/10 rounded-lg p-3 xs:p-4 border border-white/10 hover:border-emerald-400/30 transition-colors duration-300">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg bg-gradient-to-br from-emerald-400/20 to-sky-400/20 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4 xs:w-5 xs:h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h4 className="text-sm xs:text-base font-medium text-white mb-1">{t('contact.info.email')}</h4>
                                <a 
                                  href={`mailto:${contactInfo.email}`}
                                  className="text-white/70 hover:text-emerald-300 transition-colors duration-300 text-xs xs:text-sm"
                                >
                                  {contactInfo.email}
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* GitHub Card */}
                          <div className="bg-gradient-to-br from-emerald-400/10 to-sky-400/10 rounded-lg p-3 xs:p-4 border border-white/10 hover:border-emerald-400/30 transition-colors duration-300">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg bg-gradient-to-br from-emerald-400/20 to-sky-400/20 flex items-center justify-center flex-shrink-0">
                                <Github className="w-4 h-4 xs:w-5 xs:h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h4 className="text-sm xs:text-base font-medium text-white mb-1">{t('contact.info.github')}</h4>
                                <a 
                                  href={contactInfo.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/70 hover:text-emerald-300 transition-colors duration-300 text-xs xs:text-sm flex items-center gap-1"
                                >
                                  {contactInfo.github.split('//')[1]}
                                  <ArrowUpRightIcon className="w-3 h-3 xs:w-4 xs:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Location Card */}
                          <div className="bg-gradient-to-br from-emerald-400/10 to-sky-400/10 rounded-lg p-3 xs:p-4 border border-white/10 hover:border-emerald-400/30 transition-colors duration-300">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-lg bg-gradient-to-br from-emerald-400/20 to-sky-400/20 flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-4 h-4 xs:w-5 xs:h-5 text-emerald-400" />
                              </div>
                              <div>
                                <h4 className="text-sm xs:text-base font-medium text-white mb-1">{t('contact.info.location')}</h4>
                                <div className="space-y-2">
                                  <p className="text-white/70 text-xs xs:text-sm">{contactInfo.location}</p>
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-3 h-3 xs:w-4 xs:h-4 text-emerald-400" />
                                    <span className="text-white/60 text-xs">{contactInfo.timezone}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Availability Section */}
                        <motion.div 
                          className="mt-4 xs:mt-5 sm:mt-6 pt-4 xs:pt-5 sm:pt-6 border-t border-white/10"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 xs:w-5 xs:h-5 text-emerald-400" />
                            <h4 className="text-sm xs:text-base font-medium text-white">{t('contact.info.availableFor')}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {contactInfo.availability.map((status, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gradient-to-r from-emerald-400/10 to-sky-400/10 rounded-full text-white/80 text-xs xs:text-sm border border-white/10"
                              >
                                {status}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Quick contact bar */}
          <motion.div 
            className="mt-4 xs:mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 xs:gap-3 sm:gap-4 p-3 xs:p-4 sm:p-5 rounded-lg xs:rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center sm:text-left">
              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-serif text-white">{t('contact.cta.title')}</h3>
              <p className="text-white/70 mt-1 max-w-md text-[10px] xs:text-xs sm:text-sm">{t('contact.cta.subtitle')}</p>
            </div>
            <a 
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 text-gray-900 font-semibold shadow-lg hover:shadow-emerald-500/20 transform transition-all duration-300 hover:-translate-y-1 group text-xs xs:text-sm sm:text-base"
            >
              {t('contact.cta.button')}
              <ArrowUpRightIcon className="size-2.5 xs:size-3 sm:size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
