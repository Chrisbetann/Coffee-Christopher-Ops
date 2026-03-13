import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

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
  }

  const subtotal = items.reduce((sum, i) => sum + Number(i.item.price) * i.quantity, 0);
  const TAX_RATE = 0.07;
  const tax   = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, tax, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
