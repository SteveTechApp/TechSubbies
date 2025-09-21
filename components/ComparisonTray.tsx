import React, { useState } from 'react';
// FIX: Corrected import path for types.
import { Product, ProductFeatures } from '../types';

interface ComparisonTrayProps {
    items: Product[];
    analyzedProducts: Record<string, ProductFeatures | { error: string }>;
    onRemove: (sku: string) => void;
    onClear: () => void;
}

const ComparisonModal = ({ items, analyzedProducts, onClose, onRemove }: { items: Product[], analyzedProducts: Record<string, ProductFeatures | {error: string}>, onClose: () => void, onRemove: (sku: string) => void }) => {
    const featuresToCompare: (keyof ProductFeatures | 'sku' | 'name')[] = [
        'sku',
        'name',
        'maxResolution',
        'idealApplication',
        'keyFeatures'
    ];
    
    const renderFeature = (product: Product, feature: keyof ProductFeatures | 'sku' | 'name') => {
        if (feature === 'sku') return product.sku;
        if (feature === 'name') return product.name;

        const analysis = analyzedProducts[product.sku];
        if (!analysis || 'error' in analysis) return <span className="text-gray-400">Not analyzed</span>;

        const value = analysis[feature];
        if (Array.isArray(value)) {
            return (
                <ul className="list-disc list-inside">
                    {value.slice(0, 5).map((item, i) => <li key={i}>{String(item)}</li>)}
                </ul>
            );
        }
        return String(value);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-t-lg w-full max-h-[80vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold">Product Comparison</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </header>
                <div className="overflow-auto custom-scrollbar">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 sticky top-0 bg-gray-50">Feature</th>
                                {items.map(item => (
                                    <th key={item.sku} className="px-4 py-3 sticky top-0 bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <span>{item.name}</span>
                                            <button onClick={() => onRemove(item.sku)} className="text-red-500 hover:text-red-700 ml-2">&times;</button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* FIX: Cast feature to string to resolve key and method errors. */}
                            {featuresToCompare.map(feature => (
                                <tr key={String(feature)} className="border-b">
                                    <td className="px-4 py-3 font-semibold capitalize">{String(feature).replace(/([A-Z])/g, ' $1').trim()}</td>
                                    {items.map(item => (
                                        <td key={item.sku} className="px-4 py-3 align-top">
                                            {renderFeature(item, feature)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const ComparisonTray = ({ items, analyzedProducts, onRemove, onClear }: ComparisonTrayProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 shadow-lg z-20">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4 overflow-x-auto custom-scrollbar">
                        <span className="font-bold flex-shrink-0">Compare ({items.length})</span>
                        {items.map(item => (
                            <div key={item.sku} className="flex items-center gap-2 bg-gray-700 px-2 py-1 rounded">
                                <span className="text-xs">{item.sku}</span>
                                <button onClick={() => onRemove(item.sku)} className="text-gray-400 hover:text-white">&times;</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-0 flex gap-2">
                        <button onClick={() => setIsExpanded(true)} className="px-4 py-1.5 bg-blue-600 text-white font-semibold rounded-md text-sm hover:bg-blue-700">
                            Compare Now
                        </button>
                         <button onClick={onClear} className="px-4 py-1.5 bg-gray-600 text-white font-semibold rounded-md text-sm hover:bg-gray-500">
                            Clear
                        </button>
                    </div>
                </div>
            </div>
            {isExpanded && <ComparisonModal items={items} analyzedProducts={analyzedProducts} onClose={() => setIsExpanded(false)} onRemove={onRemove} />}
        </>
    );
};