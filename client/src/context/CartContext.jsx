import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoInfo, setPromoInfo] = useState(null); // { code, name, type, value }
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  function addItem(item, quantity, selectedModifiers) {
    setItems((prev) => {
      // Same item + same modifier combo → increment qty
      const key = JSON.stringify({ id: item.id, mods: selectedModifiers });
      const existing = prev.find((i) => JSON.stringify({ id: i.item.id, mods: i.selectedModifiers }) === key);
      if (existing) {
        return prev.map((i) =>
          JSON.stringify({ id: i.item.id, mods: i.selectedModifiers }) === key
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
            : i
        );
      }
      return [...prev, { id: Date.now(), item, quantity, selectedModifiers }];
    });
  }

  function updateQuantity(cartId, quantity) {
    if (quantity < 1) return removeItem(cartId);
    setItems((prev) => prev.map((i) => (i.id === cartId ? { ...i, quantity: Math.min(quantity, 10) } : i)));
  }

  function removeItem(cartId) {
    setItems((prev) => prev.filter((i) => i.id !== cartId));
  }

  function clearCart() {
    setItems([]);
    setPromoCode('');
    setPromoDiscount(0);
    setPromoInfo(null);
    setCustomerEmail('');
    setCustomerName('');
  }

  function applyPromoResult(code, discount, info) {
    setPromoCode(code);
    setPromoDiscount(discount);
    setPromoInfo(info);
  }

  function clearPromo() {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoInfo(null);
  }

  const subtotal = items.reduce((sum, i) => sum + Number(i.item.price) * i.quantity, 0);
  const TAX_RATE = 0.07;
  const tax = (subtotal - promoDiscount) > 0 ? (subtotal - promoDiscount) * TAX_RATE : subtotal * TAX_RATE;
  const total = Math.max(subtotal - promoDiscount, 0) + tax;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, updateQuantity, removeItem, clearCart,
      subtotal, tax, total, itemCount,
      promoCode, promoDiscount, promoInfo, applyPromoResult, clearPromo,
      customerEmail, setCustomerEmail, customerName, setCustomerName,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
