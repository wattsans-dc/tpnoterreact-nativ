const EDAMAM_APP_ID = "7fe32169";
const EDAMAM_APP_KEY = "0fdebb8fe5403c15564a867a25a3d790";

const BASE_URL = "https://api.edamam.com/api/food-database/v2/parser";

export const fetchNutriments = async (ingredient: string) => {
  try {
    const url = `${BASE_URL}?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(ingredient)}`;
    console.log('URL de la requête:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    console.log('Réponse de l\'API:', data); 

    if (!data.hints || data.hints.length === 0) {
      return [];
    }

    const filteredData = data.hints
      .map((item: any) => ({
        nom: item.food.label,
        calories: item.food.nutrients.ENERC_KCAL || 0, 
        image: item.food.image || 'https://via.placeholder.com/50', 
      }))
      .filter((item: { nom: string; }) =>
        item.nom.toLowerCase().startsWith(ingredient.toLowerCase())
      )
      .slice(0, 5);

    return filteredData;
  } catch (error) {
    console.error("Erreur API Edamam:", error);
    return []; 
  }
};
