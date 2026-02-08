'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { fetchCart, clearCart } from '@/store/slices/cartSlice';
import Header from '@/components/Header/Header';
import CartItem from '@/components/CartItem/CartItem';
import { formatCurrency } from '@/utils/formatters';
import styles from './page.module.css';

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { items, totalItems, totalPrice, sessionId, loading } = useAppSelector(
        (state) => state.cart
    );

    useEffect(() => {
        if (sessionId) {
            dispatch(fetchCart(sessionId));
        }
    }, [dispatch, sessionId]);

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await dispatch(clearCart()).unwrap();
            } catch (error) {
                console.error('Failed to clear cart:', error);
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className="container">
                        <h1>Shopping Cart</h1>
                        <div className={styles.loading}>
                            <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
                            <p>Loading your cart...</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (items.length === 0) {
        return (
            <>
                <Header />
                <main className={styles.main}>
                    <div className="container">
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>
                            <h2>Your cart is empty</h2>
                            <p>Start shopping to add items to your cart</p>
                            <Link href="/" className="btn btn-primary">
                                Browse Products
                            </Link>
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
                    <div className={styles.header}>
                        <h1 className="gradient-text">Shopping Cart</h1>
                        <p className={styles.itemCount}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.items}>
                            {items.map((item) => (
                                <CartItem key={item.product._id} item={item} />
                            ))}

                            <button className={styles.clearBtn} onClick={handleClearCart}>
                                Clear Cart
                            </button>
                        </div>

                        <div className={styles.summary}>
                            <div className={`${styles.summaryCard} glass-card`}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>

                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(totalPrice)}</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span className={styles.free}>FREE</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Tax (estimated)</span>
                                    <span>{formatCurrency(totalPrice * 0.1)}</span>
                                </div>

                                <div className={styles.divider}></div>

                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                    <span>Total</span>
                                    <span>{formatCurrency(totalPrice * 1.1)}</span>
                                </div>

                                <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                                    Proceed to Checkout
                                </button>

                                <Link href="/" className={styles.continueShopping}>
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
