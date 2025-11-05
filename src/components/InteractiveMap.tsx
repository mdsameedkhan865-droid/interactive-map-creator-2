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
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === "DIV") {
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
      className="relative w-full h-screen bg-gradient-to-br from-blue-200 via-green-200 to-emerald-200 overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
      style={{ fontFamily: 'Comic Sans MS, cursive' }}
    >
      {/* Comic-style Border */}
      <div className="absolute inset-0 pointer-events-none border-8 border-black z-50" style={{
        boxShadow: 'inset 0 0 0 4px white, inset 0 0 0 8px black'
      }} />

      {/* Zoom Controls - Comic Style */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleZoomIn}
          className="bg-yellow-400 p-2.5 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all border-3 border-black font-black"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-black" strokeWidth={3} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleZoomOut}
          className="bg-yellow-400 p-2.5 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all border-3 border-black font-black"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-black" strokeWidth={3} />
        </motion.button>
        <div className="bg-white px-2 py-1 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black text-black border-2 border-black">
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
        {/* Simplified Map Background - Green lands and Blue water */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500">
          {/* Land masses with comic-style green */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Simple land representation */}
            <path
              d="M 10 40 Q 20 35, 30 40 L 35 50 Q 40 55, 50 50 L 60 45 Q 70 40, 80 45 L 85 60 Q 80 70, 70 75 L 60 80 Q 50 85, 40 80 L 30 75 Q 20 70, 15 60 Z"
              fill="#22c55e"
              stroke="black"
              strokeWidth="0.5"
              className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
            />
            <path
              d="M 85 30 Q 90 25, 95 30 L 98 40 Q 95 50, 90 48 L 85 45 Z"
              fill="#16a34a"
              stroke="black"
              strokeWidth="0.5"
              className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]"
            />
          </svg>
        </div>

        {/* Connection Lines - Comic Style */}
        {selectedCity && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="black" />
              </marker>
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
                  stroke="black"
                  strokeWidth="3"
                  strokeDasharray="8 4"
                  markerEnd="url(#arrowhead)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </svg>
        )}

        {/* City Markers - Comic Style */}
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
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="relative flex items-center gap-1.5"
                animate={{
                  scale: isSelected ? 1.4 : hoveredCity?.name === city.name ? 1.2 : isConnected ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Icon with comic border */}
                <div className={`relative bg-white rounded-full p-1.5 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                  <CityIcon 
                    className="w-5 h-5 text-black" 
                    strokeWidth={2.5}
                  />
                  {isSelected && (
                    <motion.div
                      className="absolute -inset-1 border-3 border-yellow-400 rounded-full"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [1, 0, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  )}
                </div>

                {/* City Name Label - Small Comic Text */}
                <div className="bg-white px-1.5 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                  <span className="text-[9px] font-black text-black uppercase tracking-tight">
                    {city.name}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Title - Comic Style */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 z-20 pointer-events-none"
      >
        <div className="bg-yellow-300 px-4 py-2 rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-2">
          <h1 className="text-xl font-black text-black uppercase tracking-tight">
            Trade Routes!
          </h1>
        </div>
      </motion.div>

      {/* City Details Panel - Comic Style */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-30 mx-4"
          >
            <div className="flex flex-col">
              {/* Header */}
              <div className="bg-yellow-300 p-3 relative flex items-center justify-between border-b-4 border-black">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = selectedCity.icon;
                    return <Icon className="w-6 h-6 text-black" strokeWidth={2.5} />;
                  })()}
                  <div>
                    <h2 className="text-base font-black text-black uppercase">{selectedCity.name}</h2>
                    <p className="text-[10px] font-bold text-black">{selectedCity.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCity(null)}
                  className="p-1 bg-red-500 hover:bg-red-600 rounded border-2 border-black transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-black" strokeWidth={3} />
                </button>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-[10px] font-black text-black uppercase mb-2">
                  ⚡ Connections ({getConnectedCities(selectedCity).length})
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {getConnectedCities(selectedCity).map((connectedCity) => {
                    const ConnectedIcon = connectedCity.icon;
                    return (
                      <motion.button
                        key={connectedCity.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCity(connectedCity)}
                        className="flex-shrink-0 flex flex-col items-center gap-1 p-2 bg-blue-200 hover:bg-blue-300 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all min-w-[90px]"
                      >
                        <div className="p-1.5 bg-white rounded-lg border-2 border-black">
                          <ConnectedIcon className="w-4 h-4 text-black" strokeWidth={2.5} />
                        </div>
                        <span className="text-[9px] font-black text-black uppercase text-center">
                          {connectedCity.name}
                        </span>
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