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
}

function App() {
  // Estados
  const [view, setView] = useState<'menu' | 'inventory'>('menu'); // Control de Pestañas
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Formulario Producto
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });

  // Formulario Ingrediente
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: '', stock: '' });

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

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadProducts(), loadCategories(), loadIngredients()]);
      setLoading(false);
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
      stock: parseFloat(newIngredient.stock)
    });
    setNewIngredient({ name: '', unit: '', stock: '' });
    loadIngredients();
    alert('Ingrediente agregado al almacén');
  };

  // 3. VENDER PRODUCTO (La magia que probamos en Postman)
  const handleSell = async (productId: string, productName: string) => {
    if (!window.confirm(`¿Confirmar venta de 1x ${productName}?`)) return;
    
    try {
      await api.post(`/products/${productId}/sell`);
      alert(`✅ Vendido: ${productName}`);
      loadIngredients(); // Recargamos ingredientes para ver el stock bajar
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
          style={{ 
            padding: '10px 20px', 
            background: view === 'menu' ? '#007bff' : '#f0f0f0', 
            color: view === 'menu' ? 'white' : 'black', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          📋 Menú
        </button>
        <button 
          onClick={() => setView('inventory')}
          style={{ 
            padding: '10px 20px', 
            background: view === 'inventory' ? '#28a745' : '#f0f0f0', 
            color: view === 'inventory' ? 'white' : 'black', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          📦 Almacén (Stock)
        </button>
      </div>

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
// Estilos reutilizables
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', color: 'black', backgroundColor: 'white' };
const btnStyle = { padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'white' };

// ✅ ACTUALIZAR thStyle y tdStyle con color forzado
const thStyle = { 
  padding: '12px', 
  borderBottom: '2px solid #ddd',
  color: '#333', // <--- Forzar color oscuro
  fontWeight: 'bold'
};
const tdStyle = { 
  padding: '12px', 
  borderBottom: '1px solid #eee',
  color: '#333'  // <--- Forzar color oscuro
};

export default App;