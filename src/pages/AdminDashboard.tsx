import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wine, Zap, List, Plus, Trash2, Edit2, LogOut, ArrowLeft, Image as ImageIcon, Lock, ChevronUp, ChevronDown, Search, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DrinkItem, Promo } from '../../types';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AdminDashboard: React.FC = () => {
  const { state, addDrink, updateDrink, deleteDrink, addPromo, updatePromo, deletePromo, updateCategories, moveDrink, addGalleryImage, deleteGalleryImage } = useAppContext();
  const [activeTab, setActiveTab] = useState<'tragos' | 'promos' | 'galeria'>('tragos');
  
  // Toast notifications
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('eter_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciales de prueba (deberían estar en variables de entorno o backend real)
    if (loginForm.user === 'admin' && loginForm.pass === 'eter2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('eter_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('eter_admin_auth');
  };

  // Form states for Drinks
  const [editingDrink, setEditingDrink] = useState<DrinkItem | null>(null);
  const [drinkForm, setDrinkForm] = useState<Partial<DrinkItem>>({ name: '', description: '', price: '', category: state.categories[0], image: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [drinkSearch, setDrinkSearch] = useState('');
  const [isDrinkFormOpen, setIsDrinkFormOpen] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Máximo 5MB");
      return;
    }

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert("Faltan credenciales de Cloudinary en .env.local");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        const optimizedUrl = data.secure_url.replace('/upload/', '/upload/f_webp,q_auto/');
        setDrinkForm(prev => ({ ...prev, image: optimizedUrl }));
      } else {
        alert("Error al subir imagen");
      }
    } catch (error) {
      console.error(error);
      alert("Error al subir imagen");
    } finally {
      setIsUploading(false);
    }
  };

  // Form states for Promos
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promoForm, setPromoForm] = useState<Partial<Promo>>({ title: '', description: '', day: '', image: '', highlight: true });
  const [promoSearch, setPromoSearch] = useState('');
  const [isPromoFormOpen, setIsPromoFormOpen] = useState(false);

  const handleDrinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDrink) {
        await updateDrink(editingDrink.id, drinkForm);
        showToast('Trago guardado correctamente');
        setEditingDrink(null);
      } else {
        await addDrink({
          id: 'd' + Date.now(),
          name: drinkForm.name || '',
          description: drinkForm.description || '',
          price: drinkForm.price || '',
          category: drinkForm.category || state.categories[0],
          image: drinkForm.image || '',
        });
        showToast('Trago creado correctamente');
      }
      setDrinkForm({ name: '', description: '', price: '', category: state.categories[0], image: '' });
      setIsDrinkFormOpen(false);
    } catch (err) {
      showToast('Error al guardar el trago', 'error');
    }
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPromo) {
        await updatePromo(editingPromo.id, promoForm);
        showToast('Promo guardada correctamente');
        setEditingPromo(null);
      } else {
        await addPromo({
          id: 'p' + Date.now(),
          title: promoForm.title || '',
          description: promoForm.description || '',
          day: promoForm.day || '',
          image: promoForm.image || '',
          highlight: promoForm.highlight !== undefined ? promoForm.highlight : true,
        });
        showToast('Promo creada correctamente');
      }
      setPromoForm({ title: '', description: '', day: '', image: '', highlight: true });
      setIsPromoFormOpen(false);
    } catch (err) {
      showToast('Error al guardar la promo', 'error');
    }
  };

  const handleDeleteDrink = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este trago?')) {
      try {
        await deleteDrink(id);
        showToast('Trago eliminado correctamente');
      } catch (err) {
        showToast('Error al eliminar el trago', 'error');
      }
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta promo?')) {
      try {
        await deletePromo(id);
        showToast('Promo eliminada correctamente');
      } catch (err) {
        showToast('Error al eliminar la promo', 'error');
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    
    if (file.size > maxSize) {
      showToast(`El archivo es demasiado grande. Máximo ${isVideo ? '20MB para videos' : '5MB para fotos'}`, 'error');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        const optimizedUrl = data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
        await addGalleryImage({
          id: 'g' + Date.now(),
          url: optimizedUrl
        });
        showToast('Imagen agregada a la galería');
      } else {
        throw new Error('No url returned');
      }
    } catch (err) {
      showToast('Error al subir imagen a la galería', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen de la galería?')) {
      try {
        await deleteGalleryImage(id);
        showToast('Imagen eliminada de la galería');
      } catch (err) {
        showToast('Error al eliminar la imagen', 'error');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050000] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black border border-red-900/30 p-8 rounded-sm text-white">
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="font-syncopate text-2xl font-bold text-center uppercase tracking-widest mb-8">Admin Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Usuario</label>
              <input 
                type="text"
                required
                value={loginForm.user}
                onChange={e => setLoginForm({...loginForm, user: e.target.value})}
                className="w-full bg-[#0a0000] border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Contraseña</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.pass}
                  onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                  className="w-full bg-[#0a0000] border border-white/20 p-3 pr-12 rounded-sm focus:border-red-600 outline-none transition-colors" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {loginError && (
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center bg-red-500/10 py-2">
                {loginError}
              </p>
            )}

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-black font-bold uppercase tracking-widest py-3 rounded-sm transition-colors mt-4">
              Ingresar
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-gray-500 hover:text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Volver a la web
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050000] text-white flex flex-col md:flex-row">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-sm shadow-xl font-bold uppercase tracking-widest text-xs animate-in slide-in-from-top-4 ${
          toast.type === 'success' ? 'bg-green-600 text-black' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 md:min-h-screen bg-black border-b md:border-b-0 md:border-r border-red-900/30 p-4 md:p-6 flex flex-col shrink-0 z-20 sticky top-0">
        <div className="mb-4 md:mb-10 flex justify-between items-center md:block">
          <div>
            <Link to="/" className="flex items-center gap-2 text-red-600 hover:text-red-400 transition-colors mb-2 md:mb-6 text-sm md:text-base">
              <ArrowLeft className="w-4 h-4" /> <span className="hidden md:inline">Volver a la web</span>
            </Link>
            <h1 className="font-syncopate text-xl md:text-2xl font-bold tracking-tighter text-red-600 uppercase">
              Admin
            </h1>
          </div>
          
          {/* Botón Logout móvil (en Desktop va abajo) */}
          <button 
            onClick={handleLogout}
            className="md:hidden flex items-center gap-2 p-2 rounded-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('tragos')}
            className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-sm transition-all text-sm md:text-base ${activeTab === 'tragos' ? 'bg-red-600 text-black font-bold' : 'hover:bg-white/5'}`}
          >
            <Wine className="w-4 h-4 md:w-5 md:h-5" /> Tragos y Menú
          </button>
          <button 
            onClick={() => setActiveTab('promos')}
            className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-sm transition-all text-sm md:text-base ${activeTab === 'promos' ? 'bg-red-600 text-black font-bold' : 'hover:bg-white/5'}`}
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5" /> Promociones
          </button>
          <button 
            onClick={() => setActiveTab('galeria')}
            className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 rounded-sm transition-all text-sm md:text-base ${activeTab === 'galeria' ? 'bg-red-600 text-black font-bold' : 'hover:bg-white/5'}`}
          >
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" /> Galería
          </button>
        </nav>

        <div className="hidden md:block mt-auto pt-6 border-t border-red-900/30">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        
        {/* TRAGOS TAB */}
        {activeTab === 'tragos' && (
          <div className="max-w-5xl mx-auto animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-syncopate font-bold uppercase tracking-widest">Gestión de Tragos</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div id="drink-form" className="bg-white/5 p-6 border border-white/10 rounded-sm">
                <button 
                  onClick={() => {
                    setIsDrinkFormOpen(!isDrinkFormOpen);
                    if (isDrinkFormOpen) { setEditingDrink(null); setDrinkForm({ name: '', description: '', price: '', category: state.categories[0] }); }
                  }}
                  className="w-full flex justify-between items-center text-xl font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="text-red-600" /> {editingDrink ? 'Editar Trago' : 'Nuevo Trago'}
                  </span>
                  {isDrinkFormOpen ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                </button>
                
                {isDrinkFormOpen && (
                  <form onSubmit={handleDrinkSubmit} className="space-y-4 mt-6 animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Nombre</label>
                    <input required value={drinkForm.name} onChange={e => setDrinkForm({...drinkForm, name: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Descripción</label>
                    <input required value={drinkForm.description} onChange={e => setDrinkForm({...drinkForm, description: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Precio</label>
                    <input required value={drinkForm.price} onChange={e => setDrinkForm({...drinkForm, price: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none" placeholder="ej: $6.000" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Categoría</label>
                    <select value={drinkForm.category} onChange={e => setDrinkForm({...drinkForm, category: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none">
                      {state.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Foto (Opcional)</label>
                    <div className="flex flex-col gap-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={isUploading}
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                      />
                      {isUploading && <span className="text-xs text-yellow-500">Subiendo...</span>}
                      {drinkForm.image && (
                        <div className="relative w-24 h-24">
                          <img src={drinkForm.image} alt="Preview" className="w-full h-full object-cover rounded-sm border border-white/20" />
                          <button 
                            type="button" 
                            onClick={() => setDrinkForm(prev => ({ ...prev, image: '' }))}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-black font-bold uppercase tracking-widest py-3 rounded-sm transition-colors">
                      {editingDrink ? 'Guardar Cambios' : 'Crear Trago'}
                    </button>
                    {editingDrink && (
                      <button type="button" onClick={() => { setEditingDrink(null); setDrinkForm({ name: '', description: '', price: '', category: state.categories[0] }); setIsDrinkFormOpen(false); }} className="bg-white/10 hover:bg-white/20 p-3 rounded-sm">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
                )}
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-8">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar trago por nombre..." 
                    value={drinkSearch}
                    onChange={e => setDrinkSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-sm focus:border-red-600 outline-none transition-colors"
                  />
                </div>

                {state.categories.map(category => {
                  const itemsInCategory = state.menuItems.filter(item => 
                    item.category === category && 
                    item.name.toLowerCase().includes(drinkSearch.toLowerCase())
                  );
                  
                  if (itemsInCategory.length === 0) return null;
                  
                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-3 border-b border-red-900/30 pb-2">
                        <Wine className="w-5 h-5 text-red-600" />
                        <h4 className="font-syncopate font-bold text-lg text-white uppercase tracking-wider">{category}</h4>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-sm text-gray-400">{itemsInCategory.length} items</span>
                      </div>
                      <div className="space-y-3">
                        {itemsInCategory.map((item, index) => (
                          <div key={item.id} className="bg-black border border-white/5 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-red-600/50 transition-colors rounded-sm">
                            <div className="flex items-center gap-4 w-full min-w-0">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-sm border border-white/10 shrink-0" />
                              )}
                              <div className="min-w-0 flex-grow">
                                <h5 className="text-lg font-bold leading-tight break-words">{item.name} <span className="text-red-500 font-syncopate font-normal ml-1 inline-block">{item.price}</span></h5>
                                <p className="text-sm text-gray-400 mt-1 break-words">{item.description}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity self-end md:self-auto shrink-0">
                              {index > 0 && (
                                <button onClick={() => moveDrink(item.id, 'up')} className="p-2 bg-white/5 hover:bg-white/10 rounded-sm text-gray-400 transition-colors" title="Subir">
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                              )}
                              {index < itemsInCategory.length - 1 && (
                                <button onClick={() => moveDrink(item.id, 'down')} className="p-2 bg-white/5 hover:bg-white/10 rounded-sm text-gray-400 transition-colors" title="Bajar">
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => { setEditingDrink(item); setDrinkForm(item); setIsDrinkFormOpen(true); document.getElementById('drink-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-sm text-blue-400 transition-colors ml-2" title="Editar">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteDrink(item.id)} className="p-2 bg-white/5 hover:bg-red-900/50 rounded-sm text-red-500 transition-colors" title="Eliminar">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {state.menuItems.length === 0 && (
                  <div className="text-center p-8 border border-white/10 rounded-sm text-gray-500 italic">
                    No hay tragos cargados en el menú.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PROMOS TAB */}
        {activeTab === 'promos' && (
          <div className="max-w-5xl mx-auto animate-in fade-in">
            <h2 className="text-3xl font-syncopate font-bold uppercase tracking-widest mb-8">Promociones</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div id="promo-form" className="bg-white/5 p-6 border border-white/10 rounded-sm">
                <button 
                  onClick={() => {
                    setIsPromoFormOpen(!isPromoFormOpen);
                    if (isPromoFormOpen) { setEditingPromo(null); setPromoForm({ title: '', description: '', day: '', image: '', highlight: true }); }
                  }}
                  className="w-full flex justify-between items-center text-xl font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="text-red-600" /> {editingPromo ? 'Editar Promo' : 'Nueva Promo'}
                  </span>
                  {isPromoFormOpen ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                </button>

                {isPromoFormOpen && (
                  <form onSubmit={handlePromoSubmit} className="space-y-4 mt-6 animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Título</label>
                    <input required value={promoForm.title} onChange={e => setPromoForm({...promoForm, title: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Descripción Principal (ej: 2x1 FERNET)</label>
                    <input required value={promoForm.description} onChange={e => setPromoForm({...promoForm, description: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Días/Horario</label>
                    <input required value={promoForm.day} onChange={e => setPromoForm({...promoForm, day: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">URL de Imagen (Opcional)</label>
                    <div className="flex gap-2 items-center">
                      <ImageIcon className="text-gray-500 w-5 h-5" />
                      <input value={promoForm.image} onChange={e => setPromoForm({...promoForm, image: e.target.value})} className="w-full bg-black border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-black border border-white/10 rounded-sm">
                    <input 
                      type="checkbox" 
                      id="highlightPromo"
                      checked={promoForm.highlight}
                      onChange={e => setPromoForm({...promoForm, highlight: e.target.checked})}
                      className="w-5 h-5 accent-red-600"
                    />
                    <label htmlFor="highlightPromo" className="font-bold uppercase tracking-widest cursor-pointer text-sm">Destacar esta promoción</label>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-black font-bold uppercase tracking-widest py-3 rounded-sm transition-colors">
                      {editingPromo ? 'Guardar Cambios' : 'Crear Promo'}
                    </button>
                    {editingPromo && (
                      <button type="button" onClick={() => { setEditingPromo(null); setPromoForm({ title: '', description: '', day: '', image: '', highlight: true }); setIsPromoFormOpen(false); }} className="bg-white/10 hover:bg-white/20 p-3 rounded-sm">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
                )}
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Search Bar Promos */}
                <div className="relative mb-8">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar promo..." 
                    value={promoSearch}
                    onChange={e => setPromoSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-sm focus:border-red-600 outline-none transition-colors"
                  />
                </div>

                {state.promos.filter(item => item.title.toLowerCase().includes(promoSearch.toLowerCase()) || item.description.toLowerCase().includes(promoSearch.toLowerCase())).map(item => (
                  <div key={item.id} className="bg-black border border-white/5 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group hover:border-red-600/50 transition-colors">
                    <div className="flex items-center gap-4 w-full min-w-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-sm border border-white/10 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 bg-white/5 rounded-sm flex items-center justify-center border border-white/10 shrink-0">
                          <ImageIcon className="text-gray-600 w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-lg font-bold text-red-500 uppercase break-words">{item.title}</h4>
                        <p className="text-xl sm:text-2xl font-black font-syncopate leading-tight break-words">{item.description}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest break-words mt-1">{item.day}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity self-end md:self-auto shrink-0">
                      <button onClick={() => { setEditingPromo(item); setPromoForm(item); setIsPromoFormOpen(true); document.getElementById('promo-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-sm text-blue-400"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeletePromo(item.id)} className="p-2 bg-white/5 hover:bg-red-900/50 rounded-sm text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* GALERIA TAB */}
        {activeTab === 'galeria' && (
          <div className="max-w-5xl mx-auto animate-in fade-in">
            <h2 className="text-3xl font-syncopate font-bold uppercase tracking-widest mb-8">Galería</h2>
            
            <div className="bg-white/5 p-6 border border-white/10 rounded-sm mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="text-red-600" /> Añadir Nueva Foto
              </h3>
              <p className="text-gray-400 text-sm mb-4">Sube fotos del bar, los tragos o la gente. Se mostrarán en la página principal.</p>
              
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleGalleryUpload} 
                  disabled={isUploading}
                  className="text-sm file:mr-4 file:py-3 file:px-6 file:rounded-sm file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-wider file:bg-red-600 file:text-black hover:file:bg-red-700 disabled:opacity-50"
                />
                {isUploading && <span className="text-sm text-yellow-500 font-bold animate-pulse">Subiendo imagen...</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {state.gallery.map(img => {
                const isVideo = img.url?.match(/\.(mp4|webm|ogg|mov)$/i);
                return (
                  <div key={img.id} className="relative group aspect-square rounded-sm overflow-hidden bg-white/5 border border-white/10">
                    {isVideo ? (
                      <video src={img.url} className="w-full h-full object-cover" muted loop playsInline autoPlay />
                    ) : (
                      <img src={img.url} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDeleteGallery(img.id)}
                      className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-transform hover:scale-110"
                      title="Eliminar foto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                );
              })}
              {state.gallery.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/20 rounded-sm">
                  No hay imágenes en la galería todavía.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
