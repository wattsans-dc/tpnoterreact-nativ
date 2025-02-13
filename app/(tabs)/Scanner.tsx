import React, { useState, useEffect } from 'react';
import { View, Text, Alert, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { CameraView } from 'expo-camera'; 
import { fetchNutriments } from '@/services/api'; 

export default function BarcodeScannerScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false); 
  const [isScanning, setIsScanning] = useState(false);
  const [scanTimeout, setScanTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    if (scanned) return; 
  
    setScanned(true); 
  
    console.log('Code-barres scanné:', data); 
  
    try {
      console.log('Envoi à l\'API:', data);
  
      const nutrients = await fetchNutriments(data);
      if (nutrients && nutrients.length > 0) {
        console.log('Nutriments trouvés:', nutrients);
        navigation.navigate('Results', { nutrients });
      } else {
        Alert.alert('Erreur', 'Aucun nutriment trouvé pour cet ingrédient.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération des nutriments.');
    }
  
    if (scanTimeout) {
      clearTimeout(scanTimeout); 
    }
  
    const timeout = setTimeout(() => {
      setScanned(false);
    }, 10000);
  
    setScanTimeout(timeout);
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scanTimeout) {
      clearTimeout(scanTimeout);
    }
    setScanned(false); 
  };

  if (hasPermission === null) {
    return <Text>Demande de permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Aucune permission pour utiliser l'appareil photo.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Button title="Commencer à scanner" onPress={startScanning} />
      {isScanning && (
        <CameraView
          style={{ flex: 1 }}
          onBarcodeScanned={handleBarCodeScanned} 
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 18 }}>Scannez un code-barres</Text>
            <Button title="Arrêter le scan" onPress={stopScanning} />
          </View>
        </CameraView>
      )}
    </View>
  );
}
