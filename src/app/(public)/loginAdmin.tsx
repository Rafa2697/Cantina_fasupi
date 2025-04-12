import { View, Text, StyleSheet } from "react-native"
import  AdminForm  from "../../components/forms/adminForm"
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function SignAdmin() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }
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