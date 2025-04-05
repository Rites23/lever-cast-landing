"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

export const AuroraBackground = ({
  children,
  className,
  containerClassName,
  showRadialGradient = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showRadialGradient?: boolean;
}) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Calculate cursor position relative to the container
        setCursorPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculateGradientPosition = () => {
    if (windowSize.width === 0 || windowSize.height === 0) return "0% 0%";
    const xPercentage = (cursorPosition.x / windowSize.width) * 100;
    const yPercentage = (cursorPosition.y / windowSize.height) * 100;
    return `${xPercentage}% ${yPercentage}%`;
  };

  const gradientPosition = calculateGradientPosition();

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden w-full",
        containerClassName
      )}
    >
      <div 
        className={cn(
          "h-full w-full absolute inset-0 z-0",
          className
        )}
        style={{
          background: 
            `radial-gradient(circle at ${gradientPosition}, 
              rgba(255, 206, 45, 0.1) 0%, 
              rgba(124, 58, 237, 0.1) 25%, 
              rgba(59, 130, 246, 0.1) 50%, 
              rgba(16, 185, 129, 0.05) 75%, 
              transparent 100%)`,
          opacity: 0.8,
        }}
      />
      
      {/* Blurred colored orbs that move with cursor */}
      <div
        className="absolute -left-40 -top-40 h-80 w-80 bg-purple-600 rounded-full filter blur-[100px] opacity-30 animate-blob"
        style={{
          transform: `translate(${cursorPosition.x * 0.05}px, ${cursorPosition.y * 0.05}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
      <div
        className="absolute right-0 top-1/4 h-80 w-80 bg-yellow-400 rounded-full filter blur-[100px] opacity-30 animate-blob animation-delay-2000"
        style={{
          transform: `translate(${-cursorPosition.x * 0.05}px, ${cursorPosition.y * 0.05}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-80 w-80 bg-blue-500 rounded-full filter blur-[100px] opacity-30 animate-blob animation-delay-4000"
        style={{
          transform: `translate(${cursorPosition.x * 0.03}px, ${-cursorPosition.y * 0.03}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
      
      {showRadialGradient && (
        <div className="absolute inset-0 bg-zinc-950 [mask-image:radial-gradient(transparent,white)] opacity-90" />
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 