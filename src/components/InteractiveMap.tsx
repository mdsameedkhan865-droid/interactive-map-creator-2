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
import Image from "next/image";

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
  // Southeast Asia - Adjusted to match map image positions
  { name: "Jakarta", x: 82, y: 78, description: "Capital of Indonesia", icon: Ship, bgColor: "bg-rose-600", borderColor: "border-rose-800", iconColor: "text-rose-900", glowColor: "bg-rose-500", connections: ["Kuala Lumpur", "Dhaka"] },
  { name: "Kuala Lumpur", x: 78, y: 72, description: "Capital of Malaysia", icon: Landmark, bgColor: "bg-red-600", borderColor: "border-red-800", iconColor: "text-red-900", glowColor: "bg-red-500", connections: ["Jakarta", "Dhaka", "Karachi"] },
  
  // South Asia - Adjusted positions
  { name: "Dhaka", x: 73, y: 60, description: "Capital of Bangladesh", icon: Factory, bgColor: "bg-violet-600", borderColor: "border-violet-800", iconColor: "text-violet-900", glowColor: "bg-violet-500", connections: ["Karachi", "Lahore", "Kuala Lumpur"] },
  { name: "Lahore", x: 66, y: 54, description: "Cultural capital of Pakistan", icon: Crown, bgColor: "bg-purple-600", borderColor: "border-purple-800", iconColor: "text-purple-900", glowColor: "bg-purple-500", connections: ["Karachi", "Dhaka", "Kabul", "Tashkent"] },
  { name: "Karachi", x: 62, y: 60, description: "Largest city in Pakistan", icon: Ship, bgColor: "bg-indigo-600", borderColor: "border-indigo-800", iconColor: "text-indigo-900", glowColor: "bg-indigo-500", connections: ["Lahore", "Dhaka", "Sana'a", "Baghdad"] },
  
  // Central Asia - Adjusted for accurate positioning
  { name: "Tashkent", x: 64, y: 40, description: "Capital of Uzbekistan", icon: Sun, bgColor: "bg-yellow-700", borderColor: "border-yellow-900", iconColor: "text-yellow-950", glowColor: "bg-yellow-600", connections: ["Baku", "Tehran", "Kabul", "Lahore"] },
  { name: "Kabul", x: 64, y: 48, description: "Capital of Afghanistan", icon: Mountain, bgColor: "bg-fuchsia-600", borderColor: "border-fuchsia-800", iconColor: "text-fuchsia-900", glowColor: "bg-fuchsia-500", connections: ["Tehran", "Lahore", "Tashkent"] },
  { name: "Baku", x: 54, y: 42, description: "Capital of Azerbaijan", icon: Flame, bgColor: "bg-orange-700", borderColor: "border-orange-900", iconColor: "text-orange-950", glowColor: "bg-orange-600", connections: ["Istanbul", "Diyarbakir", "Tehran", "Tashkent"] },
  
  // Middle East - Realigned to map geography
  { name: "Tehran", x: 58, y: 48, description: "Capital of Iran", icon: Mountain, bgColor: "bg-pink-600", borderColor: "border-pink-800", iconColor: "text-pink-900", glowColor: "bg-pink-500", connections: ["Baghdad", "Kabul", "Baku", "Tashkent"] },
  { name: "Baghdad", x: 52, y: 52, description: "Capital of Iraq", icon: Library, bgColor: "bg-amber-700", borderColor: "border-amber-900", iconColor: "text-amber-950", glowColor: "bg-amber-600", connections: ["Damascus", "Tehran", "Karachi", "Diyarbakir"] },
  { name: "Damascus", x: 47, y: 52, description: "Capital of Syria", icon: Store, bgColor: "bg-stone-600", borderColor: "border-stone-800", iconColor: "text-stone-900", glowColor: "bg-stone-500", connections: ["Jerusalem", "Baghdad", "Istanbul", "Medina"] },
  { name: "Diyarbakir", x: 50, y: 45, description: "Historic city in Turkey", icon: Castle, bgColor: "bg-red-700", borderColor: "border-red-900", iconColor: "text-red-950", glowColor: "bg-red-600", connections: ["Istanbul", "Baghdad", "Baku"] },
  { name: "Istanbul", x: 42, y: 42, description: "Transcontinental city", icon: ArrowLeftRight, bgColor: "bg-cyan-700", borderColor: "border-cyan-900", iconColor: "text-cyan-950", glowColor: "bg-cyan-600", connections: ["Tunis", "Damascus", "Diyarbakir", "Baku"] },
  
  // Arabian Peninsula - Centered around Mecca/Kaaba
  { name: "Sana'a", x: 52, y: 65, description: "Capital of Yemen", icon: Castle, bgColor: "bg-orange-600", borderColor: "border-orange-800", iconColor: "text-orange-900", glowColor: "bg-orange-500", connections: ["Mecca", "Mogadishu", "Karachi"] },
  { name: "Mecca", x: 50, y: 58, description: "Holiest city in Islam", icon: Moon, bgColor: "bg-green-600", borderColor: "border-green-800", iconColor: "text-green-900", glowColor: "bg-green-500", connections: ["Medina", "Cairo", "Sana'a", "Jerusalem"] },
  { name: "Medina", x: 48, y: 55, description: "Second holiest city in Islam", icon: Moon, bgColor: "bg-emerald-700", borderColor: "border-emerald-900", iconColor: "text-emerald-950", glowColor: "bg-emerald-600", connections: ["Mecca", "Damascus", "Jerusalem"] },
  { name: "Jerusalem", x: 46, y: 53, description: "Holy city", icon: Church, bgColor: "bg-sky-600", borderColor: "border-sky-800", iconColor: "text-sky-900", glowColor: "bg-sky-500", connections: ["Cairo", "Damascus", "Mecca", "Medina"] },
  
  // North Africa - Western regions
  { name: "Cairo", x: 43, y: 56, description: "Capital of Egypt", icon: Triangle, bgColor: "bg-amber-600", borderColor: "border-amber-800", iconColor: "text-amber-900", glowColor: "bg-amber-500", connections: ["Jerusalem", "Khartoum", "Tripoli", "Mecca", "Timbuktu"] },
  { name: "Tripoli", x: 36, y: 50, description: "Capital of Libya", icon: Anchor, bgColor: "bg-slate-600", borderColor: "border-slate-800", iconColor: "text-slate-900", glowColor: "bg-slate-500", connections: ["Cairo", "Tunis", "Fez", "Damascus"] },
  { name: "Tunis", x: 32, y: 46, description: "Capital of Tunisia", icon: Palmtree, bgColor: "bg-teal-700", borderColor: "border-teal-900", iconColor: "text-teal-950", glowColor: "bg-teal-600", connections: ["Algiers", "Tripoli", "Istanbul"] },
  { name: "Algiers", x: 26, y: 46, description: "Capital of Algeria", icon: Radio, bgColor: "bg-blue-700", borderColor: "border-blue-900", iconColor: "text-blue-950", glowColor: "bg-blue-600", connections: ["Fez", "Tunis", "Tripoli"] },
  { name: "Fez", x: 22, y: 48, description: "Ancient imperial city of Morocco", icon: BookOpen, bgColor: "bg-blue-600", borderColor: "border-blue-800", iconColor: "text-blue-900", glowColor: "bg-blue-500", connections: ["Algiers", "Timbuktu", "Tripoli"] },
  
  // Sub-Saharan Africa - Southern regions
  { name: "Timbuktu", x: 24, y: 62, description: "Historic city in Mali", icon: BookOpen, bgColor: "bg-yellow-600", borderColor: "border-yellow-800", iconColor: "text-yellow-900", glowColor: "bg-yellow-500", connections: ["Kano", "Fez", "Cairo"] },
  { name: "Kano", x: 30, y: 65, description: "Ancient city in Nigeria", icon: Castle, bgColor: "bg-lime-600", borderColor: "border-lime-800", iconColor: "text-lime-900", glowColor: "bg-lime-500", connections: ["Timbuktu", "Khartoum", "Cairo"] },
  { name: "Khartoum", x: 44, y: 64, description: "Capital of Sudan", icon: Waves, bgColor: "bg-cyan-600", borderColor: "border-cyan-800", iconColor: "text-cyan-900", glowColor: "bg-cyan-500", connections: ["Cairo", "Mogadishu", "Dar es Salaam", "Kano"] },
  { name: "Mogadishu", x: 54, y: 70, description: "Capital of Somalia", icon: Sailboat, bgColor: "bg-teal-600", borderColor: "border-teal-800", iconColor: "text-teal-900", glowColor: "bg-teal-500", connections: ["Dar es Salaam", "Sana'a", "Khartoum"] },
  { name: "Dar es Salaam", x: 50, y: 75, description: "Largest city in Tanzania", icon: Palmtree, bgColor: "bg-emerald-600", borderColor: "border-emerald-800", iconColor: "text-emerald-900", glowColor: "bg-emerald-500", connections: ["Mogadishu", "Khartoum"] },
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
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "IMG") {
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
      className="relative w-full h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {/* Fantasy Map Background with Parchment Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-50/30 via-transparent to-amber-900/20 pointer-events-none z-0" />
      
      {/* Decorative Corner Ornaments */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-800/10 to-transparent rounded-br-full pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-800/10 to-transparent rounded-bl-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-800/10 to-transparent rounded-tr-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-800/10 to-transparent rounded-tl-full pointer-events-none z-0" />

      {/* Map Image Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/New-Design-1762409401350.png?width=8000&height=8000&resize=contain"
          alt="Historical Trade Routes Map"
          fill
          className="object-contain opacity-90"
          priority
        />
      </div>

      {/* Parchment Texture Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20 pointer-events-none z-0" />

      {/* Zoom Controls with Fantasy Styling */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomIn}
          className="bg-amber-50/95 backdrop-blur-md p-2 rounded-lg shadow-xl hover:shadow-2xl hover:bg-amber-100 transition-all border-2 border-amber-800/30"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-amber-900" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomOut}
          className="bg-amber-50/95 backdrop-blur-md p-2 rounded-lg shadow-xl hover:shadow-2xl hover:bg-amber-100 transition-all border-2 border-amber-800/30"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-amber-900" />
        </motion.button>
        <div className="bg-amber-50/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-xl text-xs font-bold text-amber-900 border-2 border-amber-800/30">
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
        {/* Connection Lines with Fantasy Styling */}
        {selectedCity && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#92400e" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#b45309" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#92400e" stopOpacity="0.2" />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {getConnectedCities(selectedCity).map((connectedCity) => {
              const x1 = `${selectedCity.x}%`;
              const y1 = `${selectedCity.y}%`;
              const x2 = `${connectedCity.x}%`;
              const y2 = `${connectedCity.y}%`;
              return (
                <motion.line
                  key={`${selectedCity.name}-${connectedCity.name}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  filter="url(#lineGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              );
            })}
          </svg>
        )}

        {/* City Markers with Fantasy Styling */}
        {cities.map((city) => {
          const CityIcon = city.icon;
          const isSelected = selectedCity?.name === city.name;
          const isConnected = selectedCity?.connections?.includes(city.name);
          
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
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Fantasy-styled City Marker */}
              <motion.div
                className="relative flex items-center gap-2"
                animate={{
                  scale: isSelected ? 1.6 : hoveredCity?.name === city.name ? 1.35 : isConnected ? 1.25 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Magical Glow Effect */}
                <motion.div
                  className={`absolute inset-0 ${city.glowColor} rounded-full blur-2xl`}
                  animate={{
                    scale: isSelected ? [1, 3, 1] : [1, 2.5, 1],
                    opacity: isSelected ? [0.9, 0.4, 0.9] : [0.7, 0.2, 0.7],
                  }}
                  transition={{
                    duration: isSelected ? 2.5 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Inner Glow Pulse */}
                <motion.div
                  className={`absolute inset-0 ${city.glowColor} rounded-full blur-lg opacity-80`}
                  animate={{
                    scale: [1, 1.8, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7,
                  }}
                />

                {/* Fantasy Icon Container with Border */}
                <div className={`relative bg-gradient-to-br from-amber-50 to-amber-100 rounded-full p-2 shadow-2xl border-2 ${city.borderColor} ring-2 ring-amber-900/20`}>
                  <CityIcon 
                    className={`w-5 h-5 ${city.iconColor} drop-shadow-md`} 
                    strokeWidth={2.5}
                    fill="currentColor"
                    fillOpacity={0.3}
                  />
                </div>

                {/* Fantasy-styled Name Label */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap">
                  <div className="relative bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 text-amber-900 px-3 py-1 rounded-md text-xs font-bold shadow-xl border-2 border-amber-800/40 pointer-events-none backdrop-blur-sm">
                    {/* Decorative corners */}
                    <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-amber-800 rounded-full" />
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-800 rounded-full" />
                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-amber-800 rounded-full" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-800 rounded-full" />
                    {city.name}
                  </div>
                </div>

                {/* Magical Selection Ring */}
                {isSelected && (
                  <>
                    <motion.div
                      className={`absolute inset-0 border-3 border-amber-600 rounded-full`}
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ 
                        scale: [1, 2.2, 1],
                        opacity: [1, 0, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                    <motion.div
                      className={`absolute inset-0 border-2 border-amber-400 rounded-full`}
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ 
                        scale: [1, 2.5, 1],
                        opacity: [0.8, 0, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.5
                      }}
                    />
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Fantasy-styled Title Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 left-4 text-center md:left-auto md:right-4 md:text-right z-20 pointer-events-none"
      >
        <div className="inline-block relative bg-gradient-to-br from-amber-100/95 via-amber-50/95 to-amber-100/95 backdrop-blur-md px-6 py-3 rounded-xl shadow-2xl border-2 border-amber-800/40">
          {/* Decorative corners */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-800 rounded-full" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-800 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-800 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-800 rounded-full" />
          
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent drop-shadow-lg mb-1">
            Ancient Trade Routes
          </h1>
          <p className="text-xs md:text-sm text-amber-900 drop-shadow font-semibold">
            Explore historic cities along the Silk Road and beyond
          </p>
        </div>
      </motion.div>

      {/* Fantasy-styled Details Panel */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl bg-gradient-to-br from-amber-50/98 via-amber-100/98 to-amber-50/98 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-30 border-2 border-amber-800/40 mx-4"
          >
            <div className="flex flex-col">
              {/* Decorative header corners */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-amber-800 rounded-full z-10" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-amber-800 rounded-full z-10" />
              
              {/* Header */}
              <div className={`${selectedCity.bgColor} p-3 text-white relative flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = selectedCity.icon;
                    return <Icon className="w-5 h-5 drop-shadow-md" strokeWidth={2} />;
                  })()}
                  <div>
                    <h2 className="text-sm font-bold drop-shadow-md">{selectedCity.name}</h2>
                    <p className="text-white/95 text-xs drop-shadow">{selectedCity.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" />
                  Connected Cities ({getConnectedCities(selectedCity).length})
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {getConnectedCities(selectedCity).map((connectedCity) => {
                    const ConnectedIcon = connectedCity.icon;
                    return (
                      <motion.button
                        key={connectedCity.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCity(connectedCity)}
                        className="flex-shrink-0 flex flex-col items-center gap-1.5 p-2 bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-lg transition-all shadow-lg hover:shadow-xl border-2 border-amber-800/30 min-w-[90px]"
                      >
                        <div className={`p-2 ${connectedCity.bgColor} rounded-lg shadow-md`}>
                          <ConnectedIcon className="w-4 h-4 text-white drop-shadow" strokeWidth={2.5} />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-amber-900 text-xs">
                            {connectedCity.name}
                          </div>
                          <div className="text-[10px] text-amber-800 mt-0.5 line-clamp-2">
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