import type { Coupon } from '../types';

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'CRAVE50',
    title: '50% OFF up to ₹100',
    description: 'Use code CRAVE50 & get 50% discount on orders above ₹199.',
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 199,
    maxDiscount: 100,
  },
  {
    code: 'WELCOME100',
    title: 'Flat ₹100 OFF',
    description: 'Special welcome treat for foodies! Valid on orders above ₹249.',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 249,
  },
  {
    code: 'FREEDEL',
    title: 'FREE DELIVERY',
    description: 'Save delivery charges on orders above ₹149.',
    discountType: 'flat',
    discountValue: 35,
    minOrderValue: 149,
  },
  {
    code: 'FEAST20',
    title: '20% OFF up to ₹150',
    description: 'Perfect for group feasts! Minimum order value ₹499.',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 499,
    maxDiscount: 150,
  },
  {
    code: 'PARTY300',
    title: 'Flat ₹300 OFF',
    description: 'Huge savings for house parties! Minimum order value ₹999.',
    discountType: 'flat',
    discountValue: 300,
    minOrderValue: 999,
  },
];
