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

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Cargar datos
  useEffect(() => {
    const init = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error(error);
        alert("Error cargando menú. Revisa tu conexión y el Token.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Agrupar productos por categoría
  const groupedProducts = products.reduce((acc, product) => {
    const key = product.category ? `${product.category.icon} ${product.category.name}` : 'Otros';
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Acciones del Carrito
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  // Enviar Orden al Backend
  const handleSubmit = async () => {
    if (!tableNumber) return alert('⚠️ Ingresa el número de mesa');
    if (cart.length === 0) return alert('⚠️ El carrito está vacío');

    setSending(true);
    try {
      const payload = {
        tableNumber: tableNumber,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      await api.post('/orders', payload);
      
      alert(`✅ Orden enviada a la cocina para Mesa ${tableNumber}`);
      setCart([]); // Limpiar carrito
      setTableNumber('');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al enviar orden';
      alert(`❌ ${msg}`);
    } finally {
      setSending(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) return <div style={{padding:'20px', textAlign:'center'}}>Cargando Menú... 🍽️</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* --- CABECERA: MESA Y ENVIAR --- */}
      <div style={{ 
        background: '#333', 
        color: 'white', 
        padding: '15px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        position: 'sticky',
        top: '10px',
        zIndex: 100,
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{flex: 1}}>
          <label style={{fontSize:'0.8em', color:'#aaa'}}>MESA</label>
          <input 
            type="text" 
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
            placeholder="Ej: 5"
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '5px', 
              border: 'none',
              fontSize: '1.2em',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          />
        </div>
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize:'0.8em', color:'#aaa'}}>TOTAL</div>
          <div style={{fontSize:'1.5em', fontWeight:'bold', color:'#4cd137'}}>${total.toFixed(2)}</div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={sending}
          style={{
            background: '#4cd137',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '8px',
            fontSize: '1.1em',
            fontWeight: 'bold',
            cursor: sending ? 'not-allowed' : 'pointer',
            opacity: sending ? 0.7 : 1
          }}
        >
          {sending ? 'ENVIANDO...' : 'ENVIAR A COCINA'}
        </button>
      </div>

                {/* --- SECCIÓN MENÚ --- */}
          <div>
            {Object.entries(groupedProducts).map(([categoryName, prods]) => (
              <div key={categoryName} style={{ marginBottom: '25px' }}>
                
                {/* TÍTULO DE CATEGORÍA */}
                <h3 style={{ 
                  background: '#f1f2f6', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  borderLeft: '5px solid #4cd137',
                  marginTop: 0,
                  color: '#333' // ✅ AGREGAR COLOR AQUÍ
                }}>
                  {categoryName}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                  {prods.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => addToCart(p)}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        background: 'white',
                        color: 'black' // ✅ AGREGAR COLOR AQUÍ (Texto negro)
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{fontSize:'2em', marginBottom:'5px'}}>
                        {p.category?.icon || '🍽️'}
                      </div>
                      <div style={{fontWeight:'bold', fontSize:'0.9em', marginBottom:'5px'}}>{p.name}</div>
                      <div style={{color:'#4cd137', fontWeight:'bold'}}>${p.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

      {/* --- SECCIÓN CARRITO (FLOTANTE O AL FINAL) --- */}
      {cart.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '300px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
          border: '1px solid #ddd',
          maxHeight: '50vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{padding: '10px', background: '#f8f9fa', borderBottom: '1px solid #eee', fontWeight:'bold', borderRadius:'10px 10px 0 0'}}>
            🛒 Orden Actual ({cart.length})
          </div>
          <div style={{overflowY: 'auto', padding: '10px'}}>
            {cart.map(item => (
              <div key={item.productId} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', borderBottom:'1px solid #eee', paddingBottom:'5px'}}>
                <div>
                  <div style={{fontSize:'0.9em', fontWeight:'bold'}}>{item.name}</div>
                  <div style={{fontSize:'0.8em', color:'#666'}}>${item.price.toFixed(2)} x {item.quantity}</div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                  <button onClick={() => updateQuantity(item.productId, -1)} style={{width:'25px', height:'25px', borderRadius:'50%', border:'1px solid #ccc', background:'white', cursor:'pointer'}}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)} style={{width:'25px', height:'25px', borderRadius:'50%', border:'1px solid #ccc', background:'white', cursor:'pointer'}}>+</button>
                  <button onClick={() => removeFromCart(item.productId)} style={{color:'red', background:'none', border:'none', cursor:'pointer', marginLeft:'5px'}}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;