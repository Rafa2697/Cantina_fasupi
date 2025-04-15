import { View, Text, StyleSheet, Button,} from "react-native";
import { useAuthContext } from '../../../hooks/useAuth';
import { router } from 'expo-router';

export default function index() {
    const { user, logout } = useAuthContext();;

    const signOut = async () => {
        try {
            await logout();
            router.replace("/(public)"); // Redireciona para a tela de cardapio
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    }

    return (
        
            <View style={styles.container}>
                <Text style={styles.title}>{user?.name}</Text>
                <Text style={styles.text}>Tela de Login do Administrador</Text>
                <Button title="Sair" onPress={signOut} />
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