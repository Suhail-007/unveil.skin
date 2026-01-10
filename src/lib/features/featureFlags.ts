export interface FeatureFlags {
  // Commerce Features
  showPricing: boolean;
  enableCart: boolean;
  enableCheckout: boolean;
  enableOrders: boolean;
  
  // Product Features
  showProductDetails: boolean;
  enableProductReviews: boolean;
  enableWishlist: boolean;
  
  // Content Features
  showBenefits: boolean;
  showHowToUse: boolean;
  showDermatologistNotes: boolean;
  showContentMarkdown: boolean;
  
  // User Features
  enableUserAccounts: boolean;
  enableGuestCheckout: boolean;
  
  // Marketing Features
  showWaitlist: boolean;
  enableNewsletterSignup: boolean;
  showPromotion: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Commerce Features
  showPricing: true,
  enableCart: true,
  enableCheckout: true,
  enableOrders: true,
  
  // Product Features
  showProductDetails: true,
  enableProductReviews: false,
  enableWishlist: false,
  
  // Content Features
  showBenefits: true,
  showHowToUse: true,
  showDermatologistNotes: true,
  showContentMarkdown: true,
  
  // User Features
  enableUserAccounts: true,
  enableGuestCheckout: false,
  
  // Marketing Features
  showWaitlist: true,
  enableNewsletterSignup: true,
  showPromotion: false,
};

// Feature flag descriptions for admin UI
export const FEATURE_FLAG_DESCRIPTIONS: Record<keyof FeatureFlags, string> = {
  // Commerce Features
  showPricing: "Display product prices throughout the site",
  enableCart: "Enable shopping cart functionality",
  enableCheckout: "Allow users to proceed to checkout",
  enableOrders: "Enable order placement and tracking",
  
  // Product Features
  showProductDetails: "Show detailed product information",
  enableProductReviews: "Allow customers to review products",
  enableWishlist: "Enable product wishlist/favorites",
  
  // Content Features
  showBenefits: "Display product benefits section",
  showHowToUse: "Show how to use instructions",
  showDermatologistNotes: "Display dermatologist notes and recommendations",
  showContentMarkdown: "Show additional markdown content sections",
  
  // User Features
  enableUserAccounts: "Allow user registration and login",
  enableGuestCheckout: "Allow checkout without creating an account",
  
  // Marketing Features
  showWaitlist: "Display waitlist signup form",
  enableNewsletterSignup: "Show newsletter subscription options",
  showPromotion: "Display promotional banners and offers",
};

export const FEATURE_FLAG_CATEGORIES = {
  commerce: ['showPricing', 'enableCart', 'enableCheckout', 'enableOrders'],
  product: ['showProductDetails', 'enableProductReviews', 'enableWishlist'],
  content: ['showBenefits', 'showHowToUse', 'showDermatologistNotes', 'showContentMarkdown'],
  user: ['enableUserAccounts', 'enableGuestCheckout'],
  marketing: ['showWaitlist', 'enableNewsletterSignup', 'showPromotion'],
} as const;
