import React, { useState, useMemo } from 'react';
import { EngineerProfile, Skill, ProfileTier, Product, ProductFeatures, AiProductMatch } from '../../types';
import { AISkillDiscovery } from '../../components/AISkillDiscovery';
import { TrainingRecommendations } from '../../components/TrainingRecommendations';
import { useAppContext } from '../../context/InteractionContext';
import { ClientBriefBar } from '../../components/ClientBriefBar';
import { parseProductData, MOCK_PRODUCT_DATA } from '../../data/productData';
import { ProductMatrix } from '../../components/ProductMatrix';
import { ComparisonTray } from '../../components/ComparisonTray';

interface AIToolsViewProps {
    profile: EngineerProfile;
    onSkillsAdded: (skills: Skill[]) => void;
    setActiveView: (view: string) => void;
}

export const AIToolsView = ({ profile, onSkillsAdded, setActiveView }: AIToolsViewProps) => {
    const { geminiService } = useAppContext();
    const productCatalog = useMemo(() => parseProductData(MOCK_PRODUCT_DATA), []);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [analyzedProducts, setAnalyzedProducts] = useState<Record<string, ProductFeatures | { error: string }>>({});
    const [comparisonList, setComparisonList] = useState<Product[]>([]);

    const isSalesEngineer = profile.discipline === 'Sales Engineer' || profile.discipline === 'AV & IT Engineer';
    const canUseProductFinder = profile.profileTier !== ProfileTier.BASIC && isSalesEngineer;

    const handleProductSearch = async (brief: string) => {
        setIsLoading(true);
        setSearchResults([]);
        const result = await geminiService.findMatchingProducts(brief, productCatalog);
        if (result.matches) {
            const matchesWithScores = result.matches
                .map((match: AiProductMatch) => {
                    const product = productCatalog.find(p => p.sku === match.sku);
                    if (product) {
                        return { ...product, matchScore: match.match_score };
                    }
                    return null;
                })
                .filter((p): p is Product & { matchScore: number } => p !== null);
            
            // FIX: Removed invalid type predicate `p is Product` which caused a compilation error.
            // The object type is already correctly inferred from the filter above.
            setSearchResults(matchesWithScores);
        }
        setIsLoading(false);
    };
    
    const handleAddToCompare = (product: Product) => {
        setComparisonList(prev => {
            if (prev.some(p => p.sku === product.sku)) return prev;
            if (prev.length >= 4) {
                alert("You can compare a maximum of 4 products.");
                return prev;
            }
            return [...prev, product];
        });
    };
    
    const handleRemoveFromCompare = (sku: string) => {
        setComparisonList(prev => prev.filter(p => p.sku !== sku));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">AI-Powered Tools</h1>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-bold mb-3">Product Finder (for Sales Engineers)</h2>
                {canUseProductFinder ? (
                    <div>
                        <ClientBriefBar onSearch={handleProductSearch} isLoading={isLoading} />
                        {searchResults.length > 0 && (
                            <ProductMatrix
                                products={searchResults}
                                analyzedProducts={analyzedProducts}
                                setAnalyzedProducts={setAnalyzedProducts}
                                onAddToCompare={handleAddToCompare}
                                comparisonList={comparisonList}
                            />
                        )}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-gray-100 rounded-lg border-2 border-dashed">
                        <p className="text-gray-600">This powerful tool is available for premium Sales Engineer profiles to find the perfect hardware for a client brief.</p>
                    </div>
                )}
            </div>
            
            {profile.profileTier !== ProfileTier.BASIC && (
                <>
                    <AISkillDiscovery onSkillsAdded={onSkillsAdded} />
                    <TrainingRecommendations profile={profile} />
                </>
            )}
            
            <ComparisonTray 
                items={comparisonList}
                analyzedProducts={analyzedProducts}
                onRemove={handleRemoveFromCompare}
                onClear={() => setComparisonList([])}
            />
        </div>
    );
};
