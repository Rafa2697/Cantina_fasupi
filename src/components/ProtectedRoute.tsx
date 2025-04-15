import { useAuthContext } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/(public)');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return <>{children}</>;
};
