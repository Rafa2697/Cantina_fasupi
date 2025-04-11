
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Feather } from "@expo/vector-icons";
import { Redirect } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function LayoutCliente() {
  const { isSignedIn } = useAuth()
  
  return (
  
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Inicio",
              drawerIcon: ({ color }) => (
                <Feather name="home" size={24} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="loginAdmin"
            options={{
              drawerLabel: "LoginAdmin",
              drawerIcon: ({ color }) => (
                <Feather name="user" size={24} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="loginGoogle"
            options={{
              drawerLabel: "Login Google",
              drawerIcon: ({ color }) => (
                <Feather name="user" size={24} color={color} />
              ),
            }} />
        </Drawer>
      </GestureHandlerRootView>

  )
}