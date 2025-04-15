import { View, Text, StyleSheet } from "react-native"
export default function CadastroFood() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin</Text>
            <Text style={styles.text}>Tela de cadastro de alimentos</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 32,
        justifyContent:"center",
        alignItems:"center",
        gap:12
    },
    title:{
        fontSize: 24,
        fontWeight: "bold",
        color:"#000"
    },
    text:{
        fontSize: 16,
        color:"#000"
    }
})