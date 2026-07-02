import React, { createContext, useContext, useState, useEffect } from 'react';
import { DrinkItem, Promo, BannerData } from '../../types';
import { supabase } from '../lib/supabase';

interface AppState {
  menuItems: DrinkItem[];
  promos: Promo[];
  categories: string[];
  banner: BannerData;
}

interface AppContextType {
  state: AppState;
  loading: boolean;
  addDrink: (drink: DrinkItem) => Promise<void>;
  updateDrink: (id: string, drink: Partial<DrinkItem>) => Promise<void>;
  deleteDrink: (id: string) => Promise<void>;
  addPromo: (promo: Promo) => Promise<void>;
  updatePromo: (id: string, promo: Partial<Promo>) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
  updateBanner: (banner: BannerData) => Promise<void>;
  updateCategories: (categories: string[]) => Promise<void>;
  moveDrink: (id: string, direction: 'up' | 'down') => Promise<void>;
}

const defaultCategories = ['CÓCTELES', 'MEDIDAS', 'JARRAS', 'CERVEZAS', 'VINOS', 'OTROS'];

const defaultBanner: BannerData = {
  isActive: true,
  text: '🍾 20% DE DESCUENTO EN BOTELLAS HASTA LA 1:00 AM',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    menuItems: [],
    promos: [],
    categories: defaultCategories,
    banner: defaultBanner,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, promosRes, settingsRes] = await Promise.all([
        supabase.from('eter_menu_items').select('*').order('created_at', { ascending: true }),
        supabase.from('eter_promos').select('*').order('created_at', { ascending: true }),
        supabase.from('eter_settings').select('*')
      ]);
      
      let newCategories = defaultCategories;
      let newBanner = defaultBanner;
      
      if (settingsRes.data) {
        const catSet = settingsRes.data.find(s => s.key === 'categories');
        if (catSet && catSet.value) newCategories = catSet.value;
        const banSet = settingsRes.data.find(s => s.key === 'banner');
        if (banSet && banSet.value) newBanner = banSet.value;
      }

      setState({
        menuItems: menuRes.data || [],
        promos: promosRes.data || [],
        categories: newCategories,
        banner: newBanner
      });
    } catch (e) {
      console.error('Error fetching state', e);
    } finally {
      setLoading(false);
    }
  };

  const addDrink = async (drink: DrinkItem) => {
    const { id, ...drinkData } = drink; // remove local ID
    const { data, error } = await supabase.from('eter_menu_items').insert(drinkData).select().single();
    if (error) throw error;
    if (data) {
      setState(prev => ({ ...prev, menuItems: [...prev.menuItems, data] }));
    }
  };

  const updateDrink = async (id: string, updates: Partial<DrinkItem>) => {
    const { data, error } = await supabase.from('eter_menu_items').update(updates).eq('id', id).select().single();
    if (error) throw error;
    if (data) {
      setState(prev => ({
        ...prev,
        menuItems: prev.menuItems.map(item => item.id === id ? data : item)
      }));
    }
  };

  const deleteDrink = async (id: string) => {
    const { error } = await supabase.from('eter_menu_items').delete().eq('id', id);
    if (error) throw error;
    setState(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id)
    }));
  };

  const addPromo = async (promo: Promo) => {
    const { id, ...promoData } = promo;
    const { data, error } = await supabase.from('eter_promos').insert(promoData).select().single();
    if (error) throw error;
    if (data) {
      setState(prev => ({ ...prev, promos: [...prev.promos, data] }));
    }
  };

  const updatePromo = async (id: string, updates: Partial<Promo>) => {
    const { data, error } = await supabase.from('eter_promos').update(updates).eq('id', id).select().single();
    if (error) throw error;
    if (data) {
      setState(prev => ({
        ...prev,
        promos: prev.promos.map(p => p.id === id ? data : p)
      }));
    }
  };

  const deletePromo = async (id: string) => {
    const { error } = await supabase.from('eter_promos').delete().eq('id', id);
    if (error) throw error;
    setState(prev => ({
      ...prev,
      promos: prev.promos.filter(p => p.id !== id)
    }));
  };

  const moveDrink = async (id: string, direction: 'up' | 'down') => {
    // For a real production app, order should be stored in DB.
    // For simplicity here, we swap created_at timestamps to reorder, or we just do it locally.
    // Let's do it locally and then maybe in a future update to DB order.
    // Actually, to make it persistent, we need an order field. Since we don't have one, we can just update local state.
    // But since it re-fetches on reload by created_at, reordering won't persist unless we have an order field.
    alert("La reordenación manual requiere un campo de orden en la BD. Por ahora sólo es visual en esta sesión.");
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

  const updateBanner = async (banner: BannerData) => {
    const { error } = await supabase.from('eter_settings').upsert({ key: 'banner', value: banner });
    if (!error) {
      setState(prev => ({ ...prev, banner }));
    }
  };

  const updateCategories = async (categories: string[]) => {
    const { error } = await supabase.from('eter_settings').upsert({ key: 'categories', value: categories });
    if (!error) {
      setState(prev => ({ ...prev, categories }));
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      loading,
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
