import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

// --- Interfaces ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: {
    name: string;
    icon: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  cost: number;
}

interface Order {
  id: string;
  total: number;
  totalCost: number;
  createdAt: string;
  items: { product: { name: string }; quantity: number; price: number }[];
}

function App() {
  // Estados
  // ✅ CORRECCIÓN: Agregado 'history' a los tipos permitidos
  const [view, setView] = useState<'menu' | 'inventory' | 'history'>('menu');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalCost: 0, totalProfit: 0, totalOrders: 0 });
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
   
  const [loading, setLoading] = useState(true);

  // Formulario Producto
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });

  // Formulario Ingrediente
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: '', stock: '', cost: '' });

  // --- Cargas de Datos ---
  const loadProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data);
  };

  const loadCategories = async () => {
    const response = await api.get('/categories');
    setCategories(response.data);
  };

  const loadIngredients = async () => {
    const response = await api.get('/ingredients');
    setIngredients(response.data);
  };

  // ✅ CORRECCIÓN: Definición única y correcta de loadOrders
  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error cargando historial", error);
    }
  };

    const loadStats = async () => {
    try {
      // Si hay fechas, las pasamos como parámetros
      const params = dateFilter.start && dateFilter.end ? { 
        start: dateFilter.start, 
        end: dateFilter.end 
      } : {};
      
      const response = await api.get('/orders/stats', { params });
      setStats(response.data);
    } catch (error) {
      console.error("Error cargando estadísticas", error);
    }
  };

    useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          loadProducts(), 
          loadCategories(), 
          loadIngredients(),
          loadStats(), 
          ]);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        // No hacemos nada, permitimos que la app cargue aunque falle algo
      } finally {
        setLoading(false); // Esto SIEMPRE se ejecuta, falle o no
      }
    };
    init();
  }, []);

  // --- Acciones de Negocio ---

  // 1. Crear Producto
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.categoryId) return alert('Selecciona una categoría');
    await api.post('/products', {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      categoryId: newProduct.categoryId
    });
    setNewProduct({ name: '', price: '', categoryId: '' });
    loadProducts();
    alert('Producto agregado');
  };

  // 2. Crear Ingrediente
  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/ingredients', {
      name: newIngredient.name,
      unit: newIngredient.unit,
      stock: parseFloat(newIngredient.stock),
      cost: parseFloat(newIngredient.cost)
    });
    setNewIngredient({ name: '', unit: '', stock: '', cost: '' });
    loadIngredients();
    alert('Ingrediente agregado al almacén');
  };

  // 3. VENDER PRODUCTO (La magia que probamos en Postman)
  const handleSell = async (productId: string, productName: string) => {
    if (!window.confirm(`¿Confirmar venta de 1x ${productName}?`)) return;
    
    try {
      await api.post(`/products/${productId}/sell`);
      alert(`✅ Vendido: ${productName}`);
      
      // ✅ CORRECCIÓN: Recargar todo para ver cambios en stock y en historial
      loadIngredients(); 
      loadOrders();
      
    } catch (error: any) {
      alert(`❌ Error: ${error.response?.data?.message || 'No se pudo vender'}`);
    }
  };

  // --- Agrupación de Productos ---
  const getGroupedProducts = (products: Product[]) => {
    const groups: Record<string, Product[]> = {};
    products.forEach(product => {
      const key = `${product.category?.icon || '📦'} ${product.category?.name || 'Sin Categoría'}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(product);
    });
    return groups;
  };

  const groupedProducts = getGroupedProducts(products);

  if (loading) return <div style={{padding:'20px'}}>Cargando sistema... 🍺</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* NAVEGACIÓN (PESTAÑAS) */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <button 
          onClick={() => setView('menu')}
          style={view === 'menu' ? activeBtnStyle : btnStyle}
        >
          📋 Menú
        </button>
        <button 
          onClick={() => setView('inventory')}
          style={view === 'inventory' ? activeBtnStyle : btnStyle}
        >
          📦 Almacén (Stock)
        </button>

        {/* BOTÓN HISTORIAL */}
        <button 
          onClick={() => setView('history')} 
          style={view === 'history' ? activeBtnStyle : btnStyle}
        >
          🕒 Historial
        </button>
      </div>

            {/* VISTA: HISTORIAL DE VENTAS */}
      {view === 'history' && (
        <div>
          <h2>🕒 Historial de Ventas</h2>
          
          {/* --- SELECTORES DE FECHA --- */}
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{fontWeight: 'bold'}}>Desde:</label>
            <input 
              type="date" 
              value={dateFilter.start} 
              onChange={e => setDateFilter({...dateFilter, start: e.target.value})} 
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            
            <label style={{fontWeight: 'bold', marginLeft: '10px'}}>Hasta:</label>
            <input 
              type="date" 
              value={dateFilter.end} 
              onChange={e => setDateFilter({...dateFilter, end: e.target.value})} 
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            
            <button 
              onClick={() => loadStats()} 
              style={{ padding: '5px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Filtrar 📊
            </button>
            
            <button 
              onClick={() => { setDateFilter({start: '', end: ''}); loadStats(); }} 
              style={{ padding: '5px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Limpiar
            </button>
          </div>
          
          {/* --- TARJETA DE RESUMEN (DASHBOARD) --- */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, background: '#d4edda', color: '#155724', padding: '20px', borderRadius: '10px', border: '1px solid #c3e6cb', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>Ingresos (Ventas)</div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>${stats.totalRevenue.toFixed(2)}</div>
            </div>

            <div style={{ flex: 1, background: '#f8d7da', color: '#721c24', padding: '20px', borderRadius: '10px', border: '1px solid #f5c6cb', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>Costo (Ingredientes)</div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>- ${stats.totalCost.toFixed(2)}</div>
            </div>

            <div style={{ flex: 1, background: '#cce5ff', color: '#004085', padding: '20px', borderRadius: '10px', border: '1px solid #b8daff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>GANANCIA NETA</div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>${stats.totalProfit.toFixed(2)}</div>
            </div>

            <div style={{ flex: 1, background: '#e2e3e5', color: '#383d41', padding: '20px', borderRadius: '10px', border: '1px solid #d6d8db', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>Órdenes</div>
              <div style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{stats.totalOrders}</div>
            </div>
          </div>

          {/* --- TABLA --- */}
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Producto</th>
                <th style={thStyle}>Cantidad</th>
                <th style={thStyle}>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={4} style={{textAlign: 'center', padding: '20px'}}>No hay ventas registradas aún.</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>{new Date(order.createdAt).toLocaleString()}</td>
                    <td style={tdStyle}>
                      {order.items.map(item => item.product.name).join(', ')}
                    </td>
                    <td style={tdStyle}>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                    <td style={{...tdStyle, fontWeight: 'bold', color: 'green'}}>${order.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* VISTA: MENÚ */}
      {view === 'menu' && (
        <div>
          {/* Formulario Crear Producto */}
          <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <h3>Agregar al Menú</h3>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input placeholder="Nombre" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required style={inputStyle} />
              <input type="number" placeholder="Precio" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required style={inputStyle} />
              <select value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})} required style={inputStyle}>
                <option value="">Categoría...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              <button type="submit" style={btnStyle}>Guardar</button>
            </form>
          </div>

          {/* Lista Productos */}
          {Object.entries(groupedProducts).map(([catName, prods]) => (
            <div key={catName} style={{ marginBottom: '25px' }}>
              <h4 style={{ background: '#343a40', color: 'white', padding: '8px 15px', borderRadius: '5px 5px 0 0', margin: 0 }}>{catName}</h4>
              <div style={{ border: '1px solid #ddd', borderTop: 'none', padding: '10px', borderRadius: '0 0 5px 5px', background: 'white' }}>
                {prods.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                    <div>
                      <strong>{p.name}</strong>
                      <div style={{color: '#666'}}>${p.price.toFixed(2)}</div>
                    </div>
                    {/* BOTÓN DE VENTA */}
                    <button 
                      onClick={() => handleSell(p.id, p.name)}
                      style={{ 
                        background: '#ffc107', 
                        border: 'none', 
                        padding: '5px 10px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#333'
                      }}
                    >
                      💰 VENDER
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VISTA: ALMACÉN */}
      {view === 'inventory' && (
        <div>
          <h2>📦 Inventario de Materia Prima</h2>
          
          {/* Formulario Agregar Ingrediente */}
          <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #c3e6cb' }}>
            <h3>Recibir Mercancía (Stock)</h3>
            <form onSubmit={handleCreateIngredient} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input placeholder="Nombre (ej. Pan)" value={newIngredient.name} onChange={e => setNewIngredient({...newIngredient, name: e.target.value})} required style={inputStyle} />
              <input placeholder="Unidad (ej. Unidades, Kg)" value={newIngredient.unit} onChange={e => setNewIngredient({...newIngredient, unit: e.target.value})} required style={inputStyle} />
              <input type="number" placeholder="Costo Unitario ($)" value={newIngredient.cost} onChange={e => setNewIngredient({...newIngredient, cost: e.target.value})} required step="0.01" style={inputStyle} />
              <input type="number" placeholder="Cantidad Inicial" value={newIngredient.stock} onChange={e => setNewIngredient({...newIngredient, stock: e.target.value})} required style={inputStyle} />
              <button type="submit" style={{...btnStyle, background: '#28a745'}}>Ingresar</button>
            </form>
          </div>

          {/* Lista Ingredientes */}
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                <th style={thStyle}>Ingrediente</th>
                <th style={thStyle}>Unidad</th>
                <th style={thStyle}>Stock Actual</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map(ing => (
                <tr key={ing.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{ing.name}</td>
                  <td style={tdStyle}>{ing.unit}</td>
                  <td style={{...tdStyle, fontWeight: 'bold'}}>{ing.stock}</td>
                  <td style={tdStyle}>
                    {ing.stock < 10 ? <span style={{color:'red'}}>🔴 Bajo</span> : <span style={{color:'green'}}>🟢 OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Estilos reutilizables
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' };
const btnStyle = { padding: '10px 20px', background: '#f0f0f0', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

// ✅ ESTILO FALTANTE PARA EL BOTÓN ACTIVO
const activeBtnStyle = { padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

const thStyle = { 
  padding: '12px', 
  borderBottom: '2px solid #ddd',
  color: '#333', 
  fontWeight: 'bold'
};
const tdStyle = { 
  padding: '12px', 
  borderBottom: '1px solid #eee',
  color: '#333'  
};

export default App;