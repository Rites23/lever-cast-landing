"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

  // Only render the interactive elements once we're on the client
  return (
    <div className="min-h-screen bg-[#1A1A4B] text-white">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">Levercast</div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-10 pb-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 relative">
          {/* Removing the circle element that was here */}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Transform <span className="text-[#8A8AFF]">Ideas</span> into<br/>
            <span className="text-[#8A8AFF]">Social Media</span> Content
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Effortlessly capture, format, and share your content across multiple 
            platforms with one click.
          </p>
          
          {isClient && (
            !submitted ? (
              <div>
                <button
                  onClick={() => document.getElementById('email-input')?.focus()}
                  className="bg-[#5B5BFF] hover:bg-[#4A4AF0] text-white px-8 py-3 rounded-lg font-medium text-lg inline-block transition-colors"
                >
                  Join the Waitlist
                </button>
                
                <form onSubmit={handleSubmit} className="mt-6 max-w-md">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="email-input"
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 py-3 rounded-lg bg-[#2D2D5B] border border-[#444480] focus:border-[#8A8AFF] focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#5B5BFF] hover:bg-[#4A4AF0] text-white px-6 py-3 rounded-lg transition-colors flex-shrink-0 disabled:opacity-70"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                  {error && (
                    <div className="mt-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="bg-[#2D2D5B]/50 p-6 rounded-lg max-w-md">
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
          
          {/* Show static content during server rendering or when client hasn't hydrated yet */}
          {!isClient && (
            <div>
              <button
                className="bg-[#5B5BFF] text-white px-8 py-3 rounded-lg font-medium text-lg inline-block"
              >
                Join the Waitlist
              </button>
            </div>
          )}
        </div>
        
        {/* App UI Mockup */}
        <div className="md:w-1/2 flex justify-center relative">
          <div className="relative w-full max-w-lg">
            {/* Browser window mockup */}
            <div className="bg-[#1E1E3F] rounded-xl shadow-2xl overflow-hidden border border-[#444480]">
              {/* Browser controls */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0F0F2A]">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              {/* App interface */}
              <div className="p-5">
                {/* Raw input area */}
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-1">Raw Idea Input</div>
                  <div className="bg-[#2D2D5B] p-4 rounded-lg">
                    Just launched our new product! So excited to share it with everyone.
                  </div>
                </div>
                
                {/* Output platforms */}
                <div className="grid grid-cols-2 gap-4">
                  {/* LinkedIn output */}
                  <div className="bg-[#2D2D5B] p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500 mr-2"></div>
                      <div className="text-sm font-medium">LinkedIn</div>
                    </div>
                    <div className="text-xs text-gray-300">
                      I'm thrilled to announce the launch of our innovative new product that addresses [specific pain point]! After months of development and testing, we're confident this solution will transform how you [benefit]. #ProductLaunch #Innovation
                    </div>
                  </div>
                  
                  {/* Twitter output */}
                  <div className="bg-[#2D2D5B] p-4 rounded-lg">
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
        </div>
      </section>

      {/* How Levercast Works Section */}
      <section className="py-20 bg-[#0F0F2A]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">How Levercast Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#232356] p-8 rounded-xl">
              <div className="bg-[#5B5BFF] w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Effortless Capture</h3>
              <p className="text-gray-300">
                Quickly dump your raw content ideas and images in one place without worrying about formatting.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-[#232356] p-8 rounded-xl">
              <div className="bg-[#5B5BFF] w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">LLM-Powered Templates</h3>
              <p className="text-gray-300">
                Our AI transforms your content into polished, platform-specific posts that resonate with your audience.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-[#232356] p-8 rounded-xl">
              <div className="bg-[#5B5BFF] w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-20 bg-[#1A1A4B]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">Why Choose Levercast</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-5xl mx-auto">
            {/* Benefit 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-[#8A8AFF]">
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
              <div className="flex-shrink-0 text-[#8A8AFF]">
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
              <div className="flex-shrink-0 text-[#8A8AFF]">
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
              <div className="flex-shrink-0 text-[#8A8AFF]">
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
      <section className="py-20 bg-[#0F0F2A]">
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
                    className="flex-1 px-4 py-3 rounded-lg bg-[#232356] border border-[#444480] focus:border-[#8A8AFF] focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#5B5BFF] hover:bg-[#4A4AF0] text-white px-8 py-3 rounded-lg font-medium transition-colors"
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
              <div className="bg-[#232356] p-6 rounded-lg">
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
              <div className="flex-1 px-4 py-3 rounded-lg bg-[#232356] border border-[#444480]">
                Enter your email address
              </div>
              <button
                className="bg-[#5B5BFF] text-white px-8 py-3 rounded-lg font-medium"
              >
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#070718] text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl font-bold text-white mb-4">Levercast</div>
          <div className="text-sm">
            © {new Date().getFullYear()} Levercast. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
