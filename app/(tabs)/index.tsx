import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";

interface Repas {
  id: string;
  nom: string;
  items: any[];
}

export default function Accueil() {
  const [repas, setRepas] = useState<Repas[]>([]);
  const router = useRouter();

  const loadRepas = async () => {
    try {
      const storedRepas = await AsyncStorage.getItem("repas");
      if (storedRepas) {
        setRepas(JSON.parse(storedRepas));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des repas :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRepas();
    }, [])
  );

  const navigateToAdd = () => {
    router.push("/add");
  };

  const navigateToDetail = (repasId: string) => {
    router.push(`/repas/${repasId}`);
  };

  // Fonction pour calculer les calories totales de tous les repas
  const getTotalCalories = () => {
    return repas.reduce((total, meal) => {
      const mealCalories = meal.items.reduce((mealTotal, item) => mealTotal + (item.calories || 0), 0);
      return total + mealCalories;
    }, 0);
  };

  const totalCalories = getTotalCalories(); // Calcul des calories totales de tous les repas

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des repas :</Text>

      {/* Affichage des calories totales */}
      <Text style={styles.totalCalories}>Calories totales : {totalCalories} kcal</Text>

      <FlatList
        data={repas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToDetail(item.id)}>
            <Text style={styles.repasName}>{item.nom}</Text>
            <View style={styles.iconContainer}>
              <Icon name="eye" size={24} color="blue" />
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={navigateToAdd}>
        <Text style={styles.addButtonText}>Ajouter un repas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  totalCalories: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#FF6347", // Couleur pour mettre en évidence les calories
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  iconContainer: {
    marginLeft: 10,
  },
  repasName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -70 }],
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
