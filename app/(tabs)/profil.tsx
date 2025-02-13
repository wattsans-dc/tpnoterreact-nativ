import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import { useUser, useClerk } from "@clerk/clerk-expo";

export default function Profil() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {isSignedIn && user ? (
        <>
          <Text style={styles.nom}>{user.fullName}</Text>
          <Text style={styles.email}>{user.primaryEmailAddress?.emailAddress}</Text>
          <Button title="Déconnexion" onPress={() => signOut()} />
        </>
      ) : (
        <Text style={styles.erreur}>Utilisateur non connecté</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  nom: { fontSize: 20, fontWeight: "bold" },
  email: { fontSize: 16, color: "#555" },
  erreur: { fontSize: 16, color: "red" },
});
