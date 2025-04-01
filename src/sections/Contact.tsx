'use client';
import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg'
import grainImage from '@/assets/images/grain.jpg'
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import contactService from '@/services/contactService';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  
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
      const response = await contactService.submitContactForm(formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage('Failed to send message. Please try again later.');
      console.error('Contact form submission error:', error);
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };
  
  return (
    <section className="py-10 sm:py-12 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1280px]">
        <div className="mb-10 sm:mb-12 md:mb-14 text-center">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">connect</span>
          </motion.h2>
          <motion.p 
            className="mt-4 text-white/70 max-w-xl mx-auto text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Ready to transform your ideas into reality? Let's discuss how we can collaborate to create something amazing together.
          </motion.p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Main contact card with accent border */}
          <motion.div 
            className="rounded-3xl p-1 bg-gradient-to-r from-emerald-400/20 via-sky-400/20 to-emerald-400/20"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gray-900/90 backdrop-blur-lg rounded-[calc(1.5rem-1px)] p-6 sm:p-8 md:p-10 overflow-hidden relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{
                backgroundImage: `url(${grainImage.src})`,
                backgroundSize: 'cover'
              }}></div>
              
              {/* Content container */}
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  {/* Left column - Contact form */}
                  <div className="lg:col-span-7">
                    <h3 className="text-2xl font-serif mb-2 text-white">Get in Touch</h3>
                    <p className="text-white/60 mb-6">Fill out the form and I'll get back to you soon</p>
                    
                    {submitSuccess ? (
                      <motion.div 
                        className="bg-gradient-to-r from-emerald-500/20 to-sky-500/20 rounded-2xl p-8 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 flex items-center justify-center mb-4">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <h4 className="text-xl font-semibold text-white mb-2">Message Sent!</h4>
                          <p className="text-white/70">Thanks for reaching out. I'll get back to you shortly.</p>
                        </div>
                      </motion.div>
                    ) : (
                      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">Name</label>
                          <input 
                            type="text" 
                            id="name" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-transparent text-white transition-all duration-200"
                            placeholder="Your name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-white/80 text-sm font-medium mb-2">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-transparent text-white transition-all duration-200"
                            placeholder="your.email@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-white/80 text-sm font-medium mb-2">Message</label>
                          <textarea 
                            id="message" 
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-transparent text-white resize-none transition-all duration-200"
                            placeholder="Tell me about your project or inquiry..."
                          ></textarea>
                        </div>
                        
                        <motion.button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-emerald-400 to-sky-400 text-gray-900 px-6 py-3 rounded-xl font-semibold 
                            flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 
                            transform transition-all duration-300 hover:-translate-y-1 disabled:opacity-70 group"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending Message...
                            </>
                          ) : (
                            <>
                              Send Message
                              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none">
                                <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </>
                          )}
                        </motion.button>
                        
                        {/* Error message */}
                        {errorMessage && (
                          <motion.div 
                            className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="flex items-start">
                              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 sm:p-6 h-full flex flex-col">
                      <h3 className="text-2xl font-serif mb-5 text-white">Contact Details</h3>
                      
                      <div className="space-y-6 flex-1">
                        {/* Email item */}
                        <motion.div 
                          className="group"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-400/10 to-sky-400/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-white mb-1">Email</h4>
                              <a 
                                href="mailto:contact@zebkhan.dev" 
                                className="text-white/70 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-1 group-hover:underline"
                              >
                                contact@zebkhan.dev
                              </a>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* GitHub item */}
                        <motion.div 
                          className="group"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-400/10 to-sky-400/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-white mb-1">GitHub</h4>
                              <a 
                                href="https://github.com/ZebKhan0620" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-white/70 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-1 group-hover:underline"
                              >
                                github.com/ZebKhan0620
                                <ArrowUpRightIcon className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                              </a>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Location item */}
                        <motion.div 
                          className="group"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-400/10 to-sky-400/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-white mb-1">Location</h4>
                              <p className="text-white/70">Tokyo, Japan</p>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Availability tags */}
                      <motion.div 
                        className="mt-6 pt-6 border-t border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <h4 className="text-lg font-medium text-white mb-3">Available for</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-400/10 to-sky-400/10 rounded-full text-white font-medium text-sm">
                            Full-time Positions
                          </span>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-400/10 to-sky-400/10 rounded-full text-white font-medium text-sm">
                            Full-stack Development
                          </span>
                          <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-400/10 to-sky-400/10 rounded-full text-white font-medium text-sm">
                            Frontend Development
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Quick contact bar */}
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-serif text-white">Ready to start a project?</h3>
              <p className="text-white/70 mt-1 max-w-md text-sm">Let's discuss how I can help bring your vision to life.</p>
            </div>
            <a 
              href="mailto:contact@zebkhan.dev" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-sky-400 text-gray-900 font-semibold shadow-lg hover:shadow-emerald-500/20 transform transition-all duration-300 hover:-translate-y-1 group"
            >
              Email Directly
              <ArrowUpRightIcon className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
