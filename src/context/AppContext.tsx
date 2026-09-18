import React, { createContext, useContext, useState, useEffect } from 'react';
import { DrinkItem, Promo, BannerData, GalleryImage } from '../../types';
import { supabase } from '../lib/supabase';

interface AppState {
  menuItems: DrinkItem[];
  promos: Promo[];
  gallery: GalleryImage[];
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
  addGalleryImage: (image: GalleryImage) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
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
    gallery: [],
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
      const [menuRes, promosRes, galleryRes, settingsRes] = await Promise.all([
        supabase.from('eter_menu_items').select('*').order('created_at', { ascending: true }),
        supabase.from('eter_promos').select('*').order('created_at', { ascending: true }),
        supabase.from('eter_gallery').select('*').order('created_at', { ascending: false }),
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
        gallery: galleryRes.data || [],
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
    // El menú se ordena por created_at, así que intercambiamos las fechas de los dos tragos
    // para que el nuevo orden persista sin necesitar una columna extra en la BD.
    const items = state.menuItems;
    const current = items.find(i => i.id === id);
    if (!current) return;
    const categoryItems = items.filter(i => i.category === current.category);
    const catIndex = categoryItems.findIndex(i => i.id === id);
    const neighbor = categoryItems[direction === 'up' ? catIndex - 1 : catIndex + 1];
    if (!neighbor || !current.created_at || !neighbor.created_at) return;

    const [a, b] = await Promise.all([
      supabase.from('eter_menu_items').update({ created_at: neighbor.created_at }).eq('id', current.id),
      supabase.from('eter_menu_items').update({ created_at: current.created_at }).eq('id', neighbor.id),
    ]);
    if (a.error || b.error) throw a.error || b.error;

    setState(prev => {
      const next = [...prev.menuItems];
      const i = next.findIndex(item => item.id === current.id);
      const j = next.findIndex(item => item.id === neighbor.id);
      if (i === -1 || j === -1) return prev;
      next[i] = { ...neighbor, created_at: current.created_at };
      next[j] = { ...current, created_at: neighbor.created_at };
      return { ...prev, menuItems: next };
    });
  };

  const updateBanner = async (banner: BannerData) => {
    const { error } = await supabase.from('eter_settings').upsert({ key: 'banner', value: banner });
    if (error) throw error;
    setState(prev => ({ ...prev, banner }));
  };

  const updateCategories = async (categories: string[]) => {
    const { error } = await supabase.from('eter_settings').upsert({ key: 'categories', value: categories });
    if (error) throw error;
    setState(prev => ({ ...prev, categories }));
  };

  const addGalleryImage = async (image: GalleryImage) => {
    const { data, error } = await supabase.from('eter_gallery').insert(image).select().single();
    if (error) throw error;
    if (data) {
      setState(prev => ({ ...prev, gallery: [data, ...prev.gallery] }));
    }
  };

  const deleteGalleryImage = async (id: string) => {
    const { error } = await supabase.from('eter_gallery').delete().eq('id', id);
    if (error) throw error;
    setState(prev => ({
      ...prev,
      gallery: prev.gallery.filter(item => item.id !== id)
    }));
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
      moveDrink,
      addGalleryImage,
      deleteGalleryImage
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
