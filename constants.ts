
import { DrinkItem, OpeningHour, Promo } from './types';

export const MENU_ITEMS: DrinkItem[] = [
  // COPAS/VASOS
  { id: 'cv1', name: 'Gin Tonic', description: 'Neutro, Frutos Rojos, Naranja', price: '$6.000', category: 'COPAS/VASOS' },
  { id: 'cv2', name: 'Aperol Spritz', description: 'Clásico con rodaja de naranja y soda', price: '$6.500', category: 'COPAS/VASOS' },
  { id: 'cv3', name: 'Fernet + Coca', description: 'Medida Fernet + Botella coca', price: '$7.000', category: 'COPAS/VASOS' },
  { id: 'cv4', name: 'Smirnoff + Speed', description: 'Frutos Rojos, Citric, Tropical', price: '$6.000', category: 'COPAS/VASOS' },
  { id: 'cv5', name: 'Absolut + Speed', description: 'Vodka premium con energizante', price: '$9.500', category: 'COPAS/VASOS' },
  { id: 'cv6', name: 'Jagger + Speed', description: 'Jägermeister con energizante', price: '$9.000', category: 'COPAS/VASOS' },
  { id: 'cv7', name: 'Mojito Malibu', description: 'Ron Malibu, menta y lima', price: '$6.500', category: 'COPAS/VASOS' },
  { id: 'cv8', name: 'Vermut + Soda', description: 'El clásico de siempre', price: '$4.000', category: 'COPAS/VASOS' },

  // JARRAS
  { id: 'j1', name: 'Smirnoff + speed', description: 'Frutos rojos, citric, tropical', price: '$10.000', category: 'JARRAS' },
  { id: 'j2', name: 'Fernet + Coca', description: 'Para compartir entre amigos', price: '$11.000', category: 'JARRAS' },
  { id: 'j3', name: 'Absolut + Speed', description: 'Consultar variedades disponibles', price: '$14.500', category: 'JARRAS' },


  // CERVEZAS
  { id: 'c1', name: 'Corona 330cc', description: 'Cerveza rubia suave premium', price: '$6.500', category: 'CERVEZAS' },
  { id: 'c2', name: 'Brahma lata', description: 'Cerveza clásica en lata', price: '$4.500', category: 'CERVEZAS' },
  { id: 'c3', name: 'Brahma Grande', description: 'Para compartir en mesa', price: '$8.000', category: 'CERVEZAS' },
  { id: 'c4', name: 'Stella Artois Grande', description: 'Calidad premium superior', price: '$12.000', category: 'CERVEZAS' },

  // VINOS
  { id: 'v1', name: 'Cordero con piel de lobo', description: 'Malbec joven y audaz', price: '$8.500', category: 'VINOS' },
  { id: 'v2', name: 'Santa Julia', description: 'Varietales seleccionados', price: '$11.000', category: 'VINOS' },

  // OTROS
  { id: 'o1', name: 'Agua mineral 500cc', description: 'Con o sin gas', price: '$2.500', category: 'OTROS' },
  { id: 'o2', name: 'Coca Cola 500cc', description: 'Línea clásica o sin azúcar', price: '$3.500', category: 'OTROS' },
  { id: 'o3', name: 'Speed', description: 'Lata de energizante 250ml', price: '$3.000', category: 'OTROS' },
];

/**
 * CONFIGURACIÓN DE HORARIOS
 */
export const OPENING_HOURS: OpeningHour[] = [
  { day: 'JUEVES', hours: '10:30 PM — 3:00 AM' },
  { day: 'VIERNES', hours: '11:00 PM — 4:00 AM' },
  { day: 'SÁBADO', hours: '11:00 PM — 4:00 AM' },
  { day: 'DOMINGO', hours: '10:00 PM — 2:30 AM' },
];

/**
 * CONFIGURACIÓN DE PROMOCIONES
 * Puedes añadir o quitar promociones aquí. 
 */
export const PROMOS: Promo[] = [
  { 
    title: 'ESPECIAL DE LOS JUEVES', 
    description: '2x1 GIN TONIC', 
    day: 'TODOS LOS JUEVES - TODA LA NOCHE',
    highlight: true 
  },
  { 
    title: 'PROMO SÁBADO 10/01', 
    description: '2x1 FERNET & VERMUT', 
    day: 'HASTA LAS 1:30AM',
    highlight: true 
  }
];

/**
 * DATOS DE CONEXIÓN WIFI
 */
export const WIFI_DATA = {
  ssid: 'Personal-Clientes',
  pass: 'Clientes'
};

/**
 * UBICACIÓN (Google Maps)
 */
export const LOCATION_DATA = {
  address: 'Avellaneda 67, Las Varillas, Córdoba, Argentina',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Avellaneda+67,+Las+Varillas,+Córdoba,+Argentina'
};

/**
 * DATOS DE CONTACTO Y REDES
 */
export const CONTACT_DATA = {
  whatsapp: 'https://wa.me/5493533687289',
  instagram: 'https://instagram.com/eter_bar',
  eventsEmail: 'eterbar4@gmail.com'
};
