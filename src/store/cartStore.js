// src/store/cartStore.js
import create from 'zustand';

const useCartStore = create((set) => ({
  cartItems: [], // 장바구니 아이템 리스트
  totalQuantity: 0, // 전체 수량
  totalPrice: 0, // 전체 가격

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        // 기존 아이템이 있는 경우 수량 증가
        return {
          cartItems: state.cartItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
          totalQuantity: state.totalQuantity + 1,
          totalPrice: state.totalPrice + product.price,
        };
      } else {
        // 새로운 아이템 추가
        return {
          cartItems: [...state.cartItems, { ...product, quantity: 1 }],
          totalQuantity: state.totalQuantity + 1,
          totalPrice: state.totalPrice + product.price,
        };
      }
    }),

  removeFromCart: (id) =>
    set((state) => {
      const itemToRemove = state.cartItems.find((item) => item.id === id);
      if (!itemToRemove) return state;

      return {
        cartItems: state.cartItems.filter((item) => item.id !== id),
        totalQuantity: state.totalQuantity - itemToRemove.quantity,
        totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
      };
    }),

  clearCart: () =>
    set({
      cartItems: [],
      totalQuantity: 0,
      totalPrice: 0,
    }),
}));

export default useCartStore;
