"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This ensures we only render client-specific content after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Send email to the API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      // Check content type before attempting to parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Clone the response before reading its body
        const textResponse = await response.clone().text();
        throw new Error(`Server responded with non-JSON content: ${textResponse}`);
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }
      
      // On success
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(typeof error === 'object' && error !== null && 'message' in error 
        ? (error as Error).message 
        : 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to waitlist section
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Only render the interactive elements once we're on the client
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Navigation */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 flex justify-between items-center z-50 relative"
      >
        <div className="text-2xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.7 8.3c-.9-3.4-4-6-7.7-6-4.4 0-8 3.6-8 8 0 3.7 2.6 6.8 6 7.7m8-8c-.5-1.7-2-3-4-3-2.2 0-4 1.8-4 4 0 1.9 1.3 3.4 3 3.9" />
            <circle cx="12" cy="12" r="1" />
          </svg>
          Levercast
        </div>
        
        {/* Join Waitlist Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToWaitlist}
          className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-yellow-600"
        >
          Join Waitlist
        </motion.button>
      </motion.header>

      {/* Hero Section with Aurora Background */}
      <AuroraBackground containerClassName="min-h-[85vh]">
        <section className="container mx-auto px-4 pt-10 pb-20 flex flex-col md:flex-row items-center min-h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:w-1/2 mb-10 md:mb-0 relative"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transform <span className="text-yellow-400">Ideas</span> into<br/>
              <span className="text-yellow-400">Social Media</span> Content
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Effortlessly capture, format, and share your content across multiple 
              platforms with one click.
            </p>
            
            {isClient && (
              !submitted ? (
                <div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('email-input')?.focus()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 px-8 py-3 rounded-lg font-medium text-lg inline-block transition-colors"
                  >
                    Join the Waitlist
                  </motion.button>
                  
                  <form onSubmit={handleSubmit} className="mt-6 max-w-md">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        id="email-input"
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-4 py-3 rounded-lg bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 focus:border-yellow-400 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 px-6 py-3 rounded-lg transition-colors flex-shrink-0 disabled:opacity-70"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </motion.button>
                    </div>
                    {error && (
                      <div className="mt-3 text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-800/50 backdrop-blur-sm p-6 rounded-lg max-w-md border border-zinc-700/50"
                >
                  <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                  <p className="text-gray-300">
                    You've been added to our waitlist. We'll notify you when Levercast is ready.
                  </p>
                </motion.div>
              )
            )}
            
            {/* Show static content during server rendering or when client hasn't hydrated yet */}
            {!isClient && (
              <div>
                <button
                  className="bg-yellow-500 text-zinc-900 px-8 py-3 rounded-lg font-medium text-lg inline-block"
                >
                  Join the Waitlist
                </button>
              </div>
            )}
          </motion.div>
          
          {/* App UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="md:w-1/2 flex justify-center relative"
          >
            <div className="relative w-full max-w-lg">
              {/* Browser window mockup */}
              <div className="bg-zinc-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-zinc-700/70">
                {/* Browser controls */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-zinc-900">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                
                {/* App interface */}
                <div className="p-5">
                  {/* Raw input area */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-1">Raw Idea Input</div>
                    <div className="bg-zinc-700 p-4 rounded-lg">
                      Just launched our new product! So excited to share it with everyone.
                    </div>
                  </div>
                  
                  {/* Output platforms */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* LinkedIn output */}
                    <div className="bg-zinc-700 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500 mr-2"></div>
                        <div className="text-sm font-medium">LinkedIn</div>
                      </div>
                      <div className="text-xs text-gray-300">
                        I'm thrilled to announce the launch of our innovative new product that addresses [specific pain point]! After months of development and testing, we're confident this solution will transform how you [benefit]. #ProductLaunch #Innovation
                      </div>
                    </div>
                    
                    {/* Twitter output */}
                    <div className="bg-zinc-700 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-5 h-5 rounded-full bg-blue-400 mr-2"></div>
                        <div className="text-sm font-medium">Twitter</div>
                      </div>
                      <div className="text-xs text-gray-300">
                        🚀 Just launched our game-changing product! Solving [pain point] for [target audience]. Check it out here: [link] #NewLaunch #Excited
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </AuroraBackground>

      {/* How Levercast Works Section */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">How Levercast Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-800 p-8 rounded-xl">
              <div className="bg-yellow-500 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Effortless Capture</h3>
              <p className="text-gray-300">
                Quickly dump your raw content ideas and images in one place without worrying about formatting.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-zinc-800 p-8 rounded-xl">
              <div className="bg-yellow-500 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">LLM-Powered Templates</h3>
              <p className="text-gray-300">
                Our AI transforms your content into polished, platform-specific posts that resonate with your audience.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-zinc-800 p-8 rounded-xl">
              <div className="bg-yellow-500 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">One-Click Publishing</h3>
              <p className="text-gray-300">
                Preview your posts exactly as they'll appear, then publish directly to multiple platforms with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Levercast Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Choose Levercast</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Save Time</h3>
                <p className="text-gray-300">
                  Stop formatting the same content multiple times for different platforms.
                </p>
              </div>
            </div>
            
            {/* Benefit 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Increased Engagement</h3>
                <p className="text-gray-300">
                  Platform-specific formatting ensures your content performs optimally everywhere.
                </p>
              </div>
            </div>
            
            {/* Benefit 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Never Lose an Idea</h3>
                <p className="text-gray-300">
                  Capture ideas on the go and let Levercast handle the rest.
                </p>
              </div>
            </div>
            
            {/* Benefit 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Content Management</h3>
                <p className="text-gray-300">
                  Easily manage your posts with a clean dashboard showing drafts and published content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist-section" className="py-20 bg-zinc-950">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Be the First to Know When We Launch</h2>
          <p className="text-gray-300 text-lg mb-10">
            Levercast is coming soon. Join our waitlist to get early access and special perks when we launch.
          </p>
          
          {isClient && (
            !submitted ? (
              <div>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-yellow-400 focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 px-8 py-3 rounded-lg font-medium transition-colors"
                    disabled={loading}
                  >
                    Join Waitlist
                  </button>
                </form>
                <p className="text-gray-400 text-sm">
                  We respect your privacy. No spam, ever.
                </p>
              </div>
            ) : (
              <div className="bg-zinc-800 p-6 rounded-lg">
                <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                <p className="text-gray-300">
                  You've been added to our waitlist. We'll notify you when Levercast is ready.
                </p>
              </div>
            )
          )}
          
          {/* Show static content during server rendering */}
          {!isClient && (
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700">
                Enter your email address
              </div>
              <button
                className="bg-yellow-500 text-zinc-900 px-8 py-3 rounded-lg font-medium"
              >
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-zinc-950 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl font-bold text-white mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.7 8.3c-.9-3.4-4-6-7.7-6-4.4 0-8 3.6-8 8 0 3.7 2.6 6.8 6 7.7m8-8c-.5-1.7-2-3-4-3-2.2 0-4 1.8-4 4 0 1.9 1.3 3.4 3 3.9" />
              <circle cx="12" cy="12" r="1" />
            </svg>
            Levercast
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} Levercast. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
