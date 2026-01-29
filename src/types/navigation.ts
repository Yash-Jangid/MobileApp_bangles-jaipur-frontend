export type RootStackParamList = {
  // Auth
  Login: undefined;
  SignUp: undefined;
  LoginNew: undefined;
  SignUpNew: undefined;
  ForgotPassword: undefined;
  VerifyOTP: { email: string };
  ResetPassword: { email: string; otp: string };

  // Main Tab
  Main: undefined;

  // Shop
  ProductDetails: { productId: string };
  CategoryProducts: { categoryId: string; categoryName: string };
  Collections: { categoryId?: string; maxPrice?: number };

  // Cart & Checkout
  Cart: undefined;
  Wishlist: undefined;
  Checkout: undefined;
  OrderSuccess: { orderId: string };

  // Orders
  Orders: undefined;
  OrderHistory: undefined;
  OrderDetails: { orderId: string };

  // Profile
  Profile: undefined;
  Notifications: undefined;

  // Legacy/Utility (Keep if needed for now, or remove if sure)
  WebView: { route: string; title: string };
};

export type TabParamList = {
  Home: undefined;
  Collections: undefined;
  Cart: undefined;
  Wishlist: undefined;
  Profile: undefined;
};

export type NavigationProp = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  replace: (screen: keyof RootStackParamList, params?: any) => void;
  reset: (options: any) => void;
};
