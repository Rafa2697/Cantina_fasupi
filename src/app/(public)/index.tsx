import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useState, useEffect } from "react"
import { useNotification } from "@/contexts/NotificationContext";

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

const API = process.env.EXPO_PUBLIC_APIURL || 'http://localhost:3000';

export default function Index() {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<Category[]>([]);
    const { expoPushToken, notification, error } = useNotification();

    if(error) {
        return <Text>Erro ao buscar dados: {error.message}</Text>
    }

    console.log(notification, null, expoPushToken)

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API}/foods`);
            const result: DataItem[] = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error ao buscar dados: ', error)
        }
        setLoading(false)
    }
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API}/categories`);
            const result = await response.json();
            setCategories(result);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };
    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    // Função para obter o nome da categoria pelo ID
    const getCategoryName = (categoryId: string) => {
        if (categoryId === 'all') return 'Todos';
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : categoryId;
    };

    //função para obter categorias únicas
    const getUniqueCategories = () => {
        const uniqueCategoryIds = ['all', ...new Set(data.map(item => item.categoryId))];
        return uniqueCategoryIds;
    };

    //função para filtrar items
    const filteredItems = data.filter(item =>
        selectedCategory === 'all' ? true : item.categoryId === selectedCategory
    )

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {getUniqueCategories().map((categoryId) => (
                    <TouchableOpacity
                        key={categoryId}
                        onPress={() => setSelectedCategory(categoryId)}
                        style={[
                            styles.categoryButton,
                            selectedCategory === categoryId ? styles.categoryButtonActive : null
                        ]}
                    >
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === categoryId ? styles.categoryButtonTextActive : null
                        ]}>
                            {getCategoryName(categoryId)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <ScrollView style={styles.itemsContainer}>
                    {filteredItems.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                            <View style={styles.itemFooter}>
                                <View>
                                    <Text style={styles.itemPrice}>
                                        R$ {Number(item.price).toFixed(2).replace('.', ',')}
                                    </Text>
                                    <View style={[
                                        styles.availabilityBadge,
                                        item.isAvailable ? styles.availableBadge : styles.unavailableBadge
                                    ]}>
                                        <Text style={styles.availabilityText}>
                                            {item.isAvailable ? 'Disponível' : 'Indisponível'}
                                        </Text>
                                    </View>
                                </View>
                                {item.imagemURL && (
                                    <Image
                                        source={{ uri: item.imagemURL }}
                                        style={styles.itemImage}
                                    />
                                )}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );



}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    categoriesContainer: {
        marginBottom: 30,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#e2e2e2',
        marginRight: 8,
        height: 40,
    },
    categoryButtonActive: {
        backgroundColor: '#3b82f6',
    },
    categoryButtonText: {
        color: '#374151',
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemsContainer: {

    },
    itemCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemDescription: {
        color: '#666',
        marginTop: 8,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    availabilityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 4,
    },
    availableBadge: {
        backgroundColor: '#dcfce7',
    },
    unavailableBadge: {
        backgroundColor: '#fee2e2',
    },
    availabilityText: {
        fontSize: 12,
    },
    itemImage: {
        width: 96,
        height: 96,
        borderRadius: 4,
    },
});