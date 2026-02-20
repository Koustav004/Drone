import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Drone, 
  MapPin, 
  Activity, 
  Play, 
  ChevronRight, 
  Shield, 
  Cpu, 
  BarChart3,
  Maximize2,
  Info,
  AlertCircle,
  Layers
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import AnalyticsPage from './components/AnalyticsPage';

// Fix for default marker icon in Leaflet
const markerIcon = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href;
const markerShadow = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href;

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Types ---
interface DetectionData {
  id: string;
  image_name: string;
  status: boolean;
  type: string;
  confidence: {
    A: number;
    B: number;
    C: number;
  };
  timestamp: string;
  coordinates: string;
  lat: number;
  lng: number;
}

// --- Components ---

const LandingSection = ({ onNext }: { onNext: () => void }) => (
  <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
    {/* Background Elements */}
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]" />
    </div>

    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="z-10 text-center max-w-4xl"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-6">
        <Drone size={14} />
        Pothole Detection
      </div>
      
      <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6 text-[#141414]">
         <span className="text-blue-600">Drone Acharya</span>
      </h1>
      
      <p className="text-xl text-[#141414]/60 mb-10 max-w-2xl mx-auto leading-relaxed">
        Next-generation AI-powered aerial surveillance for urban road maintenance. 
        Identify, categorize, and map road hazards with millimeter precision.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onNext}
          className="group relative px-8 py-4 bg-[#141414] text-white rounded-full font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            Launch Dashboard <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#141414]/40"
    >
      <span className="text-xs font-medium uppercase tracking-widest">Scroll to Explore</span>
      <div className="w-px h-12 bg-gradient-to-b from-[#141414]/40 to-transparent" />
    </motion.div>
  </section>
);

const DataSection = ({ onNext, detections, selectedDetection, setSelectedDetection }: { 
  onNext: () => void, 
  detections: DetectionData[],
  selectedDetection: DetectionData | null,
  setSelectedDetection: (d: DetectionData) => void
}) => {
  if (!selectedDetection) return null;

  return (
    <section className="min-h-screen py-24 px-6 md:px-12 bg-[#F5F5F3]">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-display font-bold mb-2">Detection Analytics</h2>
            <p className="text-[#141414]/60">Telemetry and classification data from Active Flight 082.</p>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Location List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#141414]/10 overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-gray-50 border-b border-[#141414]/10 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#141414]/40">Location Logs</span>
                  <div className="flex gap-2">
                    <span className="text-[8px] font-bold text-blue-600 uppercase">A: Small</span>
                    <span className="text-[8px] font-bold text-amber-600 uppercase">B: Medium</span>
                    <span className="text-[8px] font-bold text-red-600 uppercase">C: Large</span>
                  </div>
                </div>
                <MapPin size={14} className="text-[#141414]/40" />
              </div>
              <div className="divide-y divide-[#141414]/5 h-[480px] overflow-y-auto custom-scrollbar">
                {detections.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 flex items-center justify-between transition-colors cursor-pointer hover:bg-blue-50/50 ${selectedDetection.id === item.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedDetection(item)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.status ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {item.status ? <AlertCircle size={20} /> : <Shield size={20} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#141414]">{item.id}: "{item.image_name.substring(0, 20)}..."</div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-[#141414]/40 font-mono">{item.coordinates}</div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                            item.type === 'A' ? 'bg-blue-100 text-blue-600' : 
                            item.type === 'B' ? 'bg-amber-100 text-amber-600' : 
                            'bg-red-100 text-red-600'
                          }`}>
                            {item.type === 'A' ? 'Small' : item.type === 'B' ? 'Medium' : 'Large'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                        selectedDetection.id === item.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      Show
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-[#141414]/10 shadow-sm">
                <div className="text-xs font-bold text-[#141414]/40 uppercase tracking-widest mb-2">Detections</div>
                <div className="text-3xl font-display font-bold">{detections.length}</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">+12% from last flight</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#141414]/10 shadow-sm">
                <div className="text-xs font-bold text-[#141414]/40 uppercase tracking-widest mb-2">Confidence</div>
                <div className="text-3xl font-display font-bold">98.2%</div>
                <div className="text-[10px] text-blue-600 font-bold mt-1">AI Model v4.2</div>
              </div>
            </div>
          </div>

          {/* Right Panel: Coordinate Data (JSON View) */}
          <div className="lg:col-span-7">
            <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col">
              <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Coordinate Data</span>
                <Cpu size={14} className="text-white/40" />
              </div>
              <div className="p-8 flex-1 font-mono text-sm leading-relaxed overflow-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedDetection.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <pre className="text-blue-400">
                      {JSON.stringify({
                        image_name: selectedDetection.image_name,
                        status: selectedDetection.status,
                        type: selectedDetection.type,
                        confidence: selectedDetection.confidence,
                        metadata: {
                          timestamp: selectedDetection.timestamp,
                          coords: selectedDetection.coordinates,
                          sensor_id: "LIDAR-X1"
                        }
                      }, null, 2)}
                    </pre>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="p-6 bg-white/5 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Probability Distribution</span>
                  <BarChart3 size={14} className="text-white/40" />
                </div>
                <div className="space-y-4">
                  {Object.entries(selectedDetection.confidence).map(([key, val]) => {
                    const value = val as number;
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-white/60 uppercase">
                          <span>{key === 'A' ? 'Small (Type A)' : key === 'B' ? 'Medium (Type B)' : 'Large (Type C)'}</span>
                          <span>{(value * 100).toFixed(2)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${value * 100}%` }}
                            className={`h-full rounded-full ${key === selectedDetection.type ? 'bg-blue-500' : 'bg-white/20'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const VideoSection = ({ onNext }: { onNext: () => void }) => {
  return (
    <section className="min-h-screen py-24 px-6 md:px-12 bg-[#141414] text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-display font-bold mb-2">Mission Footage</h2>
            <p className="text-white/40">4K HDR Stabilized Feed from Flight 082 - Sector 7G</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <MapPin size={16} />
              View Map
            </button>
          </div>
        </header>

        <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-900 shadow-2xl group">
          {/* Placeholder for Video */}
          <img 
            src="https://picsum.photos/seed/drone/1920/1080" 
            alt="Drone Feed"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          
          {/* HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Altitude</div>
                <div className="text-2xl font-display font-bold">42.5m</div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Speed</div>
                <div className="text-2xl font-display font-bold">18.4 km/h</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 border border-white/20 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin duration-[3s]" />
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pt-2 text-[8px] font-bold text-blue-500">N</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">GPS Lock: Strong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI Link: Active</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Battery</div>
                  <div className="text-xl font-display font-bold text-emerald-500">84%</div>
                </div>
                <div className="w-12 h-6 border border-white/20 rounded-md p-0.5">
                  <div className="h-full w-[84%] bg-emerald-500 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <button className="w-20 h-20 rounded-full bg-white text-[#141414] flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <Play size={32} fill="currentColor" />
            </button>
          </div>
          
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors">
              <Maximize2 size={18} />
            </button>
            <button className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors">
              <Info size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Activity size={24} className="text-blue-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Telemetry Analysis</h3>
            <p className="text-sm text-white/40">Detailed flight path and sensor synchronization data available for export.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <MapPin size={24} className="text-emerald-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Geospatial Mapping</h3>
            <p className="text-sm text-white/40">Automated generation of heatmaps and priority maintenance zones.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Shield size={24} className="text-purple-500 mb-4" />
            <h3 className="text-lg font-bold mb-2">Safety Protocols</h3>
            <p className="text-sm text-white/40">Redundant obstacle avoidance and emergency landing systems active.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = ({ detections, selectedDetection, setSelectedDetection }: { 
  detections: DetectionData[],
  selectedDetection: DetectionData | null,
  setSelectedDetection: (d: DetectionData) => void
}) => {
  const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  const center: [number, number] = selectedDetection 
    ? [selectedDetection.lat, selectedDetection.lng] 
    : [34.0522, -118.2437];

  return (
    <section className="min-h-screen py-24 px-6 md:px-12 bg-[#F5F5F3]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="text-4xl font-display font-bold mb-2">Interactive Mission Map</h2>
          <p className="text-[#141414]/60">Geospatial distribution of all detected road hazards.</p>
        </header>

        <div className="h-[600px] rounded-3xl overflow-hidden border border-[#141414]/10 shadow-2xl relative">
          <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={center} />
            {detections.map((d) => (
              <Marker 
                key={d.id} 
                position={[d.lat, d.lng]}
                eventHandlers={{
                  click: () => setSelectedDetection(d)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <div className="font-bold text-sm mb-1">{d.id}</div>
                    <div className="text-xs text-gray-500 mb-2">{d.coordinates}</div>
                    <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded inline-block ${d.status ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {d.status ? 'Hazard Detected' : 'Clear'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Overlay Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <button className="p-3 bg-white rounded-xl shadow-lg border border-[#141414]/5 hover:bg-gray-50 transition-colors">
              <Layers size={20} className="text-[#141414]" />
            </button>
            <button className="p-3 bg-white rounded-xl shadow-lg border border-[#141414]/5 hover:bg-gray-50 transition-colors">
              <Maximize2 size={20} className="text-[#141414]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

export default function App() {
  const dataRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [detections, setDetections] = useState<DetectionData[]>([]);
  const [selectedDetection, setSelectedDetection] = useState<DetectionData | null>(null);
  const [view, setView] = useState<'dashboard' | 'analytics'>('dashboard');

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        const response = await fetch('/api/detections');
        const data = await response.json();
        setDetections(data);
        if (data.length > 0) {
          setSelectedDetection(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch detections:", error);
      }
    };
    fetchDetections();
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center pointer-events-none">
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-8 pointer-events-auto">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Drone size={18} />
            </div>
            <span>DRONE<span className="text-blue-600">ACHARYA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#141414]/60">
            <button 
              onClick={() => {
                setView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className={`transition-colors ${view === 'dashboard' ? 'text-[#141414] font-bold' : 'hover:text-[#141414]'}`}
            >
              Home
            </button>
            <button 
              onClick={() => {
                if (view !== 'analytics') {
                  setView('analytics');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }} 
              className={`transition-colors ${view === 'analytics' ? 'text-[#141414] font-bold' : 'hover:text-[#141414]'}`}
            >
              Analytics
            </button>
            {view === 'dashboard' && (
              <>
                <button onClick={() => scrollTo(videoRef)} className="hover:text-[#141414] transition-colors">Footage</button>
                <button onClick={() => scrollTo(mapRef)} className="hover:text-[#141414] transition-colors">Map</button>
              </>
            )}
          </div>
          <button className="px-4 py-2 bg-[#141414] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#141414]/90 transition-colors">
            Connect Drone
          </button>
        </div>
      </nav>

      <main>
        {view === 'dashboard' ? (
          <>
            <LandingSection onNext={() => scrollTo(dataRef)} />
            
            <div ref={dataRef}>
              <DataSection 
                onNext={() => scrollTo(videoRef)} 
                detections={detections}
                selectedDetection={selectedDetection}
                setSelectedDetection={setSelectedDetection}
              />
            </div>
            
            <div ref={videoRef}>
              <VideoSection onNext={() => scrollTo(mapRef)} />
            </div>

            <div ref={mapRef}>
              <MapSection 
                detections={detections}
                selectedDetection={selectedDetection}
                setSelectedDetection={setSelectedDetection}
              />
            </div>
          </>
        ) : (
          <AnalyticsPage 
            detections={detections} 
            onBack={() => setView('dashboard')} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] text-white py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-display font-bold text-xl">
            <Drone size={24} className="text-blue-500" />
            <span>DRONE ACHARYA SYSTEMS</span>
          </div>
          <p className="text-white/40 text-sm">© 2026 Drone Acharya Autonomous Infrastructure. All rights reserved.</p>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
