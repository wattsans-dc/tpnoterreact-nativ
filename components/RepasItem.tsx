import { View, Text, StyleSheet } from 'react-native';

type RepasProps = {
  repas: {
    id: string;
    nom: string;
    items: any[];
  };
};

export default function RepasItem({ repas }: RepasProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.nom}>{repas.nom}</Text>
      <Text style={styles.calories}>{repas.items.length} items</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calories: {
    fontSize: 14,
    color: '#555',
  },
});
