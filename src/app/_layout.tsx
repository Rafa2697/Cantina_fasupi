import { router, Slot } from "expo-router"
import { ClerkProvider, useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { AuthProvider } from "@/contexts/AuthContext"
import { useAuthContext } from "@/hooks/useAuth"

function InitialLayout() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { isAuthenticated, loading } = useAuthContext();
  const [hasNavigated, setHasNavigated] = useState(false);


  useEffect(() => {
    if ((isLoaded || !loading) && !hasNavigated) {
      setHasNavigated(true);

      if (isSignedIn) {
        router.replace("/(private)/aluno");
      } else if (isAuthenticated) {
        router.replace("/(private)/admin");
      } else {
        router.replace("/(public)");
      }
    }
  }, [isLoaded, isSignedIn, isAuthenticated, loading]);

  if (!isLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <Slot />
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} >
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ClerkProvider>
  )
}