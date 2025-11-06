"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Ship, 
  Palmtree, 
  Landmark,
  BookOpen,
  Castle,
  Moon,
  Church,
  Factory,
  Triangle,
  Crown,
  Anchor,
  Store,
  Mountain,
  Flame,
  Sun,
  ZoomIn,
  ZoomOut,
  X,
  Navigation,
  Play,
  Pause
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface City {
  name: string;
  x: number; // percentage position
  y: number; // percentage position
  distance: string; // Distance to Mecca
  routeType: string; // Land/Sea/Desert
  pilgrimageNote: string; // Historical note
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

// All cities with routes leading to Mecca (center)
const cities: City[] = [
  // Southeast Asia
  { 
    name: "Jakarta", 
    x: 85, y: 72, 
    distance: "~8,150 km",
    routeType: "Sea Route",
    pilgrimageNote: "Indonesian pilgrims historically traveled by sea through the Indian Ocean, stopping at ports in India and Arabia.",
    icon: Ship, 
    bgColor: "bg-rose-600", 
    iconColor: "text-rose-50"
  },
  { 
    name: "Kuala Lumpur", 
    x: 82, y: 68, 
    distance: "~7,620 km",
    routeType: "Sea Route",
    pilgrimageNote: "Malaysian Hajj caravans sailed through the Strait of Malacca, a vital maritime corridor for centuries.",
    icon: Landmark, 
    bgColor: "bg-red-600", 
    iconColor: "text-red-50"
  },
  
  // South Asia
  { 
    name: "Dhaka", 
    x: 76, y: 58, 
    distance: "~4,560 km",
    routeType: "Sea & Land Route",
    pilgrimageNote: "Bengali pilgrims journeyed via Bengal ports or overland through India and Persia.",
    icon: Factory, 
    bgColor: "bg-violet-600", 
    iconColor: "text-violet-50"
  },
  { 
    name: "Lahore", 
    x: 68, y: 52, 
    distance: "~3,280 km",
    routeType: "Land Route",
    pilgrimageNote: "Pilgrims from the Indian subcontinent traveled the ancient Silk Road through Persia.",
    icon: Crown, 
    bgColor: "bg-purple-600", 
    iconColor: "text-purple-50"
  },
  { 
    name: "Karachi", 
    x: 65, y: 58, 
    distance: "~2,280 km",
    routeType: "Sea & Desert Route",
    pilgrimageNote: "A major embarkation point for South Asian pilgrims crossing the Arabian Sea.",
    icon: Ship, 
    bgColor: "bg-indigo-600", 
    iconColor: "text-indigo-50"
  },
  
  // Central Asia
  { 
    name: "Tashkent", 
    x: 66, y: 38, 
    distance: "~4,130 km",
    routeType: "Silk Road (Land)",
    pilgrimageNote: "Central Asian pilgrims traveled the historic Silk Road through Persia to reach Arabia.",
    icon: Sun, 
    bgColor: "bg-yellow-700", 
    iconColor: "text-yellow-50"
  },
  { 
    name: "Kabul", 
    x: 66, y: 48, 
    distance: "~3,570 km",
    routeType: "Mountain Pass Route",
    pilgrimageNote: "Afghan pilgrims crossed the Hindu Kush and traversed Persia on their spiritual journey.",
    icon: Mountain, 
    bgColor: "bg-fuchsia-600", 
    iconColor: "text-fuchsia-50"
  },
  { 
    name: "Baku", 
    x: 56, y: 40, 
    distance: "~3,290 km",
    routeType: "Caspian Route",
    pilgrimageNote: "Caucasian pilgrims traveled south through Persia along ancient trade corridors.",
    icon: Flame, 
    bgColor: "bg-orange-700", 
    iconColor: "text-orange-50"
  },
  
  // Middle East
  { 
    name: "Tehran", 
    x: 60, y: 48, 
    distance: "~2,140 km",
    routeType: "Persian Route",
    pilgrimageNote: "Persian pilgrims followed ancient caravan routes through the Zagros Mountains.",
    icon: Mountain, 
    bgColor: "bg-pink-600", 
    iconColor: "text-pink-50"
  },
  { 
    name: "Baghdad", 
    x: 54, y: 52, 
    distance: "~1,050 km",
    routeType: "Mesopotamian Route",
    pilgrimageNote: "Baghdad was a major gathering point for pilgrims traveling the Darb Zubaydah.",
    icon: BookOpen, 
    bgColor: "bg-amber-700", 
    iconColor: "text-amber-50"
  },
  { 
    name: "Damascus", 
    x: 49, y: 50, 
    distance: "~1,380 km",
    routeType: "Levantine Route",
    pilgrimageNote: "Syrian pilgrims took the ancient Darb al-Hajj caravan route through the desert.",
    icon: Store, 
    bgColor: "bg-stone-600", 
    iconColor: "text-stone-50"
  },
  { 
    name: "Diyarbakir", 
    x: 52, y: 44, 
    distance: "~1,910 km",
    routeType: "Anatolian Route",
    pilgrimageNote: "Anatolian pilgrims journeyed south through Syria to reach the Hijaz.",
    icon: Castle, 
    bgColor: "bg-red-700", 
    iconColor: "text-red-50"
  },
  { 
    name: "Istanbul", 
    x: 44, y: 41, 
    distance: "~2,430 km",
    routeType: "Ottoman Imperial Route",
    pilgrimageNote: "The Ottoman Sultan's annual pilgrimage caravan was a grand procession.",
    icon: Church, 
    bgColor: "bg-cyan-700", 
    iconColor: "text-cyan-50"
  },
  
  // Arabian Peninsula
  { 
    name: "Medina", 
    x: 48, y: 54, 
    distance: "~340 km",
    routeType: "Sacred Route",
    pilgrimageNote: "The Prophet's city, many pilgrims visit before or after Hajj.",
    icon: Moon, 
    bgColor: "bg-emerald-700", 
    iconColor: "text-emerald-50"
  },
  { 
    name: "Jerusalem", 
    x: 47, y: 51, 
    distance: "~1,240 km",
    routeType: "Holy Land Route",
    pilgrimageNote: "Pilgrims often visited Al-Aqsa Mosque before continuing to Mecca.",
    icon: Church, 
    bgColor: "bg-sky-600", 
    iconColor: "text-sky-50"
  },
  { 
    name: "Sana'a", 
    x: 54, y: 62, 
    distance: "~830 km",
    routeType: "Yemeni Highland Route",
    pilgrimageNote: "Yemeni pilgrims crossed the Arabian highlands, a journey steeped in tradition.",
    icon: Castle, 
    bgColor: "bg-orange-600", 
    iconColor: "text-orange-50"
  },
  
  // North Africa
  { 
    name: "Cairo", 
    x: 44, y: 54, 
    distance: "~1,240 km",
    routeType: "Egyptian Caravan",
    pilgrimageNote: "The Mahmal procession from Cairo was one of the most famous pilgrimage caravans.",
    icon: Triangle, 
    bgColor: "bg-amber-600", 
    iconColor: "text-amber-50"
  },
  { 
    name: "Tripoli", 
    x: 37, y: 49, 
    distance: "~2,490 km",
    routeType: "North African Route",
    pilgrimageNote: "Libyan pilgrims journeyed east through the coastal route or across the Sahara.",
    icon: Anchor, 
    bgColor: "bg-slate-600", 
    iconColor: "text-slate-50"
  },
  { 
    name: "Tunis", 
    x: 33, y: 46, 
    distance: "~3,070 km",
    routeType: "Maghrebi Route",
    pilgrimageNote: "Tunisian pilgrims joined great caravans crossing North Africa.",
    icon: Palmtree, 
    bgColor: "bg-teal-700", 
    iconColor: "text-teal-50"
  },
  { 
    name: "Algiers", 
    x: 28, y: 46, 
    distance: "~3,560 km",
    routeType: "Maghrebi Route",
    pilgrimageNote: "Algerian pilgrims crossed the vast Sahara in organized caravans.",
    icon: Landmark, 
    bgColor: "bg-blue-700", 
    iconColor: "text-blue-50"
  },
  { 
    name: "Fez", 
    x: 24, y: 48, 
    distance: "~4,010 km",
    routeType: "Trans-Saharan Route",
    pilgrimageNote: "Moroccan pilgrims embarked on the arduous trans-Saharan journey.",
    icon: BookOpen, 
    bgColor: "bg-blue-600", 
    iconColor: "text-blue-50"
  },
  
  // Sub-Saharan Africa
  { 
    name: "Timbuktu", 
    x: 26, y: 60, 
    distance: "~4,390 km",
    routeType: "Trans-Saharan Caravan",
    pilgrimageNote: "The legendary trans-Saharan pilgrimage route from West Africa, immortalized by Mansa Musa.",
    icon: BookOpen, 
    bgColor: "bg-yellow-600", 
    iconColor: "text-yellow-50"
  },
  { 
    name: "Kano", 
    x: 32, y: 63, 
    distance: "~3,680 km",
    routeType: "Trans-Saharan Route",
    pilgrimageNote: "Kano was a major staging point for West African Hajj caravans.",
    icon: Castle, 
    bgColor: "bg-lime-600", 
    iconColor: "text-lime-50"
  },
  { 
    name: "Khartoum", 
    x: 46, y: 62, 
    distance: "~1,640 km",
    routeType: "Nile Route",
    pilgrimageNote: "Sudanese pilgrims traveled the Nile route or crossed the Red Sea.",
    icon: Anchor, 
    bgColor: "bg-cyan-600", 
    iconColor: "text-cyan-50"
  },
  { 
    name: "Mogadishu", 
    x: 56, y: 68, 
    distance: "~2,830 km",
    routeType: "East African Sea Route",
    pilgrimageNote: "Somali pilgrims sailed across the Gulf of Aden, connecting Africa to Arabia.",
    icon: Ship, 
    bgColor: "bg-teal-600", 
    iconColor: "text-teal-50"
  },
  { 
    name: "Dar es Salaam", 
    x: 50, y: 72, 
    distance: "~3,840 km",
    routeType: "Swahili Coast Route",
    pilgrimageNote: "East African pilgrims embarked from Swahili ports on dhows bound for Arabia.",
    icon: Palmtree, 
    bgColor: "bg-emerald-600", 
    iconColor: "text-emerald-50"
  },
];

// Mecca position (center of the map)
const MECCA_POSITION = { x: 50, y: 56 };

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
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

  const toggleJourney = () => {
    setJourneyStarted(!journeyStarted);
  };

  return (
    <div 
      className="relative w-full h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/063dddeb-85b0-4ba1-bd6a-66de9af690b5/generated_images/a-detailed-2d-illustrated-fantasy-map-sh-001572b5-20251106070244.jpg"
          alt="Route to Mecca - Pilgrimage Map"
          fill
          className="object-cover opacity-95"
          priority
        />
      </div>

      {/* Ornate Border Frame Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top Left Corner */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-700/40" style={{ borderImage: "linear-gradient(135deg, #92400e, #d97706) 1" }} />
        {/* Top Right Corner */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-700/40" style={{ borderImage: "linear-gradient(225deg, #92400e, #d97706) 1" }} />
        {/* Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-700/40" style={{ borderImage: "linear-gradient(45deg, #92400e, #d97706) 1" }} />
        {/* Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-700/40" style={{ borderImage: "linear-gradient(315deg, #92400e, #d97706) 1" }} />
      </div>

      {/* Compass Rose - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-6 right-6 z-20"
      >
        <div className="relative w-20 h-20 bg-gradient-to-br from-amber-100/90 to-amber-200/90 backdrop-blur-sm rounded-full shadow-2xl border-2 border-amber-700/50 flex items-center justify-center">
          <Navigation className="w-10 h-10 text-amber-800" fill="currentColor" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-900 tracking-widest">N</div>
        </div>
      </motion.div>

      {/* Zoom Controls */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomIn}
          className="bg-amber-100/95 backdrop-blur-md p-3 rounded-lg shadow-xl hover:shadow-2xl hover:bg-amber-200 transition-all border-2 border-amber-700/40"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-amber-900" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomOut}
          className="bg-amber-100/95 backdrop-blur-md p-3 rounded-lg shadow-xl hover:shadow-2xl hover:bg-amber-200 transition-all border-2 border-amber-700/40"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-amber-900" />
        </motion.button>
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
        {/* Mecca (Kaaba) - Central Focus */}
        <motion.div
          className="absolute z-20"
          style={{
            left: `${MECCA_POSITION.x}%`,
            top: `${MECCA_POSITION.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Radial Golden Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-amber-400/60 via-yellow-500/30 to-transparent rounded-full blur-3xl"
            style={{ width: "300px", height: "300px", left: "-150px", top: "-150px" }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Pulsating Light Rays */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-yellow-300/40 to-transparent rounded-full blur-2xl"
            style={{ width: "250px", height: "250px", left: "-125px", top: "-125px" }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Kaaba Icon Container */}
          <motion.div
            className="relative bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-lg p-4 shadow-2xl border-4 border-amber-500"
            animate={{
              boxShadow: [
                "0 0 20px rgba(251, 191, 36, 0.5)",
                "0 0 40px rgba(251, 191, 36, 0.8)",
                "0 0 20px rgba(251, 191, 36, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Moon className="w-12 h-12 text-amber-300" fill="currentColor" />
          </motion.div>

          {/* Mecca Label */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <motion.div
              className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 text-amber-950 px-6 py-2 rounded-lg text-base font-bold shadow-2xl border-3 border-amber-700"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ☪ MECCA (KAABA) ☪
            </motion.div>
          </div>

          {/* Animated Light Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI * 2) / 8) * 80],
                y: [0, Math.sin((i * Math.PI * 2) / 8) * 80],
                opacity: [1, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        {/* Pilgrimage Routes (SVG Lines to Mecca) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 8 }}>
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
            </linearGradient>
            <filter id="routeGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {journeyStarted && cities.map((city, index) => {
            // Calculate curved path to Mecca
            const startX = city.x;
            const startY = city.y;
            const endX = MECCA_POSITION.x;
            const endY = MECCA_POSITION.y;
            
            // Control point for curved path (creates arc effect)
            const controlX = (startX + endX) / 2 + (startY - endY) * 0.15;
            const controlY = (startY + endY) / 2 - (startX - endX) * 0.15;
            
            const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
            
            return (
              <motion.path
                key={city.name}
                d={pathData}
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                fill="none"
                filter="url(#routeGlow)"
                strokeDasharray="10 5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ 
                  duration: 2.5, 
                  delay: index * 0.08,
                  ease: "easeInOut" 
                }}
              />
            );
          })}

          {/* Animated traveling particles along routes */}
          {journeyStarted && cities.map((city, index) => {
            const startX = `${city.x}%`;
            const startY = `${city.y}%`;
            const endX = `${MECCA_POSITION.x}%`;
            const endY = `${MECCA_POSITION.y}%`;
            
            return (
              <motion.circle
                key={`particle-${city.name}`}
                r="3"
                fill="#fbbf24"
                filter="url(#routeGlow)"
                initial={{ cx: startX, cy: startY, opacity: 0 }}
                animate={{ 
                  cx: [startX, endX],
                  cy: [startY, endY],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ 
                  duration: 3.5, 
                  delay: index * 0.1 + 1,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
            );
          })}
        </svg>

        {/* City Markers */}
        {cities.map((city) => {
          const CityIcon = city.icon;
          const isSelected = selectedCity?.name === city.name;
          
          return (
            <motion.div
              key={city.name}
              className="absolute cursor-pointer z-15"
              style={{
                left: `${city.x}%`,
                top: `${city.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onHoverStart={() => !selectedCity && setSelectedCity(city)}
              onClick={() => handleCityClick(city)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + Math.random() * 0.5 }}
            >
              {/* Glow Effect */}
              <motion.div
                className={`absolute inset-0 ${city.bgColor} rounded-full blur-xl opacity-60`}
                animate={{
                  scale: isSelected ? [1, 2, 1] : [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Icon Container */}
              <div className={`relative ${city.bgColor} rounded-full p-2.5 shadow-xl border-2 border-amber-300`}>
                <CityIcon 
                  className={`w-4 h-4 ${city.iconColor} drop-shadow-lg`} 
                  strokeWidth={2.5}
                  fill="currentColor"
                  fillOpacity={0.5}
                />
              </div>

              {/* City Name Label */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none">
                <div className="bg-amber-100/95 backdrop-blur-sm text-amber-950 px-2 py-1 rounded text-xs font-bold shadow-lg border border-amber-700/40">
                  {city.name}
                </div>
              </div>

              {/* Selection Ring */}
              {isSelected && (
                <motion.div
                  className="absolute inset-0 border-2 border-amber-400 rounded-full"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [1, 0, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none"
      >
        <div className="bg-gradient-to-br from-amber-100/98 via-amber-50/98 to-amber-100/98 backdrop-blur-lg px-8 py-4 rounded-2xl shadow-2xl border-3 border-amber-700/50">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 bg-clip-text text-transparent drop-shadow-lg mb-1">
            ☪ Route to Mecca ☪
          </h1>
          <p className="text-sm md:text-base text-amber-900 font-semibold drop-shadow">
            Historic Pilgrimage Routes from Around the World
          </p>
        </div>
      </motion.div>

      {/* Begin Journey Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.button
          onClick={toggleJourney}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-2xl font-bold text-lg transition-all border-3 ${
            journeyStarted 
              ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-800" 
              : "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-700"
          }`}
        >
          {journeyStarted ? (
            <>
              <Pause className="w-6 h-6" fill="currentColor" />
              Pause Journey
            </>
          ) : (
            <>
              <Play className="w-6 h-6" fill="currentColor" />
              Begin the Journey
            </>
          )}
        </motion.button>
      </motion.div>

      {/* City Details Panel */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-24 right-6 w-96 bg-gradient-to-br from-amber-50/98 via-amber-100/98 to-amber-50/98 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-30 border-3 border-amber-700/50"
          >
            {/* Header */}
            <div className={`${selectedCity.bgColor} p-4 text-white relative`}>
              <button
                onClick={() => setSelectedCity(null)}
                className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pr-10">
                {(() => {
                  const Icon = selectedCity.icon;
                  return <Icon className="w-8 h-8 drop-shadow-lg" strokeWidth={2} fill="currentColor" fillOpacity={0.3} />;
                })()}
                <div>
                  <h2 className="text-2xl font-bold drop-shadow-lg">{selectedCity.name}</h2>
                  <p className="text-white/90 text-sm drop-shadow mt-1">{selectedCity.distance} to Mecca</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Route Type
                </h3>
                <p className="text-sm text-amber-950 font-semibold bg-amber-200/50 px-3 py-2 rounded-lg">
                  {selectedCity.routeType}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Historical Note
                </h3>
                <p className="text-sm text-amber-950 leading-relaxed bg-amber-50 px-3 py-3 rounded-lg border border-amber-200">
                  {selectedCity.pilgrimageNote}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}