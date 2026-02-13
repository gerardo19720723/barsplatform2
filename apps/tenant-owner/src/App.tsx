import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

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

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Lista de categorías
  const [loading, setLoading] = useState(true);
  
  // Estado inicial con colores explícitos para forzar visibilidad
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    categoryId: '' // Vacío al inicio, usuario elige
  });

  // Cargar Productos
  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar Categorías
  const loadCategories = async () => {
    try {
      const response = await api.get('/categories'); // Necesitamos este endpoint en el backend
      setCategories(response.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const getGroupedProducts = (products: Product[]) => {
    const groups: Record<string, Product[]> = {};
    products.forEach(product => {
      const categoryName = product.category?.name || 'Sin Categoría';
      const categoryIcon = product.category?.icon || '📦';
      const key = `${categoryIcon} ${categoryName}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(product);
    });
    return groups;
  };

  const groupedProducts = getGroupedProducts(products);

    const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // DEBUG: Ver qué estamos enviando antes de enviarlo
    console.log("📦 Datos a enviar:", newProduct);
    console.log("🏷️ ID de Categoría seleccionado:", newProduct.categoryId);

    if (!newProduct.categoryId || newProduct.categoryId === "") {
      alert('⚠️ Por favor selecciona una categoría antes de guardar.');
      return;
    }

    try {
      const payload = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        categoryId: String(newProduct.categoryId) // Forzamos que sea texto
      };
      
      await api.post('/products', payload);
      
      // Limpiamos el formulario
      setNewProduct({ name: '', price: '', categoryId: '' });
      
      // Recargamos lista
      loadProducts();
      
      alert('¡Producto agregado! 🍺');
    } catch (error) {
      console.error(error);
      alert('Error al agregar. Revisa la consola (F12).');
    }
  };

  if (loading) return <div style={{padding: '20px', color: 'black'}}>Cargando... 🍺</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', color: 'black' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', color: 'black' }}>
        <h1 style={{ color: 'black' }}>🍻 Bar La Cantina</h1>
        <p style={{ color: '#555' }}>Panel de Gestión de Inventario</p>
      </header>

      {/* Formulario Mejorado */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #ccc' }}>
        <h3 style={{ marginTop: 0, color: 'black' }}>➕ Agregar Nuevo Producto</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Input Nombre - Color Negro Forzado */}
          <input
            type="text"
            placeholder="Nombre (ej. Tacos)"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
            style={{ 
              flex: 2, 
              padding: '10px', 
              borderRadius: '6px', 
              border: '1px solid #999',
              color: 'black', // <--- Forzar texto negro
              backgroundColor: 'white'
            }}
          />

          {/* Input Precio */}
          <input
            type="number"
            placeholder="Precio ($)"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, name: newProduct.name, price: e.target.value })}
            required
            step="0.01"
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '6px', 
              border: '1px solid #999',
              color: 'black', // <--- Forzar texto negro
              backgroundColor: 'white'
            }}
          />

          {/* Select de Categoría - NUEVO */}
          <select
            value={newProduct.categoryId}
            onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
            required
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #999',
              color: 'black',
              backgroundColor: 'white',
              minWidth: '150px'
            }}
          >
            <option value="">-- Seleccionar Categoría --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Botón */}
          <button 
            type="submit" 
            style={{
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', // Texto blanco sobre azul
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            Guardar
          </button>
        </form>
      </div>

      {/* Lista Agrupada */}
      {Object.keys(groupedProducts).length === 0 ? (
        <p style={{ textAlign: 'center', color: 'black' }}>No hay productos.</p>
      ) : (
        Object.entries(groupedProducts).map(([categoryName, prods]) => (
          <div key={categoryName} style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              backgroundColor: '#343a40', 
              color: 'white', 
              padding: '10px 15px', 
              borderRadius: '8px 8px 0 0',
              margin: 0,
              fontSize: '1.2rem'
            }}>
              {categoryName} ({prods.length})
            </h2>
            
            <div style={{ border: '1px solid #dee2e6', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '0' }}>
              {prods.map((prod) => (
                <div 
                  key={prod.id} 
                  style={{ 
                    padding: '15px', 
                    borderBottom: '1px solid #eee',
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    color: 'black' // Asegurar legibilidad
                  }}
                >
                  <span style={{ fontWeight: '500', fontSize: '1.05rem', color: 'black' }}>{prod.name}</span>
                  <span style={{ 
                    backgroundColor: '#e9ecef', 
                    padding: '5px 10px', 
                    borderRadius: '20px', 
                    fontWeight: 'bold',
                    color: '#333' 
                  }}>
                    ${prod.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;