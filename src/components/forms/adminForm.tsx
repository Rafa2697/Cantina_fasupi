import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable, ActivityIndicator } from "react-native";
import { useState, useRef } from "react";
import {  router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const APIURL = process.env.EXPO_PUBLIC_APIURL as string;

export default function AdminForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [viewPassword, setViewPassword] = useState<boolean>(true);
    const passwordInputRef = useRef<any>(null);

    const saveToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('@auth_tokem', token);
        } catch (error) {
            console.error('Error ao salvar token:', error);
        }
    }

    function onViewPassword() {
        setViewPassword(!viewPassword);
    }

    const handleSubmit = async () => {
        setIsLoading(true);

        const logindata = {
            email: email,
            password: password,
        }
        try {
            const response = await fetch(`${APIURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logindata),
            })

            const data = await response.json();

            const isValidate = data.password === password;
            if (isValidate == false) {
                setIsLoading(false);
                Alert.alert('Erro de Login', 'Senha incorreta, tente novamente!');
            }

            if (isValidate == true) {
                // Salva o token
                if (data.token) {
                    await saveToken(data.token);
                }
                setIsLoading(false);
                router.navigate('/(private)/(admin)');
            } else {
                setIsLoading(false);
                Alert.alert('Erro de Login', data.error || 'Credenciais inválidas');
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Erro de Login', 'Não foi possível realizar o login. Verifique suas credenciais e tente novamente.');
            console.error(error);
        }
    }
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text: string) => setEmail(text)}
                value={email}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current.focus()}
            />
            <View style={styles.input}>
                <TextInput

                    placeholder="senha"
                    onChangeText={(text: string) => setPassword(text)}
                    value={password}
                    secureTextEntry={viewPassword}
                    ref={passwordInputRef}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                />
                <Pressable onPress={onViewPassword}>
                    {viewPassword == true && (<Feather name="eye" size={24} color="black" />)}
                    {viewPassword == false && (<Feather name="eye-off" size={24} color="black" />)}
                </Pressable>
            </View>
            <View style={{ width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.7}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '700', }} >Login</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    input: {
        width: "100%",
        borderColor: '#ccc',
        borderWidth: 2,
        height: 64,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#f0f8ff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        backgroundColor: "#000",
        padding: 22,
        borderRadius: 22,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});