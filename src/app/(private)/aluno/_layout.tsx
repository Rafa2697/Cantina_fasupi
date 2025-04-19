
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Feather } from "@expo/vector-icons";
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth, useUser } from '@clerk/clerk-expo'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';

export default function LayoutAluno() {
    const { user } = useUser()
    const { signOut } = useAuth()

    const signOutAluno = async () => {
        try {
            await signOut()
            router.replace("/(public)")

        } catch (error) {
            console.error("Erro ao fazer logout: ", error)
        }
    }

    const CustomDrawerContent = (props: any) => (
        <DrawerContentScrollView {...props}>
            {user && (
                <View style={{ padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                    <Image
                        source={{ uri: user.imageUrl }}
                        style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 10 }}
                    />
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{user.fullName}</Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>{user.primaryEmailAddress?.emailAddress}</Text>
                </View>
            )}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );

    return (

        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>

                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: "Menu",
                        title: "Menu",
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
                            signOutAluno(); // Chama a função de logout
                        },
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>

    )
}