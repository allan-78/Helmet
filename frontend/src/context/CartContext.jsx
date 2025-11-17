import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      loadLocalCart();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.cart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const loadLocalCart = () => {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  };

  const saveLocalCart = (cartData) => {
    localStorage.setItem('cart', JSON.stringify(cartData));
  };

  const normalizeCartPayload = (productOrItem, quantity, size, color) => {
    if (!productOrItem) {
      throw new Error('No product provided to addToCart');
    }

    if (productOrItem.product) {
      return {
        product: productOrItem.product,
        quantity: productOrItem.quantity || 1,
        size: productOrItem.size || productOrItem.product.sizes?.[0] || 'Standard',
        color: productOrItem.color || productOrItem.product.colors?.[0] || 'Matte Black',
        price: productOrItem.price || productOrItem.product.discountPrice || productOrItem.product.price,
      };
    }

    return {
      product: productOrItem,
      quantity: quantity || 1,
      size: size || productOrItem.sizes?.[0] || 'Standard',
      color: color || productOrItem.colors?.[0] || 'Matte Black',
      price: productOrItem.discountPrice || productOrItem.price,
    };
  };

  const addToCart = async (productOrItem, quantity, size, color) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add helmets to your cart.');
      return;
    }

    setLoading(true);
    try {
      const payload = normalizeCartPayload(productOrItem, quantity, size, color);

      const { data } = await api.post('/cart', {
        productId: payload.product._id,
        quantity: payload.quantity,
        size: payload.size,
        color: payload.color,
      });
      setCart(data.cart);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const { data } = await api.put(`/cart/${itemId}`, { quantity });
        setCart(data.cart);
      } else {
        const updatedItems = cart.items.map((item) =>
          item.product._id === itemId ? { ...item, quantity } : item
        );
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const updatedCart = { items: updatedItems, totalPrice };
        setCart(updatedCart);
        saveLocalCart(updatedCart);
      }
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const { data } = await api.delete(`/cart/${itemId}`);
        setCart(data.cart);
      } else {
        const updatedItems = cart.items.filter((item) => item.product._id !== itemId);
        const totalPrice = updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const updatedCart = { items: updatedItems, totalPrice };
        setCart(updatedCart);
        saveLocalCart(updatedCart);
      }
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await api.delete('/cart');
      }
      setCart({ items: [], totalPrice: 0 });
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cart.items?.length || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
