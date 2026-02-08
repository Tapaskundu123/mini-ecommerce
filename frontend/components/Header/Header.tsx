'use client';

import Link from 'next/link';
import { useAppSelector } from '@/hooks/useRedux';
import styles from './Header.module.css';

export default function Header() {
    const { totalItems } = useAppSelector((state) => state.cart);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <span className="gradient-text">ShopNest</span>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>
                        Products
                    </Link>
                    <Link href="/cart" className={styles.cartLink}>
                        <svg
                            className={styles.cartIcon}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Cart
                        {totalItems > 0 && <span className="badge">{totalItems}</span>}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
