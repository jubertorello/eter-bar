
import React from 'react';
import { 
  Music, 
  Wine, 
  Clock, 
  Wifi, 
  ChevronDown,
  Zap,
  GlassWater,
  MapPin,
  ExternalLink,
  PartyPopper,
  MessageSquare,
  Instagram
} from 'lucide-react';
import { MENU_ITEMS, OPENING_HOURS, PROMOS, WIFI_DATA, LOCATION_DATA, CONTACT_DATA } from './constants';

const App: React.FC = () => {
  const categories = ['COPAS/VASOS', 'JARRAS', 'CERVEZAS', 'VINOS', 'OTROS'] as const;

  return (
    <div className="min-h-screen bg-nebula text-white selection:bg-red-600 selection:text-white">
      {/* Background stars effect */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2}px`,
              height: `${Math.random() * 2}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <header className="relative h-[90vh] flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="mb-6 animate-in fade-in duration-1000">
          <h1 className="font-syncopate text-7xl md:text-9xl font-bold tracking-tighter text-red-600 text-neon-red uppercase">
            ETER bar
          </h1>
        </div>
        
        <p className="text-lg md:text-2xl font-light tracking-[0.4em] uppercase max-w-2xl animate-in slide-in-from-bottom duration-1000 text-gray-300">
          "aquí solo tragos y buena música"
        </p>

        <div className="absolute bottom-10 animate-bounce cursor-pointer" onClick={() => document.getElementById('promo')?.scrollIntoView({ behavior: 'smooth' })}>
          <ChevronDown className="w-8 h-8 text-red-600" />
        </div>
      </header>

      {/* Promotion Highlight Section */}
      <section id="promo" className="py-20 px-4 bg-black/60 backdrop-blur-md z-10 relative border-y border-red-900/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="font-syncopate text-xl md:text-2xl font-bold tracking-[0.5em] text-red-600 uppercase">Promos Imperdibles</h2>
          </div>
          
          <div className={`grid grid-cols-1 ${PROMOS.length > 1 ? 'lg:grid-cols-2' : ''} gap-8`}>
            {PROMOS.map((promo, index) => (
              <div key={index} className="border-2 border-red-600 border-neon-red p-8 md:p-12 text-center rounded-sm bg-gradient-to-br from-red-950/20 to-black relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-24 h-24 text-red-600" />
                </div>
                
                <h3 className="font-syncopate text-xl md:text-2xl font-bold mb-4 text-white tracking-widest relative z-10">
                  {promo.title}
                </h3>
                <p className="text-4xl md:text-6xl font-black text-red-600 mb-8 font-syncopate drop-shadow-[0_0_15px_rgba(255,0,0,0.5)] relative z-10 uppercase leading-tight">
                  {promo.description}
                </p>
                <div className="inline-block px-8 py-3 border-2 border-red-600 text-red-600 font-bold text-lg rounded-none uppercase tracking-widest relative z-10">
                  {promo.day}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-4 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-2 mb-20 text-center">
            <Wine className="text-red-600 w-10 h-10 mb-4" />
            <h2 className="font-syncopate text-5xl font-bold tracking-tight mb-2 uppercase">Menú de Tragos</h2>
            <p className="text-gray-400 font-mono tracking-[0.3em] text-sm uppercase mb-4 opacity-80">Pedir en barra</p>
            <div className="h-1 w-24 bg-red-600"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-16">
            {categories.map((cat) => (
              <div key={cat} className="space-y-10">
                <div className="flex items-center gap-4 border-l-4 border-red-600 pl-4">
                  <h3 className="text-white font-syncopate text-2xl font-bold uppercase tracking-wider">
                    {cat}
                  </h3>
                </div>
                <div className="space-y-8">
                  {MENU_ITEMS.filter(item => item.category === cat).map((item) => (
                    <div key={item.id} className="group relative">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xl font-bold tracking-wide uppercase group-hover:text-red-500 transition-colors duration-300">
                          {item.name}
                        </span>
                        <div className="flex-grow mx-4 border-b border-white/10 border-dotted mb-1.5"></div>
                        <span className="text-red-600 font-syncopate font-bold text-lg">{item.price}</span>
                      </div>
                      <p className="text-gray-500 text-sm font-medium leading-relaxed uppercase tracking-tighter">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events & Rental Section */}
      <section id="eventos" className="py-24 px-4 bg-gradient-to-b from-black to-[#1a0000] z-10 relative border-y border-red-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <PartyPopper className="text-red-600 w-8 h-8" />
                <h2 className="font-syncopate text-3xl md:text-4xl font-bold uppercase tracking-tighter">Tu evento en ETER</h2>
              </div>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                ¿Buscás un lugar exclusivo para tu próximo festejo? Alquilamos nuestro local para <span className="text-red-600 font-bold uppercase">cumpleaños, fiestas privadas, eventos corporativos</span> y celebraciones especiales.
              </p>
              <ul className="space-y-4 text-gray-400 font-medium uppercase tracking-widest text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  Ambiente climatizado y sonido profesional
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  Barra de tragos exclusiva
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  Capacidad adaptable a tu evento
                </li>
              </ul>
              <div className="pt-6">
                <a 
                  href={CONTACT_DATA.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-black font-black uppercase tracking-widest rounded-none hover:bg-white transition-all transform hover:-translate-y-1 group"
                >
                  <MessageSquare className="w-5 h-5" />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-red-600 opacity-20 group-hover:opacity-10 transition-opacity"></div>
              <div className="border-2 border-red-900 p-2">
                <div className="bg-[#050000] p-12 aspect-square flex flex-col items-center justify-center text-center space-y-6">
                   <h3 className="font-syncopate text-6xl md:text-8xl font-bold opacity-10 select-none">EVENTOS</h3>
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      <span className="text-red-600 text-xs font-black tracking-[0.5em] uppercase mb-2">Exclusividad</span>
                      <span className="text-2xl md:text-4xl font-bold uppercase tracking-tighter text-white">Momentos Infinitos</span>
                   </div>
                </div>
              </div>
              {/* Decorative corner elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-red-600"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-red-600"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Info, Schedule & Location Grid */}
      <section className="py-32 px-4 bg-black/80 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Opening Hours */}
          <div className="space-y-8 p-8 border border-white/5 bg-gradient-to-b from-white/5 to-transparent rounded-sm hover:border-red-600/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="text-red-600 w-7 h-7" />
              <h3 className="font-syncopate text-xl font-bold uppercase tracking-tighter">Horarios</h3>
            </div>
            <div className="space-y-6">
              {OPENING_HOURS.map((h, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-3">
                  <span className="text-red-600 font-bold text-sm tracking-widest">{h.day}</span>
                  <span className="text-xl font-light text-white">{h.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Social */}
          <div className="space-y-8 p-8 border border-white/5 bg-gradient-to-b from-white/5 to-transparent rounded-sm hover:border-red-600/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <MapPin className="text-red-600 w-7 h-7" />
              <h3 className="font-syncopate text-xl font-bold uppercase tracking-tighter">Ubicación</h3>
            </div>
            <div className="space-y-6">
              <p className="text-white text-lg leading-relaxed font-light">
                {LOCATION_DATA.address}
              </p>
              <div className="flex flex-col gap-4">
                <a 
                  href={LOCATION_DATA.mapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-400 font-bold uppercase tracking-widest text-sm transition-colors group"
                >
                  Ver en Google Maps
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <a 
                  href={CONTACT_DATA.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:text-red-600 font-bold uppercase tracking-widest text-sm transition-colors group"
                >
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Síguenos en Instagram
                </a>
              </div>
            </div>
          </div>

          {/* WiFi Data */}
          <div className="space-y-8 p-8 border border-white/5 bg-gradient-to-b from-white/5 to-transparent rounded-sm hover:border-red-600/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <Wifi className="text-red-600 w-7 h-7" />
              <h3 className="font-syncopate text-xl font-bold uppercase tracking-tighter">Conexión</h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-red-600 text-xs font-bold tracking-[0.3em] mb-2 uppercase">Red Wifi</p>
                <p className="text-xl font-mono text-white tracking-tight break-all">{WIFI_DATA.ssid}</p>
              </div>
              <div>
                <p className="text-red-600 text-xs font-bold tracking-[0.3em] mb-2 uppercase">Contraseña</p>
                <p className="text-xl font-mono text-white tracking-tight break-all">{WIFI_DATA.pass}</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-8 p-8 border border-white/5 bg-gradient-to-b from-white/5 to-transparent rounded-sm hover:border-red-600/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <GlassWater className="text-red-600 w-7 h-7" />
              <h3 className="font-syncopate text-xl font-bold uppercase tracking-tighter">Vibe</h3>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed italic font-light">
              "En ETER no solo servimos tragos. Creamos el espacio perfecto donde el sonido del hielo y el ritmo de la música se funden en una experiencia infinita."
            </p>
            <div className="flex gap-4 items-center">
               <Music className="text-red-600 animate-bounce" />
               <span className="text-sm uppercase tracking-widest font-bold">Good Music Only</span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5 text-center z-10 relative bg-black">
        <div className="mb-12">
            <span className="font-syncopate text-5xl font-bold text-red-600 text-neon-red">ETER</span>
            <p className="mt-4 text-gray-500 uppercase tracking-[0.5em] text-xs font-bold">Aquí solo tragos y buena música</p>
        </div>

        <div className="space-y-4">
            <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
            © 2026 ETER BAR 
            </p>
            <p className="text-gray-800 text-[8px] uppercase tracking-widest px-4">
                Beber con moderación. Prohibida la venta a menores de 18 años.
            </p>
            <p className="text-gray-900 text-[9px] uppercase tracking-widest mt-2">
                {LOCATION_DATA.address}
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
