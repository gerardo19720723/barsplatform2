import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

interface Order {
  id: string;
  tableNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { product: { name: string }; quantity: number }[];
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Cargar Pedidos
  const loadOrders = async () => {
    try {
      const response = await api.get('/orders');
      // Filtramos solo los que no están SERVIDOS (para limpiar la pantalla)
      const activeOrders = response.data.filter((o: Order) => o.status !== 'SERVED');
      setOrders(activeOrders);
    } catch (error) {
      console.error("Error cargando cocina", error);
    }
  };

  // Auto-Refresco cada 10 segundos (Simulación de tiempo real)
  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 30000); // 10s
    return () => clearInterval(interval);
  }, []);

  // Marcar como LISTO
  const markAsReady = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'READY' });
      loadOrders(); // Refrescar lista inmediatamente
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  // Agrupar por mesa
  const groupedByTable = orders.reduce((acc, order) => {
    if (!acc[order.tableNumber]) acc[order.tableNumber] = [];
    acc[order.tableNumber].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  if (orders.length === 0) return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial', color: '#555' }}>
      <h1>🍳 Cocina</h1>
      <p>Esperando pedidos...</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', background: '#f4f4f4', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>🍳 Pedidos Activos ({orders.length})</h1>
      
      {Object.entries(groupedByTable).map(([table, tableOrders]) => (
        <div key={table} style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#d35400', borderBottom: '2px solid #d35400', paddingBottom: '5px' }}>
            MESA {table}
          </h2>
          
          {tableOrders.map(order => (
            <div 
              key={order.id} 
              style={{ 
                background: order.status === 'READY' ? '#d4edda' : '#fff3cd', 
                border: `2px solid ${order.status === 'READY' ? '#28a745' : '#ffc107'}`,
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
                  {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                  Hace: {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min
                </div>
              </div>

              <button 
                onClick={() => markAsReady(order.id)}
                disabled={order.status === 'READY'}
                style={{
                  padding: '10px 20px',
                  background: order.status === 'READY' ? '#28a745' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: order.status === 'READY' ? 'default' : 'pointer'
                }}
              >
                {order.status === 'READY' ? '✅ LISTO' : 'MARCAR LISTO'}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;