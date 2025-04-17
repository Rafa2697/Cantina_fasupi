import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Button,
    TouchableOpacity,
    Alert,
    Switch,
    StyleSheet
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface DataItem {
    id: string;
    name: string;
    description: string;
    price: number;
    imagemURL: string;
    categoryId: string;
    isAvailable: boolean;
}

interface DataCategory {
    id: string;
    name: string;
}

const API = process.env.EXPO_PUBLIC_APIURL;

export default function CadastroItens() {
    const [data, setData] = useState<DataItem[]>([]);
    const [category, setCategory] = useState<DataCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imagemURL: '',
        categoryId: '',
        isAvailable: false
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/foods`);
            const result: DataItem[] = await response.json();
            setData(result);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
        setLoading(false);
    };

    const fetchDatacategory = async () => {
        try {
            const response = await fetch(`${API}/categories`);
            const resultCategory: DataCategory[] = await response.json();
            setCategory(resultCategory);
        } catch (error) {
            console.error("Erro ao solicitar categoria:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchDatacategory();
    }, []);

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const url = editingId
                ? `${API}/foods/${editingId}`  // PUT com ID na URL
                : `${API}/foods`;              // POST

            const dataToSend = {
                ...formData,
                price: parseFloat(formData.price)  // garantir que vai como número
            };

            const options = {
                method: editingId ? 'PUT' : 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend)
            };

            const response = await fetch(url, options);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                imagemURL: '',
                categoryId: '',
                isAvailable: false
            });
            fetchData();
            Alert.alert("Sucesso", editingId ? "Item atualizado!" : "Item cadastrado!");
        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            Alert.alert("Erro", "Não foi possível salvar o item.");
        }
    };


    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${API}/foods/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                
            });

            if (!response.ok) throw new Error(`Erro: ${response.status}`);
            fetchData();
            Alert.alert("Sucesso", "Item excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir o dado:", error);
            Alert.alert("Erro", "Erro ao excluir o item. Tente novamente.");
        }
    };

    const handleEdit = (item: DataItem) => {
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            imagemURL: item.imagemURL,
            categoryId: item.categoryId,
            isAvailable: item.isAvailable
        });
        setEditingId(item.id);
    };

    const getCategoryName = (categoryId: string) => {
        const foundCategory = category.find(cat => cat.id === categoryId);
        return foundCategory ? foundCategory.name : 'Categoria não encontrada';
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cadastrar Itens</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do Item"
                value={formData.name}
                onChangeText={text => handleChange('name', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={formData.description}
                onChangeText={text => handleChange('description', text)}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Preço"
                value={formData.price}
                onChangeText={text => handleChange('price', text)}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="URL da Imagem"
                value={formData.imagemURL}
                onChangeText={text => handleChange('imagemURL', text)}
            />

            <Text style={styles.label}>Categoria</Text>
            <Picker
                selectedValue={formData.categoryId}
                onValueChange={value => handleChange('categoryId', value)}
                style={styles.picker}
            >
                <Picker.Item label="Selecione uma categoria" value="" />
                {category.map(cat => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
                ))}
            </Picker>

            <View style={styles.switchContainer}>
                <Text>Disponível para venda</Text>
                <Switch
                    value={formData.isAvailable}
                    onValueChange={val => handleChange('isAvailable', val)}
                />
            </View>

            <Button title={editingId ? "Atualizar" : "Cadastrar"} onPress={handleSubmit} />

            <Text style={[styles.title, { marginTop: 30 }]}>Itens já cadastrados</Text>

            {loading ? (
                <Text>Carregando...</Text>
            ) : (
                data.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text>R$ {Number(item.price).toFixed(2).replace('.', ',')}</Text>
                        <Text>{item.description}</Text>
                        <Text>Categoria: {getCategoryName(item.categoryId)}</Text>
                        <Text style={{ color: item.isAvailable ? "green" : "red" }}>
                            {item.isAvailable ? "Ativo" : "Inativo"}
                        </Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                onPress={() => handleEdit(item)}
                                style={[styles.button, { backgroundColor: "#facc15" }]}
                            >
                                <Text style={styles.buttonText}>Editar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={[styles.button, { backgroundColor: "#ef4444" }]}
                            >
                                <Text style={styles.buttonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12
    },
    label: {
        marginBottom: 4
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 12
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },
    itemCard: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between'
    },
    button: {
        padding: 10,
        borderRadius: 6,
        marginHorizontal: 4
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600"
    }
});
