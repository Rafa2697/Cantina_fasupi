import { View, Text, StyleSheet } from "react-native"
import  AdminForm  from "../../components/forms/adminForm"

export default function SignAdmin() {

   
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign In Administrador</Text>
            <AdminForm />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#f0f0f0',
    },
    wraperView:{
        width: "90%",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
})