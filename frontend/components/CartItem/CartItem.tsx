'use client';

import Image from 'next/image';
import { useAppDispatch } from '@/hooks/useRedux';
import { updateCartItem, removeFromCart } from '@/store/slices/cartSlice';
import { CartItem } from '@/store/slices/cartSlice';
import { formatCurrency } from '@/utils/formatters';
import styles from './CartItem.module.css';

interface CartItemProps {
    item: CartItem;
}

export default function CartItemComponent({ item }: CartItemProps) {
    const dispatch = useAppDispatch();

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await dispatch(
                updateCartItem({ productId: item.product._id, quantity: newQuantity })
            ).unwrap();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleRemove = async () => {
        try {
            await dispatch(removeFromCart(item.product._id)).unwrap();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const subtotal = item.price * item.quantity;

    return (
        <div className={`${styles.item} glass-card`}>
            <div className={styles.imageWrapper}>
                <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="150px"
                    className={styles.image}
                />
            </div>

            <div className={styles.details}>
                <div className={styles.info}>
                    <h3 className={styles.name}>{item.product.name}</h3>
                    <p className={styles.category}>{item.product.category}</p>
                    <p className={styles.price}>{formatCurrency(item.price)}</p>
                </div>

                <div className={styles.actions}>
                    <div className={styles.quantity}>
                        <button
                            className={styles.quantityBtn}
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            -
                        </button>
                        <span className={styles.quantityValue}>{item.quantity}</span>
                        <button
                            className={styles.quantityBtn}
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                        >
                            +
                        </button>
                    </div>

                    <div className={styles.subtotal}>{formatCurrency(subtotal)}</div>

                    <button className={styles.removeBtn} onClick={handleRemove} title="Remove item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
