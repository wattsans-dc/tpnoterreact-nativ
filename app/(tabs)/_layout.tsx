import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Tabs } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function TabsLayout() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && isMounted) {
      if (!user) {
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isLoaded, user, isMounted, router]);

  if (!isLoaded || !isMounted) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Accueil" }} />
      <Tabs.Screen name="profil" options={{ title: "Profil" }} />
    </Tabs>
  );
}
