'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchProducts } from '@/store/slices/productsSlice';
import Header from '@/components/Header/Header';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export default function HomePage() {
    const dispatch = useAppDispatch();
    const { items: products, loading, error } = useAppSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className="container">
                        <h1 className="gradient-text">Our Products</h1>
                        <div className="grid grid-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div className="skeleton" style={{ height: '250px', marginBottom: '16px' }}></div>
                                    <div className="skeleton" style={{ height: '24px', marginBottom: '12px' }}></div>
                                    <div className="skeleton" style={{ height: '60px', marginBottom: '12px' }}></div>
                                    <div className="skeleton" style={{ height: '20px', width: '60%' }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className="container">
                        <div className={styles.error}>
                            <h2>⚠️ Error Loading Products</h2>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={() => dispatch(fetchProducts())}>
                                Retry
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className="container">
                    <div className={styles.hero}>
                        <h1 className="gradient-text animate-fade-in">Discover Amazing Products</h1>
                        <p className={styles.subtitle}>
                            Explore our curated collection of premium items across various categories
                        </p>
                    </div>

                    {products.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No products found. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-3 animate-fade-in">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
