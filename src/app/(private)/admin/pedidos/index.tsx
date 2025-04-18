import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { format, parseISO } from 'date-fns';

interface DataItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  status: string;
  totalPrice: string;
  items: {
    id: string;
    orderId: string;
    foodId: string;
    name: string;
    quantity: number;
    subtotal: string;
  }[];
}
const API = process.env.EXPO_PUBLIC_APIURL;

export default function OrdersReceived({ refreshTrigger }: { refreshTrigger: boolean }) {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/orderItems`);
      const result: DataItem[] = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erro ao buscar dados: ', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const updateStatus = async (orderId: string) => {
    const nowISOString = new Date().toISOString();
    try {
      const response = await fetch(`${API}/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status: 'Concluído',
          updatedAt: nowISOString,
        }),
      });
      if (response.ok) {
        setData(prevData =>
          prevData.map(order =>
            order.id === orderId ? { ...order, status: 'Concluído', updatedAt: nowISOString } : order
          )
        );
      } else {
        console.error('Erro ao atualizar o status do pedido');
      }
    } catch (error) {
      console.error('Erro ao enviar dados: ', error);
    }
  };

  const renderItem = ({ item: order }: { item: DataItem }) => (
    <View style={styles.card}>
      <Text style={styles.textSmall}>Cliente: {order.userName}</Text>
      <Text style={styles.textTiny}>Identificação: {order.userEmail}</Text>
      <Text style={styles.textSmall}>Status: {order.status}</Text>
      <Text style={styles.textSmall}>
        Horário do pedido: {format(parseISO(order.createdAt), "dd/MM/yyyy 'às' HH:mm")}
      </Text>
      <Text style={styles.textSmall}>
        Pedido concluído: {format(parseISO(order.updatedAt), "dd/MM/yyyy 'às' HH:mm")}
      </Text>

      {order.items.map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            Quantidade: {item.quantity} | Subtotal: R$ {Number(item.subtotal).toFixed(2).replace('.', ',')}
          </Text>
        </View>
      ))}

      <Text style={styles.totalPrice}>Total: R$ {Number(order.totalPrice).toFixed(2).replace('.', ',')}</Text>

      <TouchableOpacity
        style={[
          styles.button,
          order.status === 'Concluído' ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        onPress={() => updateStatus(order.id)}
        disabled={order.status === 'Concluído'}
      >
        <Text style={styles.buttonText}>
          {order.status === 'Concluído' ? 'Pedido Finalizado' : 'Finalizar Pedido'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  textSmall: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  textTiny: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 6,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemDetails: {
    fontSize: 12,
    color: '#666',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#22c55e',
  },
  buttonDisabled: {
    backgroundColor: '#d4d4d4',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
