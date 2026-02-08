'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@/hooks/useRedux';
import { addToCart } from '@/store/slices/cartSlice';
import { Product } from '@/store/slices/productsSlice';
import { formatCurrency, truncateText } from '@/utils/formatters';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const dispatch = useAppDispatch();
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className={`${styles.card} glass-card`}>
            <div className={styles.imageWrapper}>
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                />
                {!product.inStock && (
                    <div className={styles.outOfStock}>Out of Stock</div>
                )}
                {product.inStock && product.stock < 10 && (
                    <div className={styles.lowStock}>Only {product.stock} left</div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.category}>{product.category}</div>
                <h3 className={styles.title}>{truncateText(product.name, 50)}</h3>
                <p className={styles.description}>{truncateText(product.description, 80)}</p>

                <div className={styles.footer}>
                    <div className={styles.price}>{formatCurrency(product.price)}</div>
                    <button
                        className={`btn btn-primary ${styles.addButton}`}
                        onClick={handleAddToCart}
                        disabled={!product.inStock || isAdding}
                    >
                        {isAdding ? (
                            <>
                                <span className="spinner"></span>
                                Adding...
                            </>
                        ) : showSuccess ? (
                            '✓ Added!'
                        ) : (
                            '+ Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
