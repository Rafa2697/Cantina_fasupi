
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Feather } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuthContext } from '@/hooks/useAuth';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function LayoutAdmin() {
    const {logout} = useAuthContext();

    const signOut = async () => {
        try {
            await logout()
            router.replace("/(public)")
            
        } catch (error) {
            console.error("Erro ao fazer logout: ", error)
        }
    }

    return (

        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer>
                <Drawer.Screen
                    name="cadastroFoods/index"
                    options={{
                        drawerLabel: "Cadastro",
                        title: "Cadastro",
                        drawerIcon: ({ color }) => (
                            <AntDesign name="form" size={24} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="pedidos/index"
                    options={{
                        drawerLabel: "Pedidos",
                        title: "Pedidos",
                        drawerIcon: ({ color }) => (
                            <MaterialCommunityIcons name="food" size={24} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="logout"
                    options={{
                        drawerLabel: "Sair",
                        title: "Sair",
                        drawerIcon: ({ color }) => (
                            <Feather name="log-out" size={24} color={color} />
                        ),
                        drawerItemStyle: { display: 'flex' }, // Garante que o item seja visível
                    }}
                    listeners={{
                        drawerItemPress: (e) => {
                            e.preventDefault(); // Impede a navegação padrão
                            signOut(); // Chama a função de logout
                        },
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>

    )
}