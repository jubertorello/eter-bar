
import { OpeningHour } from './types';

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
