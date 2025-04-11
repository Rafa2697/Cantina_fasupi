import { router, Slot } from "expo-router"
import { ClerkProvider, useAuth } from "@clerk/clerk-expo"
import { useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { tokenCache } from '@clerk/clerk-expo/token-cache'

function InitialLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  const [hasNavigated, setHasNavigated] = useState(false)

  useEffect(() => {
    if (isLoaded && !hasNavigated) {
      setHasNavigated(true)
      if (!isSignedIn) {
        router.replace("/(public)")
      }else {
        router.replace("/(private)/(aluno)")
      }
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return <Slot/>
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} >
      <InitialLayout />
    </ClerkProvider>
  )
}