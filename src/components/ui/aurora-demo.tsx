"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "./aurora-background";

export function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 py-24"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Transform Ideas into Content
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Effortlessly create social media posts from your ideas.
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-yellow-500 hover:bg-yellow-600 text-zinc-900 px-8 py-3 rounded-lg font-medium text-lg inline-block transition-colors"
        >
          Join the Waitlist
        </motion.button>
      </motion.div>
    </AuroraBackground>
  );
} 