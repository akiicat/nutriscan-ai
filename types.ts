
export type View = 'scan' | 'history' | 'detail';

export type HealthRating = 'GOOD' | 'MODERATE' | 'POOR' | 'NEUTRAL';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'zh-TW' | 'zh-CN' | 'ja';

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface Ingredient {
  name: string;
  rating: HealthRating;
  reason: string;
}

export interface FoodAnalysis {
  productName: string;
  price: string;
  summary: string;
  ingredients: Ingredient[];
}

export interface FoodItem {
  id: string;
  image: string; // base64 string
  analysis: FoodAnalysis;
  location: string;
  scanDate: string;
}

export interface TranslationDictionary {
  appTitle: string;
  scanTab: string;
  historyTab: string;
  scanTitle: string;
  scanSubtitle: string;
  uploadClick: string;
  uploadDrag: string;
  analyzing: string;
  analyzingDesc: string;
  historyTitle: string;
  historyEmpty: string;
  historyEmptyAction: string;
  detailSummary: string;
  detailIngredients: string;
  detailPrice: string;
  footer: string;
  analysisFailed: string;
  unknownError: string;
  textInputLabel: string;
  textInputPlaceholder: string;
  analyzeTextButton: string;
  orDivider: string;
  loginButton: string;
  logoutButton: string;
  welcomeUser: string;
}