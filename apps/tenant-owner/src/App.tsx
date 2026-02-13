import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css'; // Mantenemos los estilos básicos de Vite

interface Product {
  id: string;
  name: string;
  price: number;
  category: {
    name: string;
    icon: string;
  };
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hacemos la petición GET protegida
    api.get('/products')
      .then(response => {
        console.log('Datos recibidos:', response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error cargando productos:', error);
        alert('Error: ¿Pegaste bien el Token en api.ts?');
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: '20px'}}>Cargando inventario... 🍺</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🍻 Panel del Dueño (Juan)</h1>
      <p>Inventario de "Bar La Cantina"</p>
      
      <div style={{ marginTop: '20px' }}>
        {products.length === 0 ? (
          <p>No hay productos.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {products.map((prod) => (
              <li 
                key={prod.id} 
                style={{ 
                  border: '1px solid #ccc', 
                  padding: '15px', 
                  marginBottom: '10px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <strong>{prod.name}</strong>
                  <br />
                  <small>{prod.category?.icon} {prod.category?.name}</small>
                </div>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  ${prod.price.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;