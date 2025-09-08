import React from 'react';
import { Product, ProductFeatures } from '../types';
import { ProductCard } from './ProductCard';

interface ProductMatrixProps {
    products: Product[];
    analyzedProducts: Record<string, ProductFeatures | { error: string }>;
    setAnalyzedProducts: React.Dispatch<React.SetStateAction<Record<string, ProductFeatures | { error: string }>>>;
    onAddToCompare: (product: Product) => void;
    comparisonList: Product[];
}

export const ProductMatrix = ({ products, analyzedProducts, setAnalyzedProducts, onAddToCompare, comparisonList }: ProductMatrixProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
                <ProductCard
                    key={product.sku}
                    product={product}
                    analysis={analyzedProducts[product.sku]}
                    setAnalyzedProducts={setAnalyzedProducts}
                    onAddToCompare={onAddToCompare}
                    isInCompareList={comparisonList.some(p => p.sku === product.sku)}
                />
            ))}
        </div>
    );
};