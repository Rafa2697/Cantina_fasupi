import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { useAuthContext } from '../../../hooks/useAuth';


export default function index() {
    const { user, logout } = useAuthContext();;

    return (
        
            <View style={styles.container}>
                <Text style={styles.title}>{user?.name}</Text>
                <Text style={styles.text}>Tela de Login do Administrador</Text>
                <Button title="Sair" onPress={logout} />
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