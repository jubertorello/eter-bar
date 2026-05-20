import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Wine, Zap, List, Plus, Trash2, Edit2, LogOut, ArrowLeft, Image as ImageIcon, Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DrinkItem, Promo } from '../../types';

const AdminDashboard: React.FC = () => {
  const { state, addDrink, updateDrink, deleteDrink, addPromo, updatePromo, deletePromo, updateCategories, moveDrink } = useAppContext();
  const [activeTab, setActiveTab] = useState<'tragos' | 'promos'>('tragos');
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');

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
  const [drinkForm, setDrinkForm] = useState<Partial<DrinkItem>>({ name: '', description: '', price: '', category: state.categories[0] });

  // Form states for Promos
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promoForm, setPromoForm] = useState<Partial<Promo>>({ title: '', description: '', day: '', image: '', highlight: true });

  const handleDrinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDrink) {
      updateDrink(editingDrink.id, drinkForm);
      setEditingDrink(null);
    } else {
      addDrink({
        id: 'd' + Date.now(),
        name: drinkForm.name || '',
        description: drinkForm.description || '',
        price: drinkForm.price || '',
        category: drinkForm.category || state.categories[0],
      });
    }
    setDrinkForm({ name: '', description: '', price: '', category: state.categories[0] });
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      updatePromo(editingPromo.id, promoForm);
      setEditingPromo(null);
    } else {
      addPromo({
        id: 'p' + Date.now(),
        title: promoForm.title || '',
        description: promoForm.description || '',
        day: promoForm.day || '',
        image: promoForm.image || '',
        highlight: promoForm.highlight !== undefined ? promoForm.highlight : true,
      });
    }
    setPromoForm({ title: '', description: '', day: '', image: '', highlight: true });
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
              <input 
                type="password"
                required
                value={loginForm.pass}
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
                className="w-full bg-[#0a0000] border border-white/20 p-3 rounded-sm focus:border-red-600 outline-none transition-colors" 
              />
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
              <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus className="text-red-600" /> {editingDrink ? 'Editar Trago' : 'Nuevo Trago'}
                </h3>
                <form onSubmit={handleDrinkSubmit} className="space-y-4">
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
                  <div className="pt-4 flex gap-2">
                    <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-black font-bold uppercase tracking-widest py-3 rounded-sm transition-colors">
                      {editingDrink ? 'Guardar Cambios' : 'Crear Trago'}
                    </button>
                    {editingDrink && (
                      <button type="button" onClick={() => { setEditingDrink(null); setDrinkForm({ name: '', description: '', price: '', category: state.categories[0] }); }} className="bg-white/10 hover:bg-white/20 p-3 rounded-sm">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-8">
                {state.categories.map(category => {
                  const itemsInCategory = state.menuItems.filter(item => item.category === category);
                  
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
                          <div key={item.id} className="bg-black border border-white/5 p-4 flex justify-between items-center group hover:border-red-600/50 transition-colors rounded-sm">
                            <div>
                              <h5 className="text-lg font-bold">{item.name} <span className="text-red-500 font-syncopate font-normal ml-2">{item.price}</span></h5>
                              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                              <button onClick={() => { setEditingDrink(item); setDrinkForm(item); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-sm text-blue-400 transition-colors ml-2" title="Editar">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteDrink(item.id)} className="p-2 bg-white/5 hover:bg-red-900/50 rounded-sm text-red-500 transition-colors" title="Eliminar">
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
              <div className="bg-white/5 p-6 border border-white/10 rounded-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="text-red-600" /> {editingPromo ? 'Editar Promo' : 'Nueva Promo'}
                </h3>
                <form onSubmit={handlePromoSubmit} className="space-y-4">
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
                      <button type="button" onClick={() => { setEditingPromo(null); setPromoForm({ title: '', description: '', day: '', image: '', highlight: true }); }} className="bg-white/10 hover:bg-white/20 p-3 rounded-sm">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* List */}
              <div className="lg:col-span-2 space-y-4">
                {state.promos.map(item => (
                  <div key={item.id} className="bg-black border border-white/5 p-4 flex justify-between items-center group hover:border-red-600/50 transition-colors">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-sm border border-white/10" />
                      ) : (
                        <div className="w-16 h-16 bg-white/5 rounded-sm flex items-center justify-center border border-white/10">
                          <ImageIcon className="text-gray-600 w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-bold text-red-500 uppercase">{item.title}</h4>
                        <p className="text-2xl font-black font-syncopate">{item.description}</p>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">{item.day}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingPromo(item); setPromoForm(item); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-sm text-blue-400"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deletePromo(item.id)} className="p-2 bg-white/5 hover:bg-red-900/50 rounded-sm text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
