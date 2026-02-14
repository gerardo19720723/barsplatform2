import { useState, useEffect, type Key } from 'react';
import { api } from './services/api';
import './App.css';

// --- INTERFACES ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: {
    name: string;
    icon: string;
  } | null;
  ingredients?: {
    ingredientId: string;
    id: Key | null | undefined; // <--- AGREGAR ESTO
    ingredient: {
      name: string;
      unit: string;
    };
    quantity: number;
  }[];
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
  // --- ESTADOS ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); // Nuevo estado para ingredientes
  const [loading, setLoading] = useState(true);
  
  // Formularios
  const [newProduct, setNewProduct] = useState({ name: '', price: '', categoryId: '' });
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: 'Unidad', stock: '' }); // Nuevo estado
  const [recipeForm, setRecipeForm] = useState({ productId: '', ingredientId: '', quantity: '' });

  // --- CARGA DE DATOS ---
  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) { console.error(error); }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) { console.error(error); }
  };

  const loadIngredients = async () => {
    try {
      const response = await api.get('/ingredients');
      setIngredients(response.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadProducts(), loadCategories(), loadIngredients()]);
      setLoading(false);
    };
    init();
  }, []);

  // --- LÓGICA DE PRODUCTOS ---
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.categoryId) { alert('Selecciona una categoría'); return; }
    try {
      const payload = { name: newProduct.name, price: parseFloat(newProduct.price), categoryId: String(newProduct.categoryId) };
      await api.post('/products', payload);
      setNewProduct({ name: '', price: '', categoryId: '' });
      loadProducts();
      alert('Producto agregado! 🍺');
    } catch (error) { alert('Error'); }
  };

  // --- LÓGICA DE INGREDIENTES (NUEVO) ---
  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newIngredient.name,
        unit: newIngredient.unit,
        stock: parseFloat(newIngredient.stock) || 0
      };
      await api.post('/ingredients', payload);
      setNewIngredient({ name: '', unit: 'Unidad', stock: '' });
      loadIngredients();
      alert('Ingrediente agregado al almacén! 🥩');
    } catch (error) { alert('Error al agregar ingrediente'); }
  };

  const handleAddToRecipe = async () => {
  if (!recipeForm.productId || !recipeForm.ingredientId) {
    alert('Selecciona Producto e Ingrediente');
    return;
  }
  try {
    await api.post('/products/recipe', {
      productId: recipeForm.productId,
      ingredientId: recipeForm.ingredientId,
      quantity: parseFloat(recipeForm.quantity)
    });
    alert('Ingrediente agregado a la receta! 📝');
    setRecipeForm({ productId: '', ingredientId: '', quantity: '' });
    // Recargamos productos para ver la receta actualizada (si el backend la devuelve)
    loadProducts(); 
  } catch (error) {
    console.error(error);
    alert('Error: Quizás ya agregaste ese ingrediente a este producto.');
  }
};

  const handleRemoveFromRecipe = async (productId: string, ingredientId: string) => {
    if (!confirm('¿Seguro que quieres quitar este ingrediente de la receta?')) return;
    
    try {
      await api.delete('/products/recipe', { data: { productId, ingredientId } });
      loadProducts(); // Recargar para ver los cambios
    } catch (error) {
      console.error(error);
      alert('Error al eliminar ingrediente');
    }
  };

    const handleSell = async (productId: string, productName: string) => {
    if (!confirm(`¿Confirmar venta de: ${productName}?`)) return;

    try {
      const response = await api.post('/products/sell', { productId });
      alert(`✅ ${response.data.message}`);
      
      // IMPORTANTE: Recargamos INGREDIENTES para ver el stock bajar
      loadIngredients();
    } catch (error: any) {
      console.error(error);
      // Mostramos el mensaje de error específico (ej: Stock insuficiente)
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <div style={{padding: '20px', color: 'black'}}>Cargando sistema... 🍺</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', color: 'black' }}>
      
      <header style={{ marginBottom: '40px', textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px', color: 'black' }}>
        <h1 style={{ color: 'black' }}>🍻 Bar La Cantina</h1>
        <p style={{ color: '#555' }}>Panel de Gestión</p>
      </header>

      {/* ========================================= */}
      {/* SECCIÓN NUEVA: ALMACÉN DE INGREDIENTES */}
      {/* ========================================= */}
      <div style={{ marginBottom: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>📦 Almacén (Ingredientes)</h2>
        </div>

        {/* Formulario Ingredientes */}
        <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
          <form onSubmit={handleCreateIngredient} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Nombre (ej. Carne Molida)"
              value={newIngredient.name}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
              required
              style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', color: 'black', background: 'white' }}
            />
            <select
              value={newIngredient.unit}
              onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', color: 'black', background: 'white' }}
            >
              <option value="Unidad">Unidad</option>
              <option value="Kg">Kilogramos (Kg)</option>
              <option value="Litro">Litros (L)</option>
              <option value="Paquete">Paquete</option>
            </select>
            <input
              type="number"
              placeholder="Stock Inicial"
              value={newIngredient.stock}
              onChange={(e) => setNewIngredient({ ...newIngredient, name: newIngredient.name, stock: e.target.value })}
              required
              step="0.01"
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', color: 'black', background: 'white' }}
            />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              + Agregar
            </button>
          </form>
        </div>

        {/* Lista de Ingredientes (Tabla) */}
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
          <thead style={{ backgroundColor: '#343a40', color: 'white' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Ingrediente</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Unidad</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Stock Actual</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No hay ingredientes registrados.</td></tr>
            ) : (
              ingredients.map(ing => (
                <tr key={ing.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', color: 'black' }}>{ing.name}</td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#555' }}>{ing.unit}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: ing.stock < 10 ? '#dc3545' : '#28a745' }}>
                    {ing.stock}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

        {/* ========================================= */}
  {/* SECCIÓN: EDITOR DE RECETAS */}
  {/* ========================================= */}
  <div style={{ marginBottom: '50px', border: '2px dashed #6c757d', padding: '20px', borderRadius: '12px' }}>
    <h2 style={{ color: '#495057' }}>📝 Editor de Recetas</h2>
    <p style={{ fontSize: '0.9em', color: '#6c757d', marginBottom: '20px' }}>
      Define qué ingredientes se usan para preparar tus productos.
    </p>

    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '20px' }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Producto a Cocinar</label>
        <select 
          value={recipeForm.productId} 
          onChange={(e) => setRecipeForm({ ...recipeForm, productId: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="">-- Seleccionar Producto --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Ingrediente a Usar</label>
        <select 
          value={recipeForm.ingredientId} 
          onChange={(e) => setRecipeForm({ ...recipeForm, ingredientId: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="">-- Seleccionar Ingrediente --</option>
          {ingredients.map(i => (
            <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
          ))}
        </select>
      </div>

      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '0.8em', marginBottom: '5px' }}>Cantidad</label>
        <input 
          type="number" 
          placeholder="Ej: 1.5"
          step="0.01"
          value={recipeForm.quantity}
          onChange={(e) => setRecipeForm({ ...recipeForm, quantity: e.target.value })}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
      </div>

      <button 
        onClick={handleAddToRecipe}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#6f42c1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          height: '42px' // Para alinear con los inputs
        }}
      >
        Vincular
      </button>
    </div>

    {/* Vista previa de la receta seleccionada (Simple) */}
    {recipeForm.productId && (
      <div style={{ marginTop: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
        <strong>Receta actual de: </strong>
        {products.find(p => p.id === recipeForm.productId)?.ingredients?.length || 0} ingredientes vinculados.
        {/* Aquí podríamos listar los ingredientes si quisiéramos */}
      </div>
    )}
  </div>

      {/* ========================================= */}
      {/* SECCIÓN: PRODUCTOS */}
      {/* ========================================= */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '12px', marginBottom: '40px', border: '1px solid #ccc' }}>
        <h3 style={{ marginTop: 0, color: 'black' }}>➕ Agregar Nuevo Producto</h3>
        <form onSubmit={handleCreateProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="Nombre (ej. Tacos)" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #999', color: 'black', backgroundColor: 'white' }} />
          <input type="number" placeholder="Precio ($)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, name: newProduct.name, price: e.target.value })} required step="0.01" style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #999', color: 'black', backgroundColor: 'white' }} />
          <select value={newProduct.categoryId} onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #999', color: 'black', backgroundColor: 'white', minWidth: '150px' }}>
            <option value="">-- Seleccionar Categoría --</option>
            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}
          </select>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
        </form>
      </div>

      {Object.keys(groupedProducts).length === 0 ? (
        <p style={{ textAlign: 'center', color: 'black' }}>No hay productos.</p>
      ) : (
        Object.entries(groupedProducts).map(([categoryName, prods]) => (
          <div key={categoryName} style={{ marginBottom: '30px' }}>
            <h2 style={{ backgroundColor: '#343a40', color: 'white', padding: '10px 15px', borderRadius: '8px 8px 0 0', margin: 0, fontSize: '1.2rem' }}>
              {categoryName} ({prods.length})
            </h2>
            <div style={{ border: '1px solid #dee2e6', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '0' }}>
              {prods.map((prod) => (
                          <div 
                key={prod.id} 
                style={{ 
                  // ✅ CAMBIO 1: Hacemos que el contenedor sea una COLUMNA (vertical)
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  padding: '15px', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: 'white',
                  color: 'black'
                }}
              >
                {/* ✅ CAMBIO 2: Envolver Nombre y Precio en una FILA interna para que sigan alineados */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px' // Pequeño espacio antes de la receta
                }}>
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

                {/* ✅ La receta ahora aparece naturalmente ABAJO de la fila anterior */}
                {prod.ingredients && prod.ingredients.length > 0 && (
                  <div style={{ 
                    fontSize: '0.85em', 
                    color: '#666', 
                    paddingTop: '8px', 
                    borderTop: '1px dashed #ccc',
                    marginTop: '8px'
                  }}>
                    <div style={{ marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>📝 Receta:</div>
                    {prod.ingredients.map((pi) => (
                      <div 
                        key={pi.id} 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          marginRight: '15px', 
                          marginBottom: '4px',
                          background: '#f1f3f5',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          border: '1px solid #ddd'
                        }}
                      >
                        <span>{pi.quantity} {pi.ingredient.unit} {pi.ingredient.name}</span>
                        
                        {/* Botón Eliminar */}
                        <button 
                          onClick={() => handleRemoveFromRecipe(prod.id, pi.ingredientId)}
                          style={{ 
                            marginLeft: '8px', 
                            background: 'none', 
                            border: 'none', 
                            color: '#dc3545', 
                            cursor: 'pointer', 
                            fontSize: '1.1em',
                            fontWeight: 'bold',
                            padding: '0 4px',
                            lineHeight: 1
                          }}
                          title="Eliminar de receta"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                 {/* ✅ NUEVO: Botón Vender */}
                  <button 
                    onClick={() => handleSell(prod.id, prod.name)}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9em'
                    }}
                  >
                    VENDER (+)
                  </button>
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