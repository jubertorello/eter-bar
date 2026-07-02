
export interface DrinkItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  day: string;
  highlight?: boolean;
  image?: string;
}

export interface BannerData {
  isActive: boolean;
  text: string;
  link?: string;
  linkText?: string;
}
