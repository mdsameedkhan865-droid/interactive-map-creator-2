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
      className="relative w-full h-screen bg-[#f5f1e8] overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {/* Minimalist World Map Background */}
      <div className="absolute inset-0 z-0 map-background">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 2000 1000" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Simple world map outlines with thin black strokes */}
          <path 
            d="M 100 100 L 200 80 L 250 90 L 280 100 L 300 120 L 280 140 L 250 150 L 200 145 L 150 140 L 120 130 Z" 
            fill="none" 
            stroke="#2a2a2a" 
            strokeWidth="1.5" 
            opacity="0.6"
          />
          {/* Europe */}
          <path d="M 500 250 Q 520 240 540 250 Q 560 260 570 280 Q 575 300 560 310 Q 540 320 520 310 Q 500 300 490 280 Q 485 260 500 250 Z" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          
          {/* Africa */}
          <path d="M 520 350 L 550 340 Q 580 340 600 360 L 620 400 Q 630 450 620 500 Q 610 550 580 580 Q 550 600 520 590 L 480 570 Q 450 540 440 500 Q 435 450 450 400 Q 470 360 500 350 Z" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          
          {/* Middle East */}
          <path d="M 650 300 L 700 290 Q 730 295 750 310 L 770 340 Q 775 370 760 390 L 730 400 Q 700 405 670 395 L 650 380 Q 640 360 645 330 Z" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          
          {/* Asia */}
          <path d="M 800 200 L 900 180 Q 1000 190 1100 220 L 1200 250 Q 1300 280 1350 320 L 1380 370 Q 1390 420 1370 460 L 1320 490 Q 1250 510 1150 500 L 1000 480 Q 900 460 850 420 L 800 370 Q 780 320 790 270 Z" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          
          {/* Southeast Asia Islands */}
          <ellipse cx="1400" cy="520" rx="60" ry="40" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="1500" cy="550" rx="40" ry="30" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          <ellipse cx="1550" cy="580" rx="35" ry="25" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          
          {/* North America */}
          <path d="M 150 200 L 250 180 Q 350 190 400 220 L 420 260 Q 430 310 410 350 L 370 380 Q 320 390 270 380 L 200 360 Q 150 330 130 280 Z" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          
          {/* South America */}
          <path d="M 350 450 L 400 440 Q 430 445 450 470 L 460 520 Q 465 580 450 630 L 420 670 Q 390 690 360 680 L 330 660 Q 310 630 305 580 Q 300 520 320 470 Z" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
          
          {/* Australia */}
          <ellipse cx="1500" cy="750" rx="120" ry="80" fill="none" stroke="#2a2a2a" strokeWidth="1.5" opacity="0.6" />
        </svg>
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-300"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-300"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </motion.button>
        <div className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-medium text-gray-700 border border-gray-300">
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
                  stroke="#c2703b"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              );
            })}
          </svg>
        )}

        {/* City Markers - Minimalist Style */}
        {cities.map((city) => {
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
                {/* Simple Orange/Golden Circle Marker */}
                <div className="relative bg-[#d97e3f] rounded-full w-3 h-3 border-2 border-white shadow-md" />

                {/* City Name Label */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap">
                  <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-0.5 rounded text-sm font-medium shadow-sm border border-gray-200">
                    {city.name}
                  </div>
                </div>

                {/* Selection Ring */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 border-2 border-[#d97e3f] rounded-full -m-1"
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

      {/* Title Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 z-20 pointer-events-none"
      >
        <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
            Historic Trade Routes
          </h1>
          <p className="text-sm text-gray-600">
            Major cities and their connections
          </p>
        </div>
      </motion.div>

      {/* Details Panel */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden z-30 border border-gray-200 mx-4"
          >
            <div className="flex flex-col">
              {/* Header */}
              <div className="bg-[#d97e3f] p-4 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">{selectedCity.name}</h2>
                  <p className="text-white/90 text-sm">{selectedCity.description}</p>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-1.5 hover:bg-white/20 rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                  Connected Cities ({getConnectedCities(selectedCity).length})
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {getConnectedCities(selectedCity).map((connectedCity) => (
                    <motion.button
                      key={connectedCity.name}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedCity(connectedCity)}
                      className="flex-shrink-0 flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all shadow-sm hover:shadow-md border border-gray-200 min-w-[100px]"
                    >
                      <div className="w-3 h-3 bg-[#d97e3f] rounded-full border-2 border-white shadow-sm" />
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 text-sm">
                          {connectedCity.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {connectedCity.description}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}