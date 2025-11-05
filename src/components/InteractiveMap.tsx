"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Ship, 
  Palmtree, 
  Sailboat, 
  Landmark,
  BookOpen,
  Castle,
  Waves,
  Moon,
  Church,
  Factory,
  Triangle,
  Crown,
  Anchor,
  Store,
  Library,
  Mountain,
  Radio,
  ArrowLeftRight,
  Flame,
  Sun,
  ZoomIn,
  ZoomOut,
  X
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface City {
  name: string;
  x: number; // percentage position
  y: number; // percentage position
  description?: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  glowColor: string;
  connections?: string[]; // Connected city names
}

const cities: City[] = [
  // Southeast Asia
  { name: "Jakarta", x: 88, y: 81, description: "Capital of Indonesia", icon: Ship, bgColor: "bg-rose-600", borderColor: "border-rose-800", iconColor: "text-rose-900", glowColor: "bg-rose-500", connections: ["Kuala Lumpur", "Dhaka"] },
  { name: "Kuala Lumpur", x: 84, y: 73, description: "Capital of Malaysia", icon: Landmark, bgColor: "bg-red-600", borderColor: "border-red-800", iconColor: "text-red-900", glowColor: "bg-red-500", connections: ["Jakarta", "Dhaka", "Karachi"] },
  
  // South Asia
  { name: "Dhaka", x: 77, y: 58, description: "Capital of Bangladesh", icon: Factory, bgColor: "bg-violet-600", borderColor: "border-violet-800", iconColor: "text-violet-900", glowColor: "bg-violet-500", connections: ["Karachi", "Lahore", "Kuala Lumpur"] },
  { name: "Lahore", x: 68, y: 50, description: "Cultural capital of Pakistan", icon: Crown, bgColor: "bg-purple-600", borderColor: "border-purple-800", iconColor: "text-purple-900", glowColor: "bg-purple-500", connections: ["Karachi", "Dhaka", "Kabul", "Tashkent"] },
  { name: "Karachi", x: 64, y: 58, description: "Largest city in Pakistan", icon: Ship, bgColor: "bg-indigo-600", borderColor: "border-indigo-800", iconColor: "text-indigo-900", glowColor: "bg-indigo-500", connections: ["Lahore", "Dhaka", "Sana'a", "Baghdad"] },
  
  // Central Asia
  { name: "Tashkent", x: 66, y: 35, description: "Capital of Uzbekistan", icon: Sun, bgColor: "bg-yellow-700", borderColor: "border-yellow-900", iconColor: "text-yellow-950", glowColor: "bg-yellow-600", connections: ["Baku", "Tehran", "Kabul", "Lahore"] },
  { name: "Kabul", x: 66, y: 44, description: "Capital of Afghanistan", icon: Mountain, bgColor: "bg-fuchsia-600", borderColor: "border-fuchsia-800", iconColor: "text-fuchsia-900", glowColor: "bg-fuchsia-500", connections: ["Tehran", "Lahore", "Tashkent"] },
  { name: "Baku", x: 55, y: 37, description: "Capital of Azerbaijan", icon: Flame, bgColor: "bg-orange-700", borderColor: "border-orange-900", iconColor: "text-orange-950", glowColor: "bg-orange-600", connections: ["Istanbul", "Diyarbakir", "Tehran", "Tashkent"] },
  
  // Middle East
  { name: "Tehran", x: 57, y: 44, description: "Capital of Iran", icon: Mountain, bgColor: "bg-pink-600", borderColor: "border-pink-800", iconColor: "text-pink-900", glowColor: "bg-pink-500", connections: ["Baghdad", "Kabul", "Baku", "Tashkent"] },
  { name: "Baghdad", x: 51, y: 47, description: "Capital of Iraq", icon: Library, bgColor: "bg-amber-700", borderColor: "border-amber-900", iconColor: "text-amber-950", glowColor: "bg-amber-600", connections: ["Damascus", "Tehran", "Karachi", "Diyarbakir"] },
  { name: "Damascus", x: 45, y: 47, description: "Capital of Syria", icon: Store, bgColor: "bg-stone-600", borderColor: "border-stone-800", iconColor: "text-stone-900", glowColor: "bg-stone-500", connections: ["Jerusalem", "Baghdad", "Istanbul", "Medina"] },
  { name: "Diyarbakir", x: 49, y: 40, description: "Historic city in Turkey", icon: Castle, bgColor: "bg-red-700", borderColor: "border-red-900", iconColor: "text-red-950", glowColor: "bg-red-600", connections: ["Istanbul", "Baghdad", "Baku"] },
  { name: "Istanbul", x: 38, y: 37, description: "Transcontinental city", icon: ArrowLeftRight, bgColor: "bg-cyan-700", borderColor: "border-cyan-900", iconColor: "text-cyan-950", glowColor: "bg-cyan-600", connections: ["Tunis", "Damascus", "Diyarbakir", "Baku"] },
  
  // Arabian Peninsula
  { name: "Sana'a", x: 52, y: 62, description: "Capital of Yemen", icon: Castle, bgColor: "bg-orange-600", borderColor: "border-orange-800", iconColor: "text-orange-900", glowColor: "bg-orange-500", connections: ["Mecca", "Mogadishu", "Karachi"] },
  { name: "Mecca", x: 48, y: 57, description: "Holiest city in Islam", icon: Moon, bgColor: "bg-green-600", borderColor: "border-green-800", iconColor: "text-green-900", glowColor: "bg-green-500", connections: ["Medina", "Cairo", "Sana'a", "Jerusalem"] },
  { name: "Medina", x: 47, y: 54, description: "Second holiest city in Islam", icon: Moon, bgColor: "bg-emerald-700", borderColor: "border-emerald-900", iconColor: "text-emerald-950", glowColor: "bg-emerald-600", connections: ["Mecca", "Damascus", "Jerusalem"] },
  { name: "Jerusalem", x: 44, y: 50, description: "Holy city", icon: Church, bgColor: "bg-sky-600", borderColor: "border-sky-800", iconColor: "text-sky-900", glowColor: "bg-sky-500", connections: ["Cairo", "Damascus", "Mecca", "Medina"] },
  
  // North Africa
  { name: "Cairo", x: 40, y: 52, description: "Capital of Egypt", icon: Triangle, bgColor: "bg-amber-600", borderColor: "border-amber-800", iconColor: "text-amber-900", glowColor: "bg-amber-500", connections: ["Jerusalem", "Khartoum", "Tripoli", "Mecca", "Timbuktu"] },
  { name: "Tripoli", x: 33, y: 48, description: "Capital of Libya", icon: Anchor, bgColor: "bg-slate-600", borderColor: "border-slate-800", iconColor: "text-slate-900", glowColor: "bg-slate-500", connections: ["Cairo", "Tunis", "Fez", "Damascus"] },
  { name: "Tunis", x: 29, y: 44, description: "Capital of Tunisia", icon: Palmtree, bgColor: "bg-teal-700", borderColor: "border-teal-900", iconColor: "text-teal-950", glowColor: "bg-teal-600", connections: ["Algiers", "Tripoli", "Istanbul"] },
  { name: "Algiers", x: 21, y: 44, description: "Capital of Algeria", icon: Radio, bgColor: "bg-blue-700", borderColor: "border-blue-900", iconColor: "text-blue-950", glowColor: "bg-blue-600", connections: ["Fez", "Tunis", "Tripoli"] },
  { name: "Fez", x: 16, y: 47, description: "Ancient imperial city of Morocco", icon: BookOpen, bgColor: "bg-blue-600", borderColor: "border-blue-800", iconColor: "text-blue-900", glowColor: "bg-blue-500", connections: ["Algiers", "Timbuktu", "Tripoli"] },
  
  // Sub-Saharan Africa
  { name: "Timbuktu", x: 19, y: 60, description: "Historic city in Mali", icon: BookOpen, bgColor: "bg-yellow-600", borderColor: "border-yellow-800", iconColor: "text-yellow-900", glowColor: "bg-yellow-500", connections: ["Kano", "Fez", "Cairo"] },
  { name: "Kano", x: 26, y: 64, description: "Ancient city in Nigeria", icon: Castle, bgColor: "bg-lime-600", borderColor: "border-lime-800", iconColor: "text-lime-900", glowColor: "bg-lime-500", connections: ["Timbuktu", "Khartoum", "Cairo"] },
  { name: "Khartoum", x: 42, y: 62, description: "Capital of Sudan", icon: Waves, bgColor: "bg-cyan-600", borderColor: "border-cyan-800", iconColor: "text-cyan-900", glowColor: "bg-cyan-500", connections: ["Cairo", "Mogadishu", "Dar es Salaam", "Kano"] },
  { name: "Mogadishu", x: 52, y: 70, description: "Capital of Somalia", icon: Sailboat, bgColor: "bg-teal-600", borderColor: "border-teal-800", iconColor: "text-teal-900", glowColor: "bg-teal-500", connections: ["Dar es Salaam", "Sana'a", "Khartoum"] },
  { name: "Dar es Salaam", x: 48, y: 77, description: "Largest city in Tanzania", icon: Palmtree, bgColor: "bg-emerald-600", borderColor: "border-emerald-800", iconColor: "text-emerald-900", glowColor: "bg-emerald-500", connections: ["Mogadishu", "Khartoum"] },
];

export default function InteractiveMap() {
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('.map-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
  };

  // Get connected cities for drawing lines
  const getConnectedCities = (city: City) => {
    return cities.filter((c) => city.connections?.includes(c.name));
  };

  return (
    <div 
      className="relative w-full h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50 overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {/* Import Cinzel Font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Parchment Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-multiply">
        <svg className="w-full h-full">
          <filter id="parchment">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#8B7355" surfaceScale="1">
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
          </filter>
          <rect width="100%" height="100%" filter="url(#parchment)" />
        </svg>
      </div>

      {/* Decorative Corner Ornaments */}
      <div className="absolute top-4 left-4 z-20 w-16 h-16 pointer-events-none opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-800">
          <path d="M 10 10 Q 10 30 30 30 L 30 10 Z" fill="currentColor" />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
          <path d="M 5 5 L 15 5 L 5 15 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 z-20 w-16 h-16 pointer-events-none opacity-40 transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-800">
          <path d="M 10 10 Q 10 30 30 30 L 30 10 Z" fill="currentColor" />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
          <path d="M 5 5 L 15 5 L 5 15 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-4 left-4 z-20 w-16 h-16 pointer-events-none opacity-40 transform scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-800">
          <path d="M 10 10 Q 10 30 30 30 L 30 10 Z" fill="currentColor" />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
          <path d="M 5 5 L 15 5 L 5 15 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute bottom-4 right-4 z-20 w-16 h-16 pointer-events-none opacity-40 transform scale-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-800">
          <path d="M 10 10 Q 10 30 30 30 L 30 10 Z" fill="currentColor" />
          <circle cx="30" cy="30" r="3" fill="currentColor" />
          <path d="M 5 5 L 15 5 L 5 15 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Fantasy World Map Background */}
      <div className="absolute inset-0 z-0 map-background">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 2000 1000" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Hand-drawn style world map with thicker brown strokes */}
          {/* Europe */}
          <path d="M 500 250 Q 520 240 540 250 Q 560 260 570 280 Q 575 300 560 310 Q 540 320 520 310 Q 500 300 490 280 Q 485 260 500 250 Z" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          
          {/* Africa */}
          <path d="M 520 350 L 550 340 Q 580 340 600 360 L 620 400 Q 630 450 620 500 Q 610 550 580 580 Q 550 600 520 590 L 480 570 Q 450 540 440 500 Q 435 450 450 400 Q 470 360 500 350 Z" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          
          {/* Middle East */}
          <path d="M 650 300 L 700 290 Q 730 295 750 310 L 770 340 Q 775 370 760 390 L 730 400 Q 700 405 670 395 L 650 380 Q 640 360 645 330 Z" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          
          {/* Asia */}
          <path d="M 800 200 L 900 180 Q 1000 190 1100 220 L 1200 250 Q 1300 280 1350 320 L 1380 370 Q 1390 420 1370 460 L 1320 490 Q 1250 510 1150 500 L 1000 480 Q 900 460 850 420 L 800 370 Q 780 320 790 270 Z" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          
          {/* Southeast Asia Islands */}
          <ellipse cx="1400" cy="520" rx="60" ry="40" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          <ellipse cx="1500" cy="550" rx="40" ry="30" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          <ellipse cx="1550" cy="580" rx="35" ry="25" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          
          {/* North America */}
          <path d="M 150 200 L 250 180 Q 350 190 400 220 L 420 260 Q 430 310 410 350 L 370 380 Q 320 390 270 380 L 200 360 Q 150 330 130 280 Z" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          
          {/* South America */}
          <path d="M 350 450 L 400 440 Q 430 445 450 470 L 460 520 Q 465 580 450 630 L 420 670 Q 390 690 360 680 L 330 660 Q 310 630 305 580 Q 300 520 320 470 Z" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
          
          {/* Australia */}
          <ellipse cx="1500" cy="750" rx="120" ry="80" fill="none" stroke="#8B6F47" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />

          {/* Decorative compass rose in corner */}
          <g transform="translate(1850, 850)">
            <circle cx="0" cy="0" r="40" fill="none" stroke="#8B6F47" strokeWidth="2" opacity="0.3" />
            <path d="M 0 -35 L 5 0 L 0 35 L -5 0 Z" fill="#8B6F47" opacity="0.3" />
            <path d="M -35 0 L 0 5 L 35 0 L 0 -5 Z" fill="#8B6F47" opacity="0.25" />
          </g>
        </svg>
      </div>

      {/* Radial vignette effect */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-radial from-transparent via-transparent to-amber-900/20" />

      {/* Zoom Controls - Fantasy Style */}
      <div className="absolute top-24 left-4 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="bg-amber-100 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-amber-700/50"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-amber-900" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="bg-amber-100 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-amber-700/50"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-amber-900" />
        </motion.button>
        <div className="bg-amber-100 px-3 py-1.5 rounded-lg shadow-lg text-sm font-semibold text-amber-900 border-2 border-amber-700/50">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Map Container with Zoom and Pan */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale: zoom,
          x: position.x,
          y: position.y,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        transition={{ type: "tween", duration: 0.1 }}
      >
        {/* Connection Lines - Fantasy Style */}
        {selectedCity && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {getConnectedCities(selectedCity).map((connectedCity) => {
              const x1 = `${selectedCity.x}%`;
              const y1 = `${selectedCity.y}%`;
              const x2 = `${connectedCity.x}%`;
              const y2 = `${connectedCity.y}%`;
              return (
                <g key={`${selectedCity.name}-${connectedCity.name}`}>
                  {/* Glowing background line */}
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#F59E0B"
                    strokeWidth="6"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  {/* Main dashed line */}
                  <motion.line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#92400E"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    exit={{ pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* City Markers - Fantasy Style */}
        {cities.map((city) => {
          const isSelected = selectedCity?.name === city.name;
          const isConnected = selectedCity?.connections?.includes(city.name);
          const Icon = city.icon;
          
          return (
            <motion.div
              key={city.name}
              className="absolute cursor-pointer"
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isSelected ? 15 : isConnected ? 12 : 10,
              }}
              onHoverStart={() => setHoveredCity(city)}
              onHoverEnd={() => setHoveredCity(null)}
              onClick={() => handleCityClick(city)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative flex items-center gap-2"
                animate={{
                  scale: isSelected ? 1.3 : hoveredCity?.name === city.name ? 1.15 : isConnected ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Magical Glow Effect */}
                <div className={`absolute inset-0 ${city.glowColor} rounded-full blur-lg opacity-40 -m-2`} />
                
                {/* Fantasy Icon Container */}
                <div className={`relative ${city.bgColor} rounded-full p-2 border-2 ${city.borderColor} shadow-xl`}>
                  <Icon className={`w-4 h-4 ${city.iconColor}`} strokeWidth={2.5} />
                  
                  {/* Inner glow ring */}
                  <div className={`absolute inset-0 ${city.glowColor} rounded-full opacity-20 animate-pulse`} />
                </div>

                {/* Decorative City Name Label */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap">
                  <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 backdrop-blur-sm text-amber-950 px-3 py-1.5 rounded shadow-lg border-2 border-amber-700/40">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-1 h-1 bg-amber-800 rounded-full" />
                    <div className="absolute top-0 right-0 w-1 h-1 bg-amber-800 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-1 h-1 bg-amber-800 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-amber-800 rounded-full" />
                    
                    <span className="text-sm font-semibold tracking-wide">{city.name}</span>
                  </div>
                </div>

                {/* Selection Ring with Magical Effect */}
                {isSelected && (
                  <>
                    <motion.div
                      className={`absolute inset-0 border-3 ${city.borderColor} rounded-full -m-2`}
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ 
                        scale: [1, 2.2, 1],
                        opacity: [0.8, 0, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                    <motion.div
                      className={`absolute inset-0 ${city.glowColor} rounded-full -m-3 blur-md`}
                      animate={{ 
                        opacity: [0.4, 0.7, 0.4]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Title Overlay - Fantasy Parchment Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-24 z-20 pointer-events-none"
      >
        <div className="relative bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 px-6 py-4 rounded-lg shadow-2xl border-2 border-amber-700/50">
          {/* Decorative corner dots */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-amber-800 rounded-full" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-amber-800 rounded-full" />
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-amber-800 rounded-full" />
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-amber-800 rounded-full" />
          
          <h1 className="text-2xl font-bold text-amber-950 mb-1 tracking-wide">
            Ancient Trade Routes
          </h1>
          <p className="text-sm text-amber-800 font-medium tracking-wide">
            Chronicles of the Merchant Kingdoms
          </p>
        </div>
      </motion.div>

      {/* Details Panel - Fantasy Style */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 rounded-xl shadow-2xl overflow-hidden z-30 border-2 border-amber-700/50 mx-4"
          >
            <div className="flex flex-col">
              {/* Header - Fantasy Style */}
              <div className={`${selectedCity.bgColor} p-5 text-white flex items-center justify-between relative`}>
                {/* Decorative corners */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white/50 rounded-full" />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/50 rounded-full" />
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white/50 rounded-full" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-white/50 rounded-full" />
                
                <div className="flex items-center gap-3">
                  <div className={`${selectedCity.borderColor} border-2 rounded-full p-2 bg-white/10`}>
                    {(() => {
                      const Icon = selectedCity.icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-wide">{selectedCity.name}</h2>
                    <p className="text-white/90 text-sm font-medium">{selectedCity.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-700 rounded-full" />
                  Trade Routes ({getConnectedCities(selectedCity).length})
                  <div className="w-2 h-2 bg-amber-700 rounded-full" />
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {getConnectedCities(selectedCity).map((connectedCity) => {
                    const ConnectedIcon = connectedCity.icon;
                    return (
                      <motion.button
                        key={connectedCity.name}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedCity(connectedCity)}
                        className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 bg-white/60 hover:bg-white/80 rounded-lg transition-all shadow-md hover:shadow-lg border-2 border-amber-700/30 min-w-[110px]`}
                      >
                        <div className={`${connectedCity.bgColor} rounded-full p-2 border-2 ${connectedCity.borderColor} shadow-md`}>
                          <ConnectedIcon className={`w-4 h-4 ${connectedCity.iconColor}`} />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-amber-950 text-sm tracking-wide">
                            {connectedCity.name}
                          </div>
                          <div className="text-xs text-amber-800 mt-1 line-clamp-2 font-medium">
                            {connectedCity.description}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}