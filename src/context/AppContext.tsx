import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type {
  User,
  DeliveryAddress,
  Restaurant,
  Dish,
  CartItem,
  Coupon,
  Order,
  OrderStatus,
  DeliveryPartner,
  NotificationItem,
  SelectedCustomization,
} from '../types';
import { RESTAURANTS, INITIAL_ADDRESSES, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { AVAILABLE_COUPONS } from '../data/coupons';

const MOCK_PARTNERS: DeliveryPartner[] = [
  {
    id: 'dp-1',
    name: 'Rahul Sharma',
    phone: '+91 98765 12340',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    rating: 4.9,
    totalDeliveries: 1420,
    vehicleModel: 'Honda Activa 6G (Electric Blue)',
    vehiclePlate: 'KA 03 EX 4892',
    currentLat: 12.9725,
    currentLng: 77.6425,
  },
  {
    id: 'dp-2',
    name: 'Vikram Singh',
    phone: '+91 98765 54321',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 4.8,
    totalDeliveries: 980,
    vehicleModel: 'Ather 450X (Matte Grey)',
    vehiclePlate: 'KA 01 MR 7731',
    currentLat: 12.9730,
    currentLng: 77.6430,
  },
];

interface AppContextType {
  user: User | null;
  login: (phone: string, name: string, email: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  walletBalance: number;
  addWalletMoney: (amount: number) => void;

  addresses: DeliveryAddress[];
  activeAddress: DeliveryAddress;
  setActiveAddress: (address: DeliveryAddress) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  detectGpsLocation: () => Promise<boolean>;

  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (r: Restaurant | null) => void;

  cart: CartItem[];
  cartRestaurantId: string | null;
  cartRestaurant: Restaurant | null;
  addToCart: (
    dish: Dish,
    quantity?: number,
    customizations?: SelectedCustomization[],
    specialInstructions?: string
  ) => { success: boolean; conflict?: boolean; currentRestName?: string };
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  cartSubtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  deliveryInstructions: string;
  setDeliveryInstructions: (inst: string) => void;
  cookingInstructions: string;
  setCookingInstructions: (inst: string) => void;

  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD') => Promise<Order>;
  advanceOrderStatus: (orderId: string, targetStatus?: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  rateOrder: (orderId: string, restRating: number, partnerRating: number, comment?: string) => void;
  reorder: (order: Order) => boolean;

  favorites: { restaurantIds: string[]; dishIds: string[] };
  toggleFavoriteRestaurant: (id: string) => void;
  toggleFavoriteDish: (id: string) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotifCount: number;

  theme: 'light' | 'dark';
  toggleTheme: () => void;
  vegOnlyFilter: boolean;
  setVegOnlyFilter: (val: boolean | ((prev: boolean) => boolean)) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isLiveTrackingOpen: boolean;
  setIsLiveTrackingOpen: (open: boolean) => void;
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (open: boolean) => void;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (open: boolean) => void;
  isSupportOpen: boolean;
  setIsSupportOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isPartnerCallOpen: boolean;
  setIsPartnerCallOpen: (open: boolean) => void;
  isPartnerChatOpen: boolean;
  setIsPartnerChatOpen: (open: boolean) => void;
  isRatingModalOpen: boolean;
  setIsRatingModalOpen: (open: boolean) => void;
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  orderToRate: Order | null;
  setOrderToRate: (order: Order | null) => void;
  customizingDish: Dish | null;
  setCustomizingDish: (dish: Dish | null) => void;
  conflictModalData: {
    pendingDish: Dish;
    pendingCustomizations?: SelectedCustomization[];
    currentRestName: string;
  } | null;
  setConflictModalData: (data: any) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User State
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cravewave_user');
      return saved
        ? JSON.parse(saved)
        : {
            id: 'usr-default',
            name: 'Khyati Sharma',
            phone: '+91 98765 43210',
            email: 'khyati.sharma@example.com',
            walletBalance: 450,
            savedAddresses: INITIAL_ADDRESSES,
          };
    } catch {
      return null;
    }
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => user?.walletBalance || 450);

  // 2. Addresses State
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    try {
      const saved = localStorage.getItem('cravewave_addresses');
      return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
    } catch {
      return INITIAL_ADDRESSES;
    }
  });

  const [activeAddress, setActiveAddress] = useState<DeliveryAddress>(() => addresses[0] || INITIAL_ADDRESSES[0]);

  // 3. Restaurants State
  const [restaurants] = useState<Restaurant[]>(RESTAURANTS);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // 4. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cravewave_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>('Leave at door');
  const [cookingInstructions, setCookingInstructions] = useState<string>('');

  // 5. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('cravewave_orders');
      if (saved) return JSON.parse(saved);
    } catch {}

    // Seed a past completed order so Order History is rich right away
    const initialPastOrder: Order = {
      id: 'CW-84920',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      restaurantId: 'rest-2',
      restaurantName: 'Crust & Craft Artisanal Pizza',
      restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
      restaurantAddress: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
      items: [
        {
          id: 'past-1',
          dish: RESTAURANTS[1].menu[0],
          quantity: 1,
          itemTotal: 449,
        },
        {
          id: 'past-2',
          dish: RESTAURANTS[1].menu[4],
          quantity: 1,
          itemTotal: 229,
        },
      ],
      subtotal: 678,
      deliveryFee: 0,
      platformFee: 5,
      taxes: 34,
      discount: 100,
      total: 617,
      appliedCoupon: AVAILABLE_COUPONS[1],
      deliveryAddress: INITIAL_ADDRESSES[0],
      deliveryInstructions: 'Leave with security guard',
      paymentMethod: 'UPI',
      status: 'delivered',
      statusTimestamps: {
        placed: 'Yesterday, 8:15 PM',
        accepted: 'Yesterday, 8:17 PM',
        preparing: 'Yesterday, 8:22 PM',
        partner_assigned: 'Yesterday, 8:28 PM',
        out_for_delivery: 'Yesterday, 8:36 PM',
        delivered: 'Yesterday, 8:51 PM',
      },
      deliveryPartner: MOCK_PARTNERS[0],
      etaMinutes: 0,
      restaurantRating: 5,
      partnerRating: 5,
      reviewComment: 'Wood-fired crust was crispy and hot! Super fast delivery.',
    };

    return [initialPastOrder];
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // 6. Favorites
  const [favorites, setFavorites] = useState<{ restaurantIds: string[]; dishIds: string[] }>(() => {
    try {
      const saved = localStorage.getItem('cravewave_favs');
      return saved ? JSON.parse(saved) : { restaurantIds: ['rest-1', 'rest-2'], dishIds: ['dish-101', 'dish-201'] };
    } catch {
      return { restaurantIds: ['rest-1', 'rest-2'], dishIds: ['dish-101', 'dish-201'] };
    }
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('cravewave_notifs');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // 8. App UI / Filters
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('cravewave_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });
  const [vegOnlyFilter, setVegOnlyFilter] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 9. Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPartnerCallOpen, setIsPartnerCallOpen] = useState(false);
  const [isPartnerChatOpen, setIsPartnerChatOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [orderToRate, setOrderToRate] = useState<Order | null>(null);
  const [customizingDish, setCustomizingDish] = useState<Dish | null>(null);
  const [conflictModalData, setConflictModalData] = useState<{
    pendingDish: Dish;
    pendingCustomizations?: SelectedCustomization[];
    currentRestName: string;
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (user) localStorage.setItem('cravewave_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cravewave_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('cravewave_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cravewave_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cravewave_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cravewave_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cravewave_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auth functions
  const login = useCallback((phone: string, name: string, email: string) => {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      phone,
      name: name.trim() || 'Foodie Explorer',
      email: email.trim() || 'foodie@cravewave.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      walletBalance: 350,
      savedAddresses: addresses,
    };
    setUser(newUser);
    setWalletBalance(newUser.walletBalance);
    setIsAuthModalOpen(false);

    // Welcome notification
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Welcome to CraveWave, ${newUser.name}! 🚀`,
        message: 'Your account is ready. Enjoy ₹350 in your CraveWave wallet & explore delicious dining!',
        time: 'Just now',
        isRead: false,
        type: 'info',
      },
      ...prev,
    ]);
  }, [addresses]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cravewave_user');
  }, []);

  const updateProfile = useCallback((name: string, email: string) => {
    if (!user) return;
    setUser({ ...user, name, email });
  }, [user]);

  const addWalletMoney = useCallback((amount: number) => {
    setWalletBalance((prev) => {
      const next = prev + amount;
      if (user) setUser({ ...user, walletBalance: next });
      return next;
    });
  }, [user]);

  // Address functions
  const addAddress = useCallback((addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: 'addr-' + Date.now(),
    };
    setAddresses((prev) => [newAddr, ...prev]);
    setActiveAddress(newAddr);
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const detectGpsLocation = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const newAddr: DeliveryAddress = {
              id: 'gps-' + Date.now(),
              type: 'Other',
              name: 'GPS Current Location',
              flat: 'Near You (Live GPS Pin)',
              area: '100 Feet Road, Indiranagar',
              city: 'Bengaluru',
              pincode: '560038',
              phone: user?.phone || '+91 98765 43210',
              isDefault: true,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            setAddresses((prev) => [newAddr, ...prev]);
            setActiveAddress(newAddr);
            resolve(true);
          },
          () => {
            // fallback
            const fallbackAddr: DeliveryAddress = {
              id: 'gps-fb-' + Date.now(),
              type: 'Home',
              name: 'Detected Location',
              flat: 'Indiranagar 100ft Hub',
              area: 'HAL 2nd Stage, Indiranagar',
              city: 'Bengaluru',
              pincode: '560038',
              phone: user?.phone || '+91 98765 43210',
              isDefault: true,
              lat: 12.9719,
              lng: 77.6412,
            };
            setActiveAddress(fallbackAddr);
            resolve(true);
          },
          { timeout: 5000 }
        );
      } else {
        resolve(false);
      }
    });
  }, [user]);

  // Cart calculations
  const cartRestaurantId = useMemo(() => {
    return cart.length > 0 ? cart[0].dish.restaurantId : null;
  }, [cart]);

  const cartRestaurant = useMemo(() => {
    if (!cartRestaurantId) return null;
    return restaurants.find((r) => r.id === cartRestaurantId) || null;
  }, [cartRestaurantId, restaurants]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotal * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (appliedCoupon?.code === 'FREEDEL') return 0;
    return cartSubtotal >= 299 ? 0 : 35;
  }, [cartSubtotal, appliedCoupon]);

  const platformFee = useMemo(() => (cartSubtotal > 0 ? 5 : 0), [cartSubtotal]);

  const taxes = useMemo(() => {
    return Math.round(cartSubtotal * 0.05); // 5% GST
  }, [cartSubtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal < appliedCoupon.minOrderValue) return 0;
    if (appliedCoupon.discountType === 'flat') {
      return appliedCoupon.discountValue;
    } else {
      const raw = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      return appliedCoupon.maxDiscount ? Math.min(raw, appliedCoupon.maxDiscount) : raw;
    }
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    const gross = cartSubtotal + deliveryFee + platformFee + taxes - discount;
    return Math.max(0, gross);
  }, [cartSubtotal, deliveryFee, platformFee, taxes, discount]);

  // Cart Actions
  const addToCart = useCallback(
    (
      dish: Dish,
      quantity = 1,
      customizations?: SelectedCustomization[],
      specialInstructions?: string
    ) => {
      // Check multi-restaurant conflict
      if (cart.length > 0 && cart[0].dish.restaurantId !== dish.restaurantId) {
        const currentRest = restaurants.find((r) => r.id === cart[0].dish.restaurantId);
        setConflictModalData({
          pendingDish: dish,
          pendingCustomizations: customizations,
          currentRestName: currentRest?.name || 'another restaurant',
        });
        return {
          success: false,
          conflict: true,
          currentRestName: currentRest?.name || 'another restaurant',
        };
      }

      // Calculate unit price with customizations
      let extra = 0;
      if (customizations) {
        for (const g of customizations) {
          for (const opt of g.selectedOptions) {
            extra += opt.price;
          }
        }
      }
      const unitPrice = dish.price + extra;

      setCart((prev) => {
        // match existing item with identical customizations
        const customKey = JSON.stringify(customizations || []);
        const idx = prev.findIndex(
          (item) =>
            item.dish.id === dish.id &&
            JSON.stringify(item.customizations || []) === customKey
        );

        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + quantity,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: 'ci-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            dish,
            quantity,
            customizations,
            itemTotal: unitPrice,
            specialInstructions,
          };
          return [...prev, newItem];
        }
      });

      return { success: true };
    },
    [cart, restaurants]
  );

  const updateCartItemQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedCoupon(null);
  }, []);

  // Coupon
  const applyCoupon = useCallback(
    (code: string) => {
      const match = AVAILABLE_COUPONS.find(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase()
      );
      if (!match) {
        return { success: false, message: 'Invalid coupon code.' };
      }
      if (cartSubtotal < match.minOrderValue) {
        return {
          success: false,
          message: `Add items worth ₹${match.minOrderValue - cartSubtotal} more to apply this coupon.`,
        };
      }
      setAppliedCoupon(match);
      return { success: true, message: `Coupon ${match.code} applied! Saved ₹${match.discountValue}` };
    },
    [cartSubtotal]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Active Order & Simulation
  const activeOrder = useMemo(() => {
    if (!activeOrderId) return null;
    return orders.find((o) => o.id === activeOrderId) || null;
  }, [activeOrderId, orders]);

  // Order Placement
  const placeOrder = useCallback(
    async (paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD') => {
      if (!cartRestaurant) throw new Error('No restaurant selected.');
      if (paymentMethod === 'Wallet') {
        if (walletBalance < cartTotal) {
          throw new Error('Insufficient wallet balance.');
        }
        setWalletBalance((prev) => prev - cartTotal);
      }

      const assignedPartner = MOCK_PARTNERS[Math.floor(Math.random() * MOCK_PARTNERS.length)];
      const orderId = 'CW-' + Math.floor(10000 + Math.random() * 90000);
      const nowStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      const newOrder: Order = {
        id: orderId,
        date: 'Today, ' + nowStr,
        restaurantId: cartRestaurant.id,
        restaurantName: cartRestaurant.name,
        restaurantImage: cartRestaurant.image,
        restaurantAddress: cartRestaurant.address,
        items: [...cart],
        subtotal: cartSubtotal,
        deliveryFee,
        platformFee,
        taxes,
        discount,
        total: cartTotal,
        appliedCoupon: appliedCoupon || undefined,
        deliveryAddress: activeAddress,
        deliveryInstructions,
        paymentMethod,
        status: 'placed',
        statusTimestamps: {
          placed: nowStr,
        },
        deliveryPartner: assignedPartner,
        etaMinutes: cartRestaurant.deliveryTimeMins,
      };

      // Confetti burst!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb923c', '#10b981', '#6366f1'],
        });
      } catch {}

      setOrders((prev) => [newOrder, ...prev]);
      setActiveOrderId(orderId);
      clearCart();
      setIsCheckoutOpen(false);
      setIsLiveTrackingOpen(true);

      // Notification
      setNotifications((prev) => [
        {
          id: 'notif-' + Date.now(),
          title: `Order #${orderId} Placed! 🍛`,
          message: `${cartRestaurant.name} has received your order for ₹${newOrder.total}. Tracking live!`,
          time: 'Just now',
          isRead: false,
          type: 'order',
          orderId,
        },
        ...prev,
      ]);

      return newOrder;
    },
    [
      cartRestaurant,
      cart,
      cartSubtotal,
      deliveryFee,
      platformFee,
      taxes,
      discount,
      cartTotal,
      appliedCoupon,
      activeAddress,
      deliveryInstructions,
      walletBalance,
      clearCart,
    ]
  );

  // Live order status progression simulation
  useEffect(() => {
    if (!activeOrderId) return;
    const order = orders.find((o) => o.id === activeOrderId);
    if (!order || order.status === 'delivered' || order.status === 'cancelled') return;

    const timeline: { status: OrderStatus; delayMs: number; etaDelta: number }[] = [
      { status: 'accepted', delayMs: 6000, etaDelta: -2 },
      { status: 'preparing', delayMs: 14000, etaDelta: -5 },
      { status: 'partner_assigned', delayMs: 24000, etaDelta: -8 },
      { status: 'out_for_delivery', delayMs: 36000, etaDelta: -12 },
      { status: 'delivered', delayMs: 52000, etaDelta: -20 },
    ];

    const timers = timeline.map(({ status, delayMs, etaDelta }) => {
      return setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id !== activeOrderId) return o;
            const timeNow = new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            });
            return {
              ...o,
              status,
              etaMinutes: Math.max(0, o.etaMinutes + etaDelta),
              statusTimestamps: {
                ...o.statusTimestamps,
                [status]: timeNow,
              },
            };
          })
        );

        if (status === 'delivered') {
          // Trigger confetti on delivery!
          try {
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.5 },
            });
          } catch {}
          // Send notification
          setNotifications((prev) => [
            {
              id: 'notif-' + Date.now(),
              title: `Order #${activeOrderId} Delivered! 🥳`,
              message: 'Your delicious food has arrived. Rate your meal and rider!',
              time: 'Just now',
              isRead: false,
              type: 'order',
              orderId: activeOrderId,
            },
            ...prev,
          ]);
        }
      }, delayMs);
    });

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [activeOrderId, orders]);

  // Fast forward order status for user convenience
  const advanceOrderStatus = useCallback((orderId: string, targetStatus?: OrderStatus) => {
    const statuses: OrderStatus[] = [
      'placed',
      'accepted',
      'preparing',
      'partner_assigned',
      'out_for_delivery',
      'delivered',
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        let nextStatus = targetStatus;
        if (!nextStatus) {
          const curIdx = statuses.indexOf(o.status);
          nextStatus = curIdx < statuses.length - 1 ? statuses[curIdx + 1] : 'delivered';
        }
        const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        return {
          ...o,
          status: nextStatus,
          etaMinutes: nextStatus === 'delivered' ? 0 : Math.max(5, o.etaMinutes - 5),
          statusTimestamps: {
            ...o.statusTimestamps,
            [nextStatus]: timeNow,
          },
        };
      })
    );
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return { ...o, status: 'cancelled' };
      })
    );
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: `Order #${orderId} Cancelled`,
        message: 'Your order was cancelled. Any debited amount has been refunded to your CraveWave wallet.',
        time: 'Just now',
        isRead: false,
        type: 'order',
      },
      ...prev,
    ]);
  }, []);

  const rateOrder = useCallback(
    (orderId: string, restRating: number, partnerRating: number, comment?: string) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o;
          return {
            ...o,
            restaurantRating: restRating,
            partnerRating,
            reviewComment: comment,
          };
        })
      );
      setIsRatingModalOpen(false);
      setOrderToRate(null);
    },
    []
  );

  const reorder = useCallback(
    (pastOrder: Order): boolean => {
      clearCart();
      for (const item of pastOrder.items) {
        addToCart(item.dish, item.quantity, item.customizations, item.specialInstructions);
      }
      setIsOrderHistoryOpen(false);
      setIsCartOpen(true);
      return true;
    },
    [clearCart, addToCart]
  );

  // Favorites
  const toggleFavoriteRestaurant = useCallback((id: string) => {
    setFavorites((prev) => {
      const exists = prev.restaurantIds.includes(id);
      return {
        ...prev,
        restaurantIds: exists
          ? prev.restaurantIds.filter((x) => x !== id)
          : [...prev.restaurantIds, id],
      };
    });
  }, []);

  const toggleFavoriteDish = useCallback((id: string) => {
    setFavorites((prev) => {
      const exists = prev.dishIds.includes(id);
      return {
        ...prev,
        dishIds: exists ? prev.dishIds.filter((x) => x !== id) : [...prev.dishIds, id],
      };
    });
  }, []);

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        walletBalance,
        addWalletMoney,
        addresses,
        activeAddress,
        setActiveAddress,
        addAddress,
        deleteAddress,
        detectGpsLocation,
        restaurants,
        selectedRestaurant,
        setSelectedRestaurant,
        cart,
        cartRestaurantId,
        cartRestaurant,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        deliveryFee,
        platformFee,
        taxes,
        discount,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        deliveryInstructions,
        setDeliveryInstructions,
        cookingInstructions,
        setCookingInstructions,
        orders,
        activeOrder,
        placeOrder,
        advanceOrderStatus,
        cancelOrder,
        rateOrder,
        reorder,
        favorites,
        toggleFavoriteRestaurant,
        toggleFavoriteDish,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotifCount,
        theme,
        toggleTheme,
        vegOnlyFilter,
        setVegOnlyFilter,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isLiveTrackingOpen,
        setIsLiveTrackingOpen,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        isFavoritesOpen,
        setIsFavoritesOpen,
        isSupportOpen,
        setIsSupportOpen,
        isProfileOpen,
        setIsProfileOpen,
        isPartnerCallOpen,
        setIsPartnerCallOpen,
        isPartnerChatOpen,
        setIsPartnerChatOpen,
        isRatingModalOpen,
        setIsRatingModalOpen,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        orderToRate,
        setOrderToRate,
        customizingDish,
        setCustomizingDish,
        conflictModalData,
        setConflictModalData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
