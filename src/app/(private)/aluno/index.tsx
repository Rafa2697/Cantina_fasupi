import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo'

interface DataItem {
    id: string;
    name: string;
    description: string;
    price: number;
    imagemURL: string;
    categoryId: string;
    isAvailable: boolean;
}

interface Category {
    id: string;
    name: string;
}

interface SelectedItem extends DataItem {
    quantity: number;
}

const API = process.env.EXPO_PUBLIC_APIURL || 'http://localhost:3000';

export default function CardapioClient() {
    const [data, setData] = useState<DataItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser()



    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API}/foods`);
            const result = await response.json();
            const sanitized = result.map((item: any) => ({
                ...item,
                price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
            }));
    
            setData(sanitized);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API}/categories`);
            const result = await response.json();
            setCategories(result);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const getCategoryName = (categoryId: string) => {
        if (categoryId === 'all') return 'Todos';
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    };

    const getUniqueCategories = () => {
        const uniqueCategoryIds = ['all', ...new Set(data.map(item => item.categoryId))];
        return uniqueCategoryIds;
    };

    const filteredItems = data.filter(item =>
        selectedCategory === 'all' ? true : item.categoryId === selectedCategory
    );

    const handleAddItem = (item: DataItem) => {
        if (!item.isAvailable) return;

        setSelectedItems(prev => {
            const existingItem = prev.find(i => i.id === item.id);
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const handleRemoveItem = (itemId: string) => {
        setSelectedItems(prev => prev.filter(item => item.id !== itemId));
    };

    const handleSubmitOrder = async () => {
        if (!user?.primaryEmailAddress) {
            alert('Você precisa estar logado para fazer o pedido')
            return;
        }

        try {
            const response = await fetch(`${API}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: selectedItems,
                    userEmail: user.primaryEmailAddress.emailAddress,
                    userName: user.fullName
                })
            });

            if (response.ok) {
                Alert.alert("Sucesso", "Pedido enviado com sucesso!");
                setSelectedItems([]);
            }
        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            Alert.alert("Erro", "Erro ao enviar pedido.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Selecione os itens para pedidos</Text>

            {/* Categorias */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
                {getUniqueCategories().map((categoryId) => (
                    <TouchableOpacity
                        key={categoryId}
                        style={[
                            styles.categoryButton,
                            selectedCategory === categoryId && styles.categoryButtonSelected,
                        ]}
                        onPress={() => setSelectedCategory(categoryId)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === categoryId && styles.categoryTextSelected,
                            ]}
                        >
                            {getCategoryName(categoryId)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Itens selecionados */}
            {selectedItems.length > 0 && (
                <View style={styles.selectedContainer}>
                    <Text style={styles.sectionTitle}>Itens Selecionados</Text>
                    {selectedItems.map(item => (
                        <View key={item.id} style={styles.selectedItem}>
                            <Text>{item.name} (x{item.quantity})</Text>
                            <Text style={{ fontWeight: 'bold' }}>
                                R$ {Number(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </Text>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemoveItem(item.id)}
                            >
                                <Text style={{ color: 'white' }}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Text style={styles.total}>
                        Total: R${selectedItems.reduce((acc, item) => acc + (Number(item?.price || 0) * (item?.quantity || 1)), 0).toFixed(2).replace('.', ',')}
                    </Text>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
                        <Text style={styles.submitText}>Enviar Pedido</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Lista de itens */}
            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            ) : (
                filteredItems.map(item => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <View style={styles.cardContent}>
                            <Text style={styles.description}>{item.description}</Text>
                            {item.imagemURL ? (
                                <Image source={{ uri: item.imagemURL }} style={styles.image} />
                            ) : null}
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={styles.price}>R$ {Number(item.price.toFixed(2).replace('.', ','))}</Text>
                            <View style={styles.availabilityContainer}>
                                <Text style={[
                                    styles.availability,
                                    { color: item.isAvailable ? 'green' : 'red' }
                                ]}>
                                    {item.isAvailable ? 'Disponível' : 'Indisponível'}
                                </Text>
                                {item.isAvailable && (
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => handleAddItem(item)}
                                    >
                                        <Text style={{ color: 'white' }}>Adicionar</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    categories: { marginBottom: 16 },
    categoryButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#ddd',
        borderRadius: 20,
        marginRight: 8,
    },
    categoryButtonSelected: {
        backgroundColor: '#3b82f6',
    },
    categoryText: {
        color: '#333',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    selectedContainer: {
        padding: 12,
        backgroundColor: '#f3f3f3',
        marginBottom: 20,
        borderRadius: 8,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    selectedItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    removeButton: {
        backgroundColor: 'red',
        padding: 6,
        borderRadius: 4,
    },
    total: { textAlign: 'center', marginTop: 8, fontWeight: 'bold' },
    submitButton: {
        backgroundColor: 'green',
        marginTop: 12,
        padding: 10,
        borderRadius: 6,
    },
    submitText: { color: '#fff', textAlign: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        elevation: 2,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    description: { flex: 1, marginRight: 8, color: '#666' },
    image: { width: 80, height: 80, borderRadius: 8 },
    cardFooter: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: { fontWeight: 'bold' },
    availabilityContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    availability: { marginRight: 10 },
    addButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
});
