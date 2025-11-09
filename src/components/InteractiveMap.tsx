"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ZoomIn,
  ZoomOut,
  X,
  Navigation,
  BookOpen,
  Map
} from "lucide-react";
import Image from "next/image";

interface City {
  name: string;
  lat: number;
  lon: number;
}

// Cities with actual geographic coordinates from the HTML
const cities: City[] = [
  { name: "Jakarta", lat: -6, lon: 106.8456 },
  { name: "Dar es Salaam", lat: -6, lon: 39 },
  { name: "Mogadishu", lat: 3.0, lon: 45.0 },
  { name: "Kuala Lumpur", lat: 3.0, lon: 101.6869 },
  { name: "Timbuktu", lat: 16.0, lon: -5.0 },
  { name: "Kano", lat: 16.0, lon: 10.0 },
  { name: "Khartoum", lat: 16.0, lon: 30.0 },
  { name: "Sana'a", lat: 16.0, lon: 45.0 },
  { name: "Mecca", lat: 21.3891, lon: 40.0 },
  { name: "Medina", lat: 24.5247, lon: 39.5692 },
  { name: "Karachi", lat: 24.0, lon: 67.0 },
  { name: "Dhaka", lat: 24.0, lon: 90.4125 },
  { name: "Cairo", lat: 31.0, lon: 30.0 },
  { name: "Jerusalem", lat: 31.0, lon: 36.0 },
  { name: "Lahore", lat: 31.0, lon: 74.3436 },
  { name: "Fez", lat: 33.0, lon: -5.0 },
  { name: "Tripoli", lat: 33.0, lon: 13.1913 },
  { name: "Damascus", lat: 33.5138, lon: 36.2765 },
  { name: "Baghdad", lat: 33.0, lon: 45.0 },
  { name: "Tehran", lat: 33.0, lon: 50.0 },
  { name: "Kabul", lat: 33.0, lon: 67.0 },
  { name: "Algiers", lat: 37.0, lon: 3.0588 },
  { name: "Tunis", lat: 37.0, lon: 10.0 },
  { name: "Diyarbakir", lat: 37.0, lon: 40.0 },
  { name: "Istanbul", lat: 41.0, lon: 30.0 },
  { name: "Baku", lat: 41.0, lon: 50.0 },
  { name: "Tashkent", lat: 41.0, lon: 67.0 }
];

// Route connections from the HTML
const routes = [
  [[-6, 39], [3, 45]],
  [[21.3891, 40], [24.5247, 39.5692]],
  [[21.3891, 40], [33, 45]],
  [[21.3891, 40], [16, 45]],
  [[21.3891, 40], [16, 30]],
  [[24.5247, 39.5692], [31, 36]],
  [[24.5247, 39.5692], [31, 30]],
  [[31, 36], [33.5138, 36.2765]],
  [[31, 36], [31, 30]],
  [[33.5138, 36.2765], [33, 45]],
  [[33.5138, 36.2765], [41, 30]],
  [[33.5138, 36.2765], [37, 40]],
  [[33, 45], [33, 50]],
  [[33, 45], [37, 40]],
  [[31, 30], [41, 30]],
  [[31, 30], [33, 13.1913]],
  [[31, 30], [16, 30]],
  [[41, 30], [41, 50]],
  [[-6.2088, 106.8456], [3, 101.6869]],
  [[24, 67], [33, 50]],
  [[24, 67], [31, 74.3436]],
  [[24, 90.4125], [31, 74.3436]],
  [[24, 90.4125], [3, 101.6869]],
  [[33, 50], [33, 67]],
  [[33, 50], [41, 50]],
  [[31, 74.3436], [33, 67]],
  [[33, -5], [37, 3.0588]],
  [[33, -5], [16, -5]],
  [[41, 67], [33, 67]],
  [[16, 45], [3, 45]],
  [[33, 13.1913], [37, 10]],
  [[37, 3.0588], [37, 10]],
  [[16, -5], [16, 10]],
  [[16, 30], [3, 45]],
  [[16, 30], [16, 10]],
  [[37, 40], [41, 30]],
  [[37, 40], [41, 50]]
];

// Convert lat/lon to percentage position on map
function latLonToPercent(lat: number, lon: number) {
  // Map bounds approximation for the region
  const minLat = -10;
  const maxLat = 45;
  const minLon = -10;
  const maxLon = 110;
  
  const x = ((lon - minLon) / (maxLon - minLon)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  
  return { x, y };
}

export default function InteractiveMap() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
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

  // Helper function to draw railway track between two points
  const drawRailwayTrack = (start: {x: number, y: number}, end: {x: number, y: number}, index: number) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    // Calculate perpendicular offset for parallel rails
    const railOffset = 0.15; // Distance between rails in percentage
    const perpX = -Math.sin(angle) * railOffset;
    const perpY = Math.cos(angle) * railOffset;
    
    // Rail 1 (left rail)
    const rail1Start = { x: start.x + perpX, y: start.y + perpY };
    const rail1End = { x: end.x + perpX, y: end.y + perpY };
    
    // Rail 2 (right rail)
    const rail2Start = { x: start.x - perpX, y: start.y - perpY };
    const rail2End = { x: end.x - perpX, y: end.y - perpY };
    
    // Calculate number of ties based on route length
    const tieCount = Math.max(3, Math.floor(length / 2));
    const ties = [];
    
    for (let i = 0; i <= tieCount; i++) {
      const t = i / tieCount;
      const tieX = start.x + dx * t;
      const tieY = start.y + dy * t;
      
      ties.push({
        x1: tieX + perpX * 1.5,
        y1: tieY + perpY * 1.5,
        x2: tieX - perpX * 1.5,
        y2: tieY - perpY * 1.5,
      });
    }
    
    return (
      <g key={index}>
        {/* Left Rail */}
        <motion.line
          x1={`${rail1Start.x}%`}
          y1={`${rail1Start.y}%`}
          x2={`${rail1End.x}%`}
          y2={`${rail1End.y}%`}
          stroke="#6b4423"
          strokeWidth="2.5"
          strokeOpacity="0.9"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          exit={{ pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: index * 0.02 }}
        />
        
        {/* Right Rail */}
        <motion.line
          x1={`${rail2Start.x}%`}
          y1={`${rail2Start.y}%`}
          x2={`${rail2End.x}%`}
          y2={`${rail2End.y}%`}
          stroke="#6b4423"
          strokeWidth="2.5"
          strokeOpacity="0.9"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          exit={{ pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: index * 0.02 }}
        />
        
        {/* Railroad Ties (Sleepers) */}
        {ties.map((tie, tieIndex) => (
          <motion.line
            key={tieIndex}
            x1={`${tie.x1}%`}
            y1={`${tie.y1}%`}
            x2={`${tie.x2}%`}
            y2={`${tie.y2}%`}
            stroke="#8b6f47"
            strokeWidth="2"
            strokeOpacity="0.75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: index * 0.02 + tieIndex * 0.02 }}
          />
        ))}
      </g>
    );
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
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Generated-Image-November-09-2025-10_10PM-1762708312524.png?width=8000&height=8000&resize=contain"
          alt="Route to Mecca - Pilgrimage Map"
          fill
          className="object-cover opacity-95"
          priority
        />
      </div>

      {/* Ornate Border Frame Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-700/40" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-amber-700/40" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-amber-700/40" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-700/40" />
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
        {/* Ancient Routes Overlay */}
        <AnimatePresence>
          {showRoutes && (
            <>
              {/* Railway Track Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
                {routes.map((route, index) => {
                  const start = latLonToPercent(route[0][0], route[0][1]);
                  const end = latLonToPercent(route[1][0], route[1][1]);
                  
                  return drawRailwayTrack(start, end, index);
                })}
              </svg>

              {/* City Dots and Labels */}
              {cities.map((city, index) => {
                const pos = latLonToPercent(city.lat, city.lon);
                const isSelected = selectedCity?.name === city.name;
                
                return (
                  <motion.div
                    key={city.name}
                    className="absolute z-16"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: 0.3 + index * 0.02, duration: 0.3 }}
                  >
                    {/* Dot */}
                    <motion.div
                      className={`w-[18px] h-[18px] rounded-full bg-[#f3d36b] border-2 border-[#5b3a29] shadow-lg cursor-pointer ${
                        isSelected ? 'ring-4 ring-amber-400' : ''
                      }`}
                      whileHover={{ scale: 1.3 }}
                      onClick={() => setSelectedCity(city)}
                    />
                    
                    {/* Label */}
                    <div 
                      className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
                      style={{
                        textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
                      }}
                    >
                      <span className="text-xs font-semibold text-[#111]">
                        {city.name}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Show Ancient Routes Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.button
          onClick={() => setShowRoutes(!showRoutes)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl shadow-2xl font-bold text-lg transition-all border-3 ${
            showRoutes 
              ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-800" 
              : "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-700"
          }`}
        >
          <Map className="w-6 h-6" />
          {showRoutes ? "Hide Ancient Routes" : "Show Ancient Routes"}
        </motion.button>
      </motion.div>

      {/* City Details Panel */}
      <AnimatePresence>
        {selectedCity && showRoutes && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-24 right-6 w-80 bg-gradient-to-br from-amber-50/98 via-amber-100/98 to-amber-50/98 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-30 border-3 border-amber-700/50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-700 to-amber-800 p-4 text-white relative">
              <button
                onClick={() => setSelectedCity(null)}
                className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pr-10">
                <BookOpen className="w-6 h-6" />
                <h2 className="text-xl font-bold">{selectedCity.name}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="text-sm text-amber-950 leading-relaxed bg-amber-50 px-3 py-3 rounded-lg border border-amber-200">
                <div className="mb-2">
                  <span className="font-bold">Coordinates:</span>
                  <br />
                  Lat: {selectedCity.lat}°, Lon: {selectedCity.lon}°
                </div>
                <p className="text-xs text-amber-800">
                  Click on other cities to explore their locations along the ancient pilgrimage routes.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}