export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export function addToCart(cart: Cart, item: CartItem): Cart {
  const existingItem = cart.items.find(i => i.productId === item.productId);
  
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }
  
  return {
    ...cart,
    total: calculateTotal(cart.items),
  };
}

export function removeFromCart(cart: Cart, productId: string): Cart {
  return {
    ...cart,
    items: cart.items.filter(item => item.productId !== productId),
    total: calculateTotal(cart.items.filter(item => item.productId !== productId)),
  };
}

export function updateQuantity(cart: Cart, productId: string, quantity: number): Cart {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  const items = cart.items.map(item =>
    item.productId === productId ? { ...item, quantity } : item
  );
  
  return {
    ...cart,
    items,
    total: calculateTotal(items),
  };
}

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getEmptyCart(): Cart {
  return {
    items: [],
    total: 0,
  };
}