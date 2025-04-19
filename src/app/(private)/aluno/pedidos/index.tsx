import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

import { useUser } from '@clerk/clerk-expo'

const API = process.env.EXPO_PUBLIC_APIURL || 'http://localhost:3000';

export default function OrdersClient() {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser()

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/orders`); // Atualize com o endpoint real
            const result: DataItem[] = await response.json();
            setData(result);
        } catch (error) {
            console.error('Erro ao buscar dados: ', error);
        }
        setLoading(false);
    };

    const deletarPedidos = async (id: string) => {
        console.log(id)
        try {
            const response = await fetch(`${API}/ordes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchData(); // Atualiza lista após deletar
            } else {
                Alert.alert('Erro', 'Erro ao excluir pedido');
            }
        } catch (error) {
            console.error('Erro ao excluir pedido:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!user) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4B5563" />
            </View>
        );
    }

    const filteredData = data.filter(order => order.userEmail === user.primaryEmailAddress?.emailAddress);

    const renderItem = ({ item }: { item: DataItem }) => (
        <View style={styles.card}>
            <Text style={styles.infoText}>Cliente: {item.userName}</Text>
            <Text style={styles.infoText}>Status: {item.status}</Text>
            <Text style={styles.infoText}>Horário: {format(parseISO(item.createdAt), "dd/MM/yyyy 'às' HH:mm")}</Text>
            <Text style={styles.infoText}>
                {item.status === 'Concluído'
                    ? `Pronto ${format(parseISO(item.updatedAt), "dd/MM/yyyy 'às' HH:mm")}`
                    : 'Preparando...'}
            </Text>

            {item.items?.map(subItem => (
                <View key={subItem.id} style={styles.item}>
                    <Text style={styles.itemName}>{subItem.name}</Text>
                    <Text style={styles.itemDetails}>
                        Quantidade: {subItem.quantity} | Subtotal: R$ {(Number(subItem.subtotal).toFixed(2)).replace('.', ',')}
                    </Text>
                </View>
            ))}

            <Text style={styles.total}>Total: R$ {(Number(item.totalPrice).toFixed(2)).replace('.', ',')}</Text>

            <TouchableOpacity
                onPress={() => deletarPedidos(item.id)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Cancelar pedido</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#4B5563" />
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
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
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoText: {
        color: '#374151',
        marginBottom: 6,
    },
    item: {
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
        paddingBottom: 6,
        marginTop: 6,
    },
    itemName: {
        fontWeight: '600',
    },
    itemDetails: {
        fontSize: 12,
        color: '#6B7280',
    },
    total: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 12,
        backgroundColor: '#EF4444',
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
