import { useState } from "react";

export default function useCart() {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  function addItem(product, quantity = 1) {
    setItems((currentItems) => {
      const currentItem = currentItems.find((item) => item.handle === product.handle);
      return currentItem
        ? currentItems.map((item) => item.handle === product.handle
          ? { ...item, quantity: item.quantity + quantity }
          : item)
        : [...currentItems, { ...product, quantity }];
    });
    setIsOpen(true);
  }

  function updateItem(product, quantity) {
    setItems((currentItems) => quantity <= 0
      ? currentItems.filter((item) => item.handle !== product.handle)
      : currentItems.map((item) => item.handle === product.handle
        ? { ...item, quantity }
        : item));
  }

  return {
    items,
    isOpen,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    setIsOpen,
    addItem,
    updateItem
  };
}
