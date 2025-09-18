import React, { useState } from 'react';
import { Product, ProductFeatures, IOPort } from '../types';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';

interface ProductCardProps {
    product: Product;
    analysis: ProductFeatures | { error: string } | undefined;
    setAnalyzedProducts: React.Dispatch<React.SetStateAction<Record<string, ProductFeatures | { error: string }>>>;
    onAddToCompare: (product: Product) => void;
    isInCompareList: boolean;
}

const FeatureDisplay = ({ features }: { features: ProductFeatures }) => (
    <div className="text-xs space-y-2">
        <div>
            <h5 className="font-bold text-gray-600">Resolution</h5>
            <p className="text-gray-800">{features.maxResolution}</p>
        </div>
        <div>
            <h5 className="font-bold text-gray-600">I/O Ports</h5>
            <p className="text-gray-800">
                Inputs: {features.ioPorts.inputs.map(p => `${p.count}x ${p.type}`).join(', ')} | 
                Outputs: {features.ioPorts.outputs.map(p => `${p.count}x ${p.type}`).join(', ')}
            </p>
        </div>
        <div>
            <h5 className="font-bold text-gray-600">Key Features</h5>
            <div className="flex flex-wrap gap-1 mt-1">
                {features.keyFeatures.slice(0, 4).map(f => <span key={f} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{f}</span>)}
            </div>
        </div>
         <div>
            <h5 className="font-bold text-gray-600">Ideal Application</h5>
            <p className="text-gray-800 italic">{features.idealApplication}</p>
        </div>
    </div>
);

export const ProductCard = ({ product, analysis, setAnalyzedProducts, onAddToCompare, isInCompareList }: ProductCardProps) => {
    const { analyzeProductForFeatures } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        const result = await analyzeProductForFeatures(product);
        setAnalyzedProducts(prev => ({ ...prev, [product.sku]: result }));
        setIsLoading(false);
    };
    
    const isAnalyzed = analysis && !('error' in analysis);
    const hasError = analysis && 'error' in analysis;

    const scoreColor = product.matchScore ?
        product.matchScore > 80 ? 'bg-green-500' :
        product.matchScore > 60 ? 'bg-yellow-500' : 'bg-gray-400'
        : 'bg-gray-300';

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col overflow-hidden">
            <header className="p-3 border-b bg-gray-50">
                {product.matchScore && (
                     <span className={`float-right ml-2 text-white text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor}`}>
                        {product.matchScore.toFixed(0)}% Match
                    </span>
                )}
                <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-500">{product.sku}</p>
            </header>
            
            <div className="p-3 flex-grow">
                {isLoading && <p className="text-center text-sm text-gray-500">Analyzing with AI...</p>}
                {hasError && <p className="text-center text-sm text-red-500">{(analysis as {error: string}).error}</p>}
                {isAnalyzed && <FeatureDisplay features={analysis as ProductFeatures} />}
                {!analysis && !isLoading && <p className="text-xs text-gray-600 line-clamp-4">{product.description}</p>}
            </div>

            <footer className="p-2 border-t bg-gray-50">
                {!analysis && (
                     <button onClick={handleAnalyze} disabled={isLoading} className="w-full text-sm px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                        {isLoading ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                )}
                 {hasError && (
                     <button onClick={handleAnalyze} disabled={isLoading} className="w-full text-sm px-3 py-1.5 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-red-300">
                        {isLoading ? 'Retrying...' : 'Retry Analysis'}
                    </button>
                )}
                {isAnalyzed && (
                     <button onClick={() => onAddToCompare(product)} disabled={isInCompareList} className="w-full text-sm px-3 py-1.5 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400">
                        {isInCompareList ? 'Added to Compare' : 'Add to Compare'}
                    </button>
                )}
            </footer>
        </div>
    );
};