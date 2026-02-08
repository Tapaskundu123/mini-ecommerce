import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';
import { Product } from './productsSlice';

export interface CartItem {
    product: Product;
    quantity: number;
    price: number;
}

interface CartData {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    sessionId: string;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    sessionId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    sessionId: null,
    loading: false,
    error: null,
};

// Load session ID from localStorage
const loadSessionId = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('cart_session_id');
    }
    return null;
};

// Save session ID to localStorage
const saveSessionId = (sessionId: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cart_session_id', sessionId);
    }
};

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (sessionId: string) => {
    const response = await api.get<CartData>(`/cart/${sessionId}`);
    return response.data as CartData;
});

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity }: { productId: string; quantity: number }, { getState }) => {
        const state = getState() as { cart: CartState };
        const sessionId = state.cart.sessionId || loadSessionId();

        const response = await api.post<CartData>('/cart', {
            productId,
            quantity,
            sessionId,
        });

        // Save session ID if it's new
        const newSessionId = (response as any).sessionId || (response.data as any).sessionId;
        if (newSessionId) {
            saveSessionId(newSessionId);
        }

        // Return cart data with sessionId
        return {
            items: (response.data as any).items,
            totalItems: (response.data as any).totalItems,
            totalPrice: (response.data as any).totalPrice,
            sessionId: newSessionId,
        } as CartData;
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ productId, quantity }: { productId: string; quantity: number }, { getState }) => {
        const state = getState() as { cart: CartState };
        const sessionId = state.cart.sessionId || loadSessionId();

        if (!sessionId) {
            throw new Error('No session ID found');
        }

        const response = await api.put<CartData>('/cart', {
            productId,
            quantity,
            sessionId,
        });

        return response.data as CartData;
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId: string, { getState }) => {
        const state = getState() as { cart: CartState };
        const sessionId = state.cart.sessionId || loadSessionId();

        if (!sessionId) {
            throw new Error('No session ID found');
        }

        const response = await api.delete<CartData>('/cart', {
            data: { productId, sessionId },
        });

        return response.data as CartData;
    }
);

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { getState }) => {
    const state = getState() as { cart: CartState };
    const sessionId = state.cart.sessionId || loadSessionId();

    if (!sessionId) {
        throw new Error('No session ID found');
    }

    const response = await api.delete<CartData>(`/cart/${sessionId}/clear`);
    return response.data as CartData;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        initializeSession: (state) => {
            const sessionId = loadSessionId();
            if (sessionId) {
                state.sessionId = sessionId;
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.totalPrice = action.payload.totalPrice;
                state.sessionId = action.payload.sessionId;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch cart';
            })

            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.totalPrice = action.payload.totalPrice;
                if (action.payload.sessionId) {
                    state.sessionId = action.payload.sessionId;
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add to cart';
            })

            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.totalPrice = action.payload.totalPrice;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update cart';
            })

            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.totalPrice = action.payload.totalPrice;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to remove from cart';
            })

            // Clear cart
            .addCase(clearCart.fulfilled, (state, action) => {
                state.items = [];
                state.totalItems = 0;
                state.totalPrice = 0;
            });
    },
});

export const { initializeSession, clearError } = cartSlice.actions;
export default cartSlice.reducer;
