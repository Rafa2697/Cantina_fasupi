import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function useAuthAdm() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('@auth_token');
            setIsAuthenticated(!!token);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@auth_token');
            setIsAuthenticated(false);
            router.replace('/(public)');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return { isAuthenticated, loading, logout };
}

export const useAuthContext = () => useContext(AuthContext);