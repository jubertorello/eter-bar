import React, { useState, useEffect } from 'react';
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
  Instagram,
  Camera,
  X,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { OPENING_HOURS, WIFI_DATA, LOCATION_DATA, CONTACT_DATA } from '../../constants';
import { useAppContext } from '../context/AppContext';
import { DrinkItem } from '../../types';

const LandingPage: React.FC = () => {
  const { state } = useAppContext();
  const { menuItems, promos, categories, gallery } = state;
  const [selectedImage, setSelectedImage] = useState<DrinkItem | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  useEffect(() => {
    if (gallery.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [gallery.length]);

  const handleNextGalleryImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedGalleryImage) return;
    const currentIndex = gallery.findIndex(img => img.url === selectedGalleryImage);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % gallery.length;
      setSelectedGalleryImage(gallery[nextIndex].url);
    }
  };

  const handlePrevGalleryImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedGalleryImage) return;
    const currentIndex = gallery.findIndex(img => img.url === selectedGalleryImage);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
      setSelectedGalleryImage(gallery[prevIndex].url);
    }
  };

  return (
    <div className="min-h-screen bg-nebula text-white selection:bg-red-600 selection:text-white">

      {/* Lightbox Modal */}
      {selectedImage && selectedImage.image && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 animate-in fade-in">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-3xl w-full flex flex-col items-center">
            <img 
              src={selectedImage.image} 
              alt={selectedImage.name} 
              className="max-h-[70vh] w-auto object-contain rounded-sm border border-white/10 mb-6 shadow-2xl"
            />
            <div className="text-center">
              <h3 className="font-syncopate text-3xl font-bold uppercase tracking-widest text-red-500 mb-2">
                {selectedImage.name}
              </h3>
              <p className="text-xl font-bold text-white mb-2">{selectedImage.price}</p>
              <p className="text-gray-400 uppercase tracking-widest text-sm max-w-lg mx-auto">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}

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
      <header className="relative h-[90vh] flex flex-col items-center justify-end text-center px-4 z-10 overflow-hidden pb-10 bg-black">
        
        {/* Background Video */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain md:object-cover"
          >
            <source src="https://res.cloudinary.com/djqtkbyez/video/upload/v1783014037/PixVerse_V6_Image_Text_360P_que_las_letras_apa_zzlhxz.mp4" type="video/mp4" />
          </video>
          {/* Gradiente para transición suave hacia el contenido inferior */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
        </div>

        <div 
          className="relative z-10 flex flex-col items-center gap-3 cursor-pointer group mb-4" 
          onClick={() => document.getElementById('promo')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <p className="text-xs md:text-sm font-light tracking-[0.3em] uppercase text-gray-300 group-hover:text-white transition-colors text-center">
            Desliza para ver más
          </p>
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </header>

      {/* Promotion Highlight Section */}
      {promos.length > 0 && (
        <section id="promo" className="py-12 px-4 bg-black/60 backdrop-blur-md z-10 relative border-y border-red-900/30">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col items-center text-center mb-8">
              <h2 className="font-syncopate text-xl md:text-2xl font-bold tracking-[0.5em] text-red-600 uppercase">Promos Imperdibles</h2>
            </div>

            <div className={`grid grid-cols-1 ${promos.length > 1 ? 'lg:grid-cols-2' : ''} gap-8`}>
              {promos.map((promo) => (
                <div key={promo.id} className={`border-2 p-8 md:p-12 text-center rounded-sm relative overflow-hidden group flex flex-col justify-center items-center transition-all ${
                  promo.highlight 
                    ? 'border-red-600 border-neon-red bg-gradient-to-br from-red-950/20 to-black' 
                    : 'border-white/10 bg-black/40 hover:border-white/30'
                }`}>
                  
                  {/* Imagen de fondo opcional para la promo */}
                  {promo.image && (
                    <div className="absolute inset-0 z-0">
                      <img src={promo.image} alt={promo.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </div>
                  )}

                  {promo.highlight && (
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity z-10">
                      <Zap className="w-24 h-24 text-red-600" />
                    </div>
                  )}

                  <h3 className={`font-syncopate text-xl md:text-2xl font-bold mb-4 tracking-widest relative z-10 ${promo.highlight ? 'text-white' : 'text-gray-300'}`}>
                    {promo.title}
                  </h3>
                  <p className={`text-4xl md:text-6xl font-black mb-8 font-syncopate relative z-10 uppercase leading-tight ${
                    promo.highlight ? 'text-red-600 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]' : 'text-white'
                  }`}>
                    {promo.description}
                  </p>
                  <div className={`inline-block px-8 py-3 border-2 font-bold text-lg rounded-none uppercase tracking-widest relative z-10 bg-black/50 backdrop-blur-sm ${
                    promo.highlight ? 'border-red-600 text-red-600' : 'border-white/20 text-gray-300'
                  }`}>
                    {promo.day}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <section id="menu" className="py-16 px-4 z-10 relative">
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
                  {menuItems.filter(item => item.category === cat).map((item) => (
                    <div key={item.id} className="group relative flex gap-4 sm:gap-6 items-start">
                      
                      {item.image && (
                        <button 
                          onClick={() => setSelectedImage(item)}
                          className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-sm border border-white/10 hover:border-red-600 transition-colors"
                          title="Ver en grande"
                        >
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </button>
                      )}

                      <div className="flex-grow min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-1 sm:mb-2 gap-1 sm:gap-0">
                          <span className="text-lg sm:text-xl font-bold tracking-wide uppercase group-hover:text-red-500 transition-colors duration-300 break-words">
                            {item.name}
                          </span>
                          <div className="hidden sm:block flex-grow mx-4 border-b border-white/10 border-dotted mb-1.5"></div>
                          <span className="text-red-600 font-syncopate font-bold text-base sm:text-lg whitespace-nowrap">{item.price}</span>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed uppercase tracking-tighter break-words">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                  {menuItems.filter(item => item.category === cat).length === 0 && (
                    <p className="text-gray-600 text-sm italic">Sin items en esta categoría</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section id="galeria" className="py-16 px-4 bg-black z-10 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-syncopate text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white">
                El <span className="text-red-600">Lugar</span>
              </h2>
              <p className="mt-4 text-gray-400 font-light tracking-widest uppercase text-sm">Momentos ETER</p>
            </div>

            <div className="relative overflow-hidden w-full max-w-md md:max-w-lg mx-auto rounded-sm border border-white/10 aspect-[3/4] md:aspect-[4/5]">
              <div 
                className="flex transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${currentGalleryIndex * 100}%)` }}
              >
                {gallery.map((img, idx) => {
                  const isVideo = img.url?.match(/\.(mp4|webm|ogg|mov)$/i);
                  return (
                  <div 
                    key={img.id} 
                    className="w-full h-full shrink-0 relative cursor-pointer group"
                    onClick={() => setSelectedGalleryImage(img.url)}
                  >
                    {isVideo ? (
                      <video 
                        src={img.url} 
                        className="w-full h-full object-cover" 
                        muted 
                        loop
                        playsInline 
                        autoPlay
                      />
                    ) : (
                      <img 
                        src={img.url} 
                        alt="ETER Bar" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-white/80" />
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {gallery.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentGalleryIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentGalleryIndex ? 'bg-red-600 w-8' : 'bg-white/50 hover:bg-white w-2'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events & Rental Section */}
      <section id="eventos" className="py-16 px-4 bg-gradient-to-b from-black to-[#1a0000] z-10 relative border-y border-red-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <PartyPopper className="text-red-600 w-8 h-8" />
                <h2 className="font-syncopate text-3xl md:text-4xl font-bold uppercase tracking-tighter">Tu evento en ETER</h2>
              </div>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                ¿Buscás un lugar exclusivo para tu próximo festejo? Alquilamos nuestro local para <span className="text-red-600 font-bold uppercase">cumpleaños, fiestas privadas, eventos</span> y celebraciones especiales.
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
      <section className="py-16 px-4 bg-black/80 z-10 relative">
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
      <footer className="pt-8 pb-16 px-4 border-t border-white/5 text-center z-10 relative bg-black">
        <div className="mb-12 flex flex-col items-center">
          <img 
            src="https://res.cloudinary.com/djqtkbyez/image/upload/v1783016155/WhatsApp_Image_2026-07-02_at_19.36.02_bhmcck.jpg" 
            alt="ETER Logo" 
            className="w-48 md:w-64 h-auto object-contain mb-4 drop-shadow-xl rounded-full" 
          />
          <p className="mt-4 text-gray-500 uppercase tracking-[0.5em] text-xs font-bold">Aquí solo tragos y buena música</p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
            © 2026 ETER BAR <span className="mx-2">|</span> 
            <a href="https://wa.me/34660104026" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-600 underline underline-offset-4 decoration-white/30 hover:decoration-red-600 transition-colors">
              WEB BY JULES
            </a>
          </p>
          <p className="text-gray-800 text-[8px] uppercase tracking-widest px-4">
            Beber con moderación. Prohibida la venta a menores de 18 años.
          </p>
          <p className="text-gray-900 text-[9px] uppercase tracking-widest mt-2">
            {LOCATION_DATA.address}
          </p>
        </div>
      </footer>
      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedGalleryImage(null);
            }}
          >
            <XCircle className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <button 
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10 bg-black/20 p-2 rounded-full hover:bg-black/50"
            onClick={handlePrevGalleryImage}
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          <button 
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10 bg-black/20 p-2 rounded-full hover:bg-black/50"
            onClick={handleNextGalleryImage}
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] md:h-[90vh] flex items-center justify-center">
            {selectedGalleryImage?.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <video 
                src={selectedGalleryImage} 
                className="max-w-full max-h-full object-contain rounded-sm shadow-2xl" 
                controls 
                autoPlay 
                muted
                playsInline 
                onClick={(e) => e.stopPropagation()} 
              />
            ) : (
              <img 
                src={selectedGalleryImage} 
                alt="ETER Bar Gallery" 
                className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
