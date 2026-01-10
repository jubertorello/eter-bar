
export interface DrinkItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: 'COPAS/VASOS' | 'JARRAS' | 'CERVEZAS' | 'VINOS' | 'OTROS';
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface Promo {
  title: string;
  description: string;
  day: string;
  highlight?: boolean;
}
