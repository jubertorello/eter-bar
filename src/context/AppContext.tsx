import React, { createContext, useContext, useState, useEffect } from 'react';
import { DrinkItem, Promo, BannerData } from '../../types';
import { MENU_ITEMS as initialMenuItems } from '../../MENU_ITEMS';
import { PROMOS as initialPromos } from '../../constants';

interface AppState {
  menuItems: DrinkItem[];
  promos: Promo[];
  categories: string[];
  banner: BannerData;
}

interface AppContextType {
  state: AppState;
  addDrink: (drink: DrinkItem) => void;
  updateDrink: (id: string, drink: Partial<DrinkItem>) => void;
  deleteDrink: (id: string) => void;
  addPromo: (promo: Promo) => void;
  updatePromo: (id: string, promo: Partial<Promo>) => void;
  deletePromo: (id: string) => void;
  updateBanner: (banner: BannerData) => void;
  updateCategories: (categories: string[]) => void;
  moveDrink: (id: string, direction: 'up' | 'down') => void;
}

const defaultCategories = ['CÓCTELES', 'MEDIDAS', 'JARRAS', 'CERVEZAS', 'VINOS', 'OTROS'];

const defaultBanner: BannerData = {
  isActive: true,
  text: '🍾 20% DE DESCUENTO EN BOTELLAS HASTA LA 1:00 AM',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('eter_app_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved state', e);
      }
    }
    return {
      menuItems: initialMenuItems,
      promos: initialPromos,
      categories: defaultCategories,
      banner: defaultBanner,
    };
  });

  useEffect(() => {
    localStorage.setItem('eter_app_state', JSON.stringify(state));
  }, [state]);

  const addDrink = (drink: DrinkItem) => {
    setState(prev => ({ ...prev, menuItems: [...prev.menuItems, drink] }));
  };

  const updateDrink = (id: string, updates: Partial<DrinkItem>) => {
    setState(prev => ({
      ...prev,
      menuItems: prev.menuItems.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const deleteDrink = (id: string) => {
    setState(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id)
    }));
  };

  const addPromo = (promo: Promo) => {
    setState(prev => ({ ...prev, promos: [...prev.promos, promo] }));
  };

  const updatePromo = (id: string, updates: Partial<Promo>) => {
    setState(prev => ({
      ...prev,
      promos: prev.promos.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const deletePromo = (id: string) => {
    setState(prev => ({
      ...prev,
      promos: prev.promos.filter(p => p.id !== id)
    }));
  };

  const moveDrink = (id: string, direction: 'up' | 'down') => {
    setState(prev => {
      const items = [...prev.menuItems];
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return prev;

      const currentItem = items[index];
      const categoryItems = items.filter(i => i.category === currentItem.category);
      const catIndex = categoryItems.findIndex(i => i.id === id);
      
      if (direction === 'up' && catIndex > 0) {
        const swapItem = categoryItems[catIndex - 1];
        const swapIndex = items.findIndex(i => i.id === swapItem.id);
        items[index] = swapItem;
        items[swapIndex] = currentItem;
      } else if (direction === 'down' && catIndex < categoryItems.length - 1) {
        const swapItem = categoryItems[catIndex + 1];
        const swapIndex = items.findIndex(i => i.id === swapItem.id);
        items[index] = swapItem;
        items[swapIndex] = currentItem;
      }
      
      return { ...prev, menuItems: items };
    });
  };

  const updateBanner = (banner: BannerData) => {
    setState(prev => ({ ...prev, banner }));
  };

  const updateCategories = (categories: string[]) => {
    setState(prev => ({ ...prev, categories }));
  };

  return (
    <AppContext.Provider value={{
      state,
      addDrink,
      updateDrink,
      deleteDrink,
      addPromo,
      updatePromo,
      deletePromo,
      updateBanner,
      updateCategories,
      moveDrink
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
