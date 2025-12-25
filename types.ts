
export type View = 'scan' | 'history' | 'detail' | 'pricing';

export type HealthRating = 'GOOD' | 'MODERATE' | 'POOR' | 'NEUTRAL';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'zh-TW' | 'zh-CN' | 'ja';

export type UserTier = 'guest' | 'free' | 'starter' | 'pro' | 'enterprise';

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  tier: UserTier;
  scanCount: number;
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
  pricingTab: string;
  scanTitle: string;
  scanSubtitle: string;
  analysisLanguageLabel: string;
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
  guestLoginButton: string;
  logoutButton: string;
  welcomeUser: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  signInAction: string;
  signUpAction: string;
  switchToString: string;
  switchToSignIn: string;
  deleteButton: string;
  deleteConfirm: string;
  cancelButton: string;
  shareButton: string;
  shareModalTitle: string;
  copyLink: string;
  copied: string;
  shareVia: string;
  rescanButton: string;
  // Home Page
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeGetStarted: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  backToHome: string;
  // Pricing & Restrictions
  guestRestrictionTitle: string;
  guestRestrictionDesc: string;
  loginToScan: string;
  currentPlan: string;
  upgradeAction: string;
  planFree: string;
  planStarter: string;
  planPro: string;
  planEnterprise: string;
  perMonth: string;
  contactUs: string;
  features: string;
  scansPerMonth: string;
  publicData: string;
  prioritySupport: string;
  unlimitedScans: string;
  customSolutions: string;
}
