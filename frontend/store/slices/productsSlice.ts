import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/services/api';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    inStock: boolean;
    available: boolean;
}

interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
    filters: {
        category: string;
        search: string;
        minPrice: number;
        maxPrice: number;
    };
}

const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
    filters: {
        category: '',
        search: '',
        minPrice: 0,
        maxPrice: 10000,
    },
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params?: Record<string, any>) => {
        const response = await api.get('/products', { params });
        return response.data;
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<string>) => {
            state.filters.category = action.payload;
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.filters.search = action.payload;
        },
        setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
            state.filters.minPrice = action.payload.min;
            state.filters.maxPrice = action.payload.max;
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch products';
            });
    },
});

export const { setCategory, setSearch, setPriceRange, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
