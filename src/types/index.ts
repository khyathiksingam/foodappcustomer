export interface DeliveryAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  flat: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  avatar?: string;
  savedAddresses: DeliveryAddress[];
  walletBalance: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  minSelect: number;
  maxSelect: number;
  options: CustomizationOption[];
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isVeg: boolean;
  category: string;
  cuisine: string;
  image: string;
  rating: number;
  ratingCount: number;
  isBestseller?: boolean;
  isMustTry?: boolean;
  isSpicy?: boolean;
  customizationGroups?: CustomizationGroup[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisines: string[];
  rating: number;
  totalRatings: string;
  deliveryTimeMins: number;
  distanceKm: number;
  costForTwo: number;
  image: string;
  bannerImage: string;
  address: string;
  lat: number;
  lng: number;
  isVegOnly?: boolean;
  hasOffers?: boolean;
  discountBadge?: string;
  featured?: boolean;
  menu: Dish[];
}

export interface SelectedCustomization {
  groupId: string;
  groupTitle: string;
  selectedOptions: CustomizationOption[];
}

export interface CartItem {
  id: string;
  dish: Dish;
  quantity: number;
  customizations?: SelectedCustomization[];
  itemTotal: number;
  specialInstructions?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'partner_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  totalDeliveries: number;
  vehicleModel: string;
  vehiclePlate: string;
  currentLat: number;
  currentLng: number;
}

export interface Order {
  id: string;
  date: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantAddress: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  total: number;
  appliedCoupon?: Coupon;
  deliveryAddress: DeliveryAddress;
  deliveryInstructions?: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD';
  status: OrderStatus;
  statusTimestamps: {
    placed: string;
    accepted?: string;
    preparing?: string;
    partner_assigned?: string;
    out_for_delivery?: string;
    delivered?: string;
  };
  deliveryPartner?: DeliveryPartner;
  etaMinutes: number;
  restaurantRating?: number;
  partnerRating?: number;
  reviewComment?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'offer' | 'info';
  orderId?: string;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  time: string;
  quickActions?: string[];
}
