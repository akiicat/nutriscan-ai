
import { db, storage } from './firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FoodItem } from '../types';

export const uploadImage = async (userId: string, file: File): Promise<string> => {
  try {
    const timestamp = Date.now();
    // Sanitize filename to avoid issues
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    
    // Create a storage reference: users/{userId}/{fileName}
    const storageRef = ref(storage, `users/${userId}/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const saveFoodToDb = async (userId: string, foodItem: FoodItem) => {
  try {
    // Save to Firestore: users/{userId}/foods/{foodId}
    const foodRef = doc(db, `users/${userId}/foods`, foodItem.id);
    await setDoc(foodRef, foodItem);
  } catch (error) {
    console.error("Error saving food item:", error);
    throw error;
  }
};

export const deleteFoodFromDb = async (userId: string, foodId: string) => {
  try {
    const foodRef = doc(db, `users/${userId}/foods`, foodId);
    await deleteDoc(foodRef);
  } catch (error) {
    console.error("Error deleting food item:", error);
    throw error;
  }
};

export const getFoodHistory = async (userId: string): Promise<FoodItem[]> => {
  try {
    const foodsRef = collection(db, `users/${userId}/foods`);
    const q = query(foodsRef, orderBy('scanDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as FoodItem);
  } catch (error) {
    console.error("Error fetching food history:", error);
    return [];
  }
};
