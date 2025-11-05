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
      className="relative w-full h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomIn}
          className="bg-white/95 backdrop-blur-md p-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-white transition-all border border-slate-200"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-slate-700" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomOut}
          className="bg-white/95 backdrop-blur-md p-2 rounded-lg shadow-lg hover:shadow-xl hover:bg-white transition-all border border-slate-200"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-slate-700" />
        </motion.button>
        <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg text-xs font-bold text-slate-700 border border-slate-200">
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
        {/* Connection Lines */}
        {selectedCity && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.3" />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
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
                  strokeWidth="4"
                  strokeDasharray="10 5"
                  filter="url(#lineGlow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              );
            })}
          </svg>
        )}

        {/* City Markers */}
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
              {/* City Icon Marker with Enhanced Styling */}
              <motion.div
                className="relative flex items-center gap-2"
                animate={{
                  scale: isSelected ? 1.6 : hoveredCity?.name === city.name ? 1.35 : isConnected ? 1.25 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Outer Glow Ring */}
                <motion.div
                  className={`absolute inset-0 ${city.glowColor} rounded-full blur-xl`}
                  animate={{
                    scale: isSelected ? [1, 2.5, 1] : [1, 2, 1],
                    opacity: isSelected ? [0.8, 0.3, 0.8] : [0.6, 0.1, 0.6],
                  }}
                  transition={{
                    duration: isSelected ? 2 : 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Middle Glow */}
                <motion.div
                  className={`absolute inset-0 ${city.glowColor} rounded-full blur-md opacity-70`}
                  animate={{
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />

                {/* Icon Container with Background */}
                <div className={`relative bg-white rounded-full p-1.5 shadow-lg border ${city.borderColor}`}>
                  <CityIcon 
                    className={`w-4 h-4 ${city.iconColor}`} 
                    strokeWidth={2.5}
                    fill="currentColor"
                    fillOpacity={0.2}
                  />
                </div>

                {/* City Name Label - Always Visible */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gradient-to-r from-amber-900 to-amber-800 text-white px-2 py-0.5 rounded text-xs font-semibold shadow-md border border-amber-700 pointer-events-none">
                  {city.name}
                </div>

                {/* Selection Ring */}
                {isSelected && (
                  <motion.div
                    className={`absolute inset-0 border-2 ${city.borderColor} rounded-full`}
                    initial={{ scale: 1, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.8, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Title Overlay with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 left-4 text-center md:left-auto md:right-4 md:text-right z-20 pointer-events-none"
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent drop-shadow-lg mb-1">
          Ancient Trade Routes
        </h1>
        <p className="text-xs md:text-sm text-slate-800 drop-shadow font-semibold">
          Explore historic cities along the Silk Road and beyond
        </p>
      </motion.div>

      {/* City Details Panel - Compact Bottom Panel */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white/98 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden z-30 border border-slate-200 mx-4"
          >
            <div className="flex flex-col">
              {/* Header */}
              <div className={`${selectedCity.bgColor} p-3 text-white relative flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = selectedCity.icon;
                    return <Icon className="w-5 h-5" strokeWidth={2} />;
                  })()}
                  <div>
                    <h2 className="text-sm font-bold">{selectedCity.name}</h2>
                    <p className="text-white/95 text-xs">{selectedCity.description}</p>
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

              {/* Content - Horizontal Scroll */}
              <div className="p-3">
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <div className="w-0.5 h-3 bg-amber-500 rounded-full" />
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
                        className="flex-shrink-0 flex flex-col items-center gap-1.5 p-2 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-lg transition-all shadow-sm hover:shadow-md border border-slate-200 min-w-[90px]"
                      >
                        <div className={`p-2 ${connectedCity.bgColor} rounded-lg shadow-sm`}>
                          <ConnectedIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-slate-900 text-xs">
                            {connectedCity.name}
                          </div>
                          <div className="text-[10px] text-slate-600 mt-0.5 line-clamp-2">
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