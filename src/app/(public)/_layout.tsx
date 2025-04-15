
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Feather } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LayoutCliente() {
  
  return (
  
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Cardapio",
              title: "Cardapio",
              drawerIcon: ({ color }) => (
                <MaterialIcons name="menu-book" size={24} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="loginAdmin"
            options={{
              drawerLabel: "Login Administrador",
              title: "Login Administrador",
              drawerIcon: ({ color }) => (
                <MaterialIcons name="admin-panel-settings" size={24} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="loginGoogle"
            options={{
              drawerLabel: "Login Alunos",
              title: "Login Alunos",
              drawerIcon: ({ color }) => (
                <Feather name="users" size={24} color={color} />
              ),
            }} />
        </Drawer>
      </GestureHandlerRootView>

  )
}