import { router, Slot } from "expo-router"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo"
import { useEffect } from "react"
import { ActivityIndicator } from "react-native"
import { TokenCache } from "@/storage/tokenCache"
import { Stack } from 'expo-router/stack';

const PUBLIC_CLERK = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (isSignedIn) {
      router.replace("(auth)")
    } else {
      router.replace("(public)")
    }

  }, [isSignedIn])


  return isLoaded ? (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(public)" />
      <Slot />
    </Stack>
  ) : (
    <ActivityIndicator style={{flex: 1, justifyContent:"center", alignItems:"center"}} />
  )
}

export default function RootLayout() {

  return (
    <ClerkProvider publishableKey={PUBLIC_CLERK} tokenCache={TokenCache}>
      <InitialLayout />
    </ClerkProvider>
  )
}