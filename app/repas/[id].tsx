import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Repas {
  id: string;
  nom: string;
  items: any[];
}

export default function DetailRepas() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [repas, setRepas] = useState<Repas | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRepasDetails = async () => {
      const storedRepas = await AsyncStorage.getItem("repas");
      const repasList: Repas[] = storedRepas ? JSON.parse(storedRepas) : [];

      const foundRepas = repasList.find((r) => r.id === id);
      setRepas(foundRepas || null);
      setLoading(false);
    };

    if (id) {
      loadRepasDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    const storedRepas = await AsyncStorage.getItem("repas");
    let repasList: Repas[] = storedRepas ? JSON.parse(storedRepas) : [];

    repasList = repasList.filter((r) => r.id !== id);

    await AsyncStorage.setItem("repas", JSON.stringify(repasList));
    router.push("/");
  };

  // Fonction pour calculer les calories totales
  const getTotalCalories = () => {
    if (!repas || !repas.items) return 0;
    return repas.items.reduce((total, item) => total + (item.calories || 0), 0);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!repas) {
    return (
      <View style={styles.container}>
        <Text>Repas non trouvé.</Text>
      </View>
    );
  }

  const totalCalories = getTotalCalories(); // Calcul des calories totales

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail du repas :</Text>
      <Text style={styles.label}>Nom : {repas.nom}</Text>

      {/* Affichage des calories totales */}
      <Text style={styles.totalCalories}>Calories totales : {totalCalories} kcal</Text>

      <FlatList
        data={repas.items}
        keyExtractor={(item, index) => item.nom + index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.nom}</Text>
            <Text style={styles.itemCalories}>{item.calories} kcal</Text>
          </View>
        )}
      />

      <Button title="Supprimer le repas" color="red" onPress={handleDelete} />
      <Button title="Retour" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#FF6347", // Couleur pour mettre en évidence les calories
  },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCalories: {
    fontSize: 14,
    color: '#555',
  },
});
