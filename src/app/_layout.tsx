import { Slot } from "expo-router"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { AuthProvider } from "@/contexts/AuthContext"
import { NotificationProvider } from "@/contexts/NotificationContext";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {

  return (

    <NotificationProvider>
      <ClerkProvider tokenCache={tokenCache} >
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ClerkProvider>
    </NotificationProvider>

  )
}