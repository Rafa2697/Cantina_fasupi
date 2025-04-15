// /app/(auth)/index.tsx
import { useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { useAuthContext as useCustomAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { isAuthenticated, loading } = useCustomAuth();

  useEffect(() => {
    if (isLoaded && !loading) {
      if (isSignedIn) {
        router.replace("/(private)/aluno");
      } else if (isAuthenticated) {
        router.replace("/(private)/admin");
      } else {
        router.replace("/(public)");
      }
    }
  }, [isSignedIn, isLoaded, isAuthenticated, loading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
