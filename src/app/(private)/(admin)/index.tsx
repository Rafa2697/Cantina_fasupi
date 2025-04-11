import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Certifique-se de ter instalado este pacote
import { useNavigation } from "@react-navigation/native"; // Se estiver usando React Navigation
import { useAuth} from '@clerk/clerk-expo'
import { useState, useEffect } from 'react';
import useAuthAdm from '../../../hooks/useAuth'

export default function index() {
    const navigation = useNavigation();
    const { signOut } = useAuth()
    const { isAuthenticated, loading, logout } = useAuthAdm();


    const handleLogout = async () => {
        try {
            // Remove o token ou dados de autenticação armazenados
            await AsyncStorage.removeItem("@auth_token");
            signOut()
            // Redireciona para a tela de login
            navigation.navigate("(public)"); // Substitua "Login" pelo nome da sua tela de login
        } catch (error) {
            console.error("Erro ao deslogar:", error);
        }
    };
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigation.navigate('(Public)');
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin</Text>
            <Text style={styles.text}>Tela de Login do Administrador</Text>
            <Button title="Sair" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
    },
    text: {
        fontSize: 16,
        color: "#000",
    },
});