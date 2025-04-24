import { Slot } from "expo-router"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { AuthProvider } from "@/contexts/AuthContext"


export default function RootLayout() {

  return (
    <ClerkProvider tokenCache={tokenCache} >
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ClerkProvider>
  )
}