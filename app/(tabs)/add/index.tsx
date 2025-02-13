import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { fetchNutriments } from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AjouterRepas() {
  const [ingredient, setIngredient] = useState("");
  const [nutriments, setNutriments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const router = useRouter();
  const handleCancel = () => {
    setIngredient("");
    setNutriments([]);
    setSelectedItems([]);
    router.back();
  };
  const handleSearch = async (text: string) => {
    setIngredient(text);
    if (text.trim() === "") {
      setNutriments([]);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchNutriments(text);
      setNutriments(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des aliments :", error);
      Alert.alert("Erreur", "Impossible de charger les aliments.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddRepas = async () => {
    if (selectedItems.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un aliment.");
      return;
    }
  
    try {
      const existingRepas = await AsyncStorage.getItem("repas");
      const repasList = existingRepas ? JSON.parse(existingRepas) : [];
  
      const newRepas = {
        id: Date.now().toString(),
        nom: `Repas ${repasList.length + 1}`,
        items: selectedItems,
      };
  
      repasList.push(newRepas);
      await AsyncStorage.setItem("repas", JSON.stringify(repasList));
  
      Alert.alert("Succès", "Le repas a été ajouté !");
      setIngredient("");
      setNutriments([]);
      setSelectedItems([]);
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de l'ajout du repas :", error);
      Alert.alert("Erreur", "Impossible d'ajouter le repas.");
    }
  };
  

  const toggleSelection = (item: any) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.some((selectedItem) => selectedItem.nom === item.nom)) {
        return prevSelectedItems.filter((selectedItem) => selectedItem.nom !== item.nom);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un repas</Text>
      <TextInput
        style={styles.input}
        value={ingredient}
        onChangeText={handleSearch}
        placeholder="Rechercher un aliment..."
      />
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      <FlatList
        data={nutriments}
        keyExtractor={(item, index) => item.nom + index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.resultItem, selectedItems.some((i) => i.nom === item.nom) && styles.selectedItem]}
            onPress={() => toggleSelection(item)}
          >
            <View style={styles.textContainer}>
              <Text style={styles.resultName}>{item.nom}</Text>
              <Text style={styles.resultCalories}>{item.calories} kcal</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {selectedItems.length > 0 && (
        <View style={styles.selectedItemsContainer}>
          <Text style={styles.selectedTitle}>Aliments sélectionnés :</Text>
          <FlatList
            data={selectedItems}
            keyExtractor={(item, index) => item.nom + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.selectedItemContainer}>
                <Text style={styles.selectedItemText}>{item.nom}</Text>
                <TouchableOpacity onPress={() => toggleSelection(item)}>
                  <Text style={styles.deleteButton}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={handleAddRepas}>
        <Text style={styles.addButtonText}>Ajouter le repas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
  <Text style={styles.cancelButtonText}>Annuler</Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { width: "100%", padding: 12, borderColor: "#ddd", borderWidth: 1, borderRadius: 8, backgroundColor: "#f9f9f9", marginBottom: 15 },
  resultItem: { padding: 15, marginBottom: 8, backgroundColor: "#f0f0f0", borderRadius: 8, width: "100%" },
  selectedItem: { backgroundColor: "#d1e7ff" },
  textContainer: { flexDirection: "column" },
  resultName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  resultCalories: { fontSize: 14, color: "#666" },
  selectedItemsContainer: { marginTop: 20, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  selectedTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  selectedItemContainer: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  selectedItemText: { fontSize: 16, color: "#333" },
  deleteButton: { color: "red", fontSize: 18, fontWeight: "bold" },
  addButton: { backgroundColor: "#007bff", padding: 15, borderRadius: 30, alignItems: "center", marginTop: 20 },
  addButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  cancelButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 30, alignItems: "center", marginTop: 10 },
  cancelButtonText: { color: "black", fontSize: 16 },
});
