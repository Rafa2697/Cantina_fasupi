import {View, Text} from "react-native"
import {useState, useEffect} from "react"

interface DataItem{
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

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API}`);
            const result: DataItem[] = await response.json();
            setData(result);
            console.log(result)
        } catch (error) {
            console.error('Error ao buscar dados: ', error)
        }
        setLoading(false)
    }
    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categoriaAlimentos");
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
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>Cardapio</Text>
        </View>
    )
}