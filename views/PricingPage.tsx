import React, { useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Page, ProfileTier } from '../types';
import { CheckCircle, Star, User, Building } from '../components/Icons';
import { useAppContext } from '../context/AppContext';

interface PricingPageProps {
    onNavigate: (page: Page) => void;
    onHowItWorksClick: () => void;
}

const FeatureListItem = ({ children, included = true }: { children: React.ReactNode, included?: boolean }) => (
    <li className={`flex items-start ${included ? '' : 'text-gray-400 line-through'}`}>
        <CheckCircle className={`w-5 h-5 mr-3 mt-1 flex-shrink-0 ${included ? 'text-green-500' : 'text-gray-300'}`} />
        <span>{children}</span>
    </li>
);

interface TierStyle {
    border: string;
    titleText: string;
    buttonBg: string;
    buttonHoverBg: string;
    badgeBg: string;
    shadow?: string;
}

interface TierCardProps {
    tier?: ProfileTier;
    title: string;
    description: string;
    price: string;
    period?: string;
    features: { text: React.ReactNode, included: boolean }[];
    ctaText: string;
    onCtaClick: () => void;
    isFeatured?: boolean;
    styles: TierStyle;
}

const TierCard = ({ title, description, price, period, features, ctaText, onCtaClick, isFeatured, styles }: TierCardProps) => (
    <div className={`border-2 rounded-lg p-3 bg-white flex flex-col relative transition-all duration-300 ${isFeatured ? `${styles.border} ${styles.shadow || 'shadow-2xl'} transform scale-105` : `border-gray-200 shadow-lg ${styles.border}`}`}>
        {isFeatured && <span className={`absolute top-0 -translate-y-1/2 ${styles.badgeBg} text-white text-xs font-bold uppercase px-3 py-1 rounded-full self-center`}>Most Popular</span>}
        <h3 className={`text-base font-bold ${styles.titleText}`}>{title}</h3>
        <p className="text-gray-500 text-[11px] mt-2 mb-3 flex-grow">{description}</p>
        <div className="my-2">
            <span className="text-2xl font-extrabold text-gray-800">{price}</span>
            {period && <span className="text-sm font-medium text-gray-500">{period}</span>}
        </div>
        <ul className="space-y-1.5 mb-4 text-sm">
            {features.map((feature, index) => <FeatureListItem key={index} included={feature.included}>{feature.text}</FeatureListItem>)}
        </ul>
        <button
            onClick={onCtaClick}
            className={`w-full mt-auto font-bold py-1.5 px-4 rounded-lg text-white transition-colors ${styles.buttonBg} ${styles.buttonHoverBg}`}
        >
            {ctaText}
        </button>
    </div>
);


export const PricingPage = ({ onNavigate, onHowItWorksClick }: PricingPageProps) => {
    const { t, getRegionalPrice } = useAppContext();
    const [activeTab, setActiveTab] = useState('engineers');

    const getTabClass = (tabName: string) => 
        `px-4 py-2 font-semibold text-sm rounded-t-lg transition-colors duration-200 flex items-center gap-2 border-b-2 ${
            activeTab === tabName 
            ? 'bg-white text-blue-600 border-blue-600' 
            : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-300'
        }`;

    const TIER_STYLES: Record<string, TierStyle> = {
        [ProfileTier.BASIC]: { border: 'border-amber-700', titleText: 'text-amber-800', buttonBg: 'bg-amber-700', buttonHoverBg: 'hover:bg-amber-800', badgeBg: 'bg-amber-700' },
        [ProfileTier.PROFESSIONAL]: { border: 'border-slate-400', titleText: 'text-slate-600', buttonBg: 'bg-slate-500', buttonHoverBg: 'hover:bg-slate-600', badgeBg: 'bg-slate-500' },
        [ProfileTier.SKILLS]: { border: 'border-yellow-500', titleText: 'text-yellow-600', buttonBg: 'bg-yellow-500', buttonHoverBg: 'hover:bg-yellow-600', badgeBg: 'bg-yellow-500', shadow: 'shadow-yellow-300/50 shadow-2xl' },
        [ProfileTier.BUSINESS]: { border: 'border-indigo-700', titleText: 'text-indigo-800', buttonBg: 'bg-indigo-700', buttonHoverBg: 'hover:bg-indigo-800', badgeBg: 'bg-indigo-700' }
    };

    const formatPrice = (basePrice: number) => {
        const { amount, symbol } = getRegionalPrice(basePrice);
        return `${symbol}${amount.toFixed(2)}`;
    }

    const ENGINEER_TIERS: TierCardProps[] = [
        {
            tier: ProfileTier.BASIC,
            title: t('bronze_tier'),
            description: t('bronze_desc'),
            price: t('free'),
            period: ` / ${t('forever')}`,
            ctaText: t('get_started'),
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.BASIC],
            features: [
                { text: t('bronze_feat_1'), included: true },
                { text: t('bronze_feat_2'), included: true },
                { text: t('bronze_feat_3'), included: true },
                { text: t('bronze_feat_4'), included: true },
                { text: t('silver_feat_2'), included: false },
                { text: t('silver_feat_3'), included: false },
                { text: t('silver_feat_4'), included: false },
                { text: t('silver_feat_5'), included: false },
                { text: t('silver_feat_6'), included: false },
                { text: t('silver_feat_7'), included: false },
                { text: t('platinum_feat_2'), included: false },
            ]
        },
        {
            tier: ProfileTier.PROFESSIONAL,
            title: t('silver_tier'),
            description: t('silver_desc'),
            price: formatPrice(7),
            period: ` / ${t('month')}`,
            ctaText: t('choose_silver'),
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.PROFESSIONAL],
            features: [
                { text: t('silver_feat_1'), included: true },
                { text: t('silver_feat_2'), included: true },
                { text: t('silver_feat_3'), included: true },
                { text: <strong>{t('silver_feat_4', { count: 1 })}</strong>, included: true },
                { text: t('silver_feat_5'), included: true },
                { text: t('silver_feat_6'), included: true },
                { text: t('silver_feat_7'), included: true },
                { text: t('platinum_feat_2'), included: false },
            ]
        },
        {
            tier: ProfileTier.SKILLS,
            title: t('gold_tier'),
            description: t('gold_desc'),
            price: formatPrice(15),
            period: ` / ${t('month')}`,
            ctaText: t('start_free_trial'),
            isFeatured: true,
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.SKILLS],
            features: [
                { text: t('gold_feat_1'), included: true },
                { text: <strong>{t('gold_feat_2', { count: 3 })}</strong>, included: true },
                { text: t('gold_feat_3'), included: true },
                { text: t('platinum_feat_2'), included: false },
            ]
        },
        {
            tier: ProfileTier.BUSINESS,
            title: t('platinum_tier'),
            description: t('platinum_desc'),
            price: formatPrice(35),
            period: ` / ${t('month')}`,
            ctaText: t('choose_platinum'),
            onCtaClick: () => onNavigate('engineerSignUp'),
            styles: TIER_STYLES[ProfileTier.BUSINESS],
            features: [
                { text: t('platinum_feat_1'), included: true },
                { text: <strong>{t('platinum_feat_2', { count: 5 })}</strong>, included: true },
                { text: t('platinum_feat_3'), included: true },
                { text: t('platinum_feat_4'), included: true },
                { text: t('platinum_feat_5'), included: true },
            ]
        }
    ];
    
    const RESOURCING_TIER: TierCardProps = {
        title: t('agency_plan'),
        description: t('agency_desc'),
        price: formatPrice(49),
        period: ` / ${t('month')}`,
        ctaText: t('get_started'),
        onCtaClick: () => onNavigate('resourcingCompanySignUp'),
        styles: { border: 'border-indigo-700', titleText: 'text-indigo-800', buttonBg: 'bg-indigo-700', buttonHoverBg: 'hover:bg-indigo-800', badgeBg: 'bg-indigo-700' },
        features: [
            { text: <strong>{t('agency_feat_1', { count: 25 })}</strong>, included: true },
            { text: t('agency_feat_2'), included: true },
            { text: t('agency_feat_3'), included: true },
            { text: t('agency_feat_4'), included: true },
            { text: t('agency_feat_5'), included: true },
            { text: t('agency_feat_6'), included: true },
            { text: t('agency_feat_7', { price: formatPrice(2) }), included: true },
        ]
    };

    return (
        <div className="bg-gray-50 flex flex-col min-h-screen">
            <Header onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
            <main className="flex-grow pt-14">
                <section className="py-4 bg-white text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 mb-1">{t('pricing_title')}</h1>
                        <p className="text-xs md:text-sm text-gray-600 max-w-3xl mx-auto">{t('pricing_subtitle')}</p>
                    </div>
                </section>

                <section className="py-4 checker-plate-background">
                    <div className="container mx-auto px-4 max-w-7xl">
                         <div className="flex justify-center mb-3 border-b border-gray-200">
                            <button onClick={() => setActiveTab('engineers')} className={getTabClass('engineers')}>
                                <User /> {t('for_engineers')}
                            </button>
                            <button onClick={() => setActiveTab('companies')} className={getTabClass('companies')}>
                                <Building /> {t('for_companies_resourcing')}
                            </button>
                        </div>
                        
                        {activeTab === 'engineers' && (
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end fade-in-up">
                               {ENGINEER_TIERS.map(tier => (
                                   <TierCard 
                                       key={tier.title}
                                       {...tier}
                                   />
                               ))}
                            </div>
                        )}
                        
                        {activeTab === 'companies' && (
                           <div className="fade-in-up space-y-6">
                                {/* Section for Companies */}
                                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-lg shadow-lg border-2 border-green-200 text-center">
                                    <h2 className="text-xl font-extrabold text-green-800">{t('for_companies')}</h2>
                                    <p className="text-3xl font-black text-gray-800 my-2">{t('free_forever')}</p>
                                    <p className="text-gray-600 max-w-2xl mx-auto mb-3 text-xs">{t('company_pricing_desc')}</p>
                                    <div className="inline-block bg-white p-3 rounded-md shadow">
                                        <ul className="space-y-1.5 text-left text-sm">
                                            <FeatureListItem>{t('company_feat_1')}</FeatureListItem>
                                            <FeatureListItem>{t('company_feat_2')}</FeatureListItem>
                                            <FeatureListItem>{t('company_feat_3')}</FeatureListItem>
                                            <FeatureListItem>{t('company_feat_4')}</FeatureListItem>
                                            <FeatureListItem>{t('company_feat_5')}</FeatureListItem>
                                        </ul>
                                    </div>
                                    <div className="mt-4">
                                        <button onClick={() => onNavigate('companySignUp')} className="font-bold py-2 px-6 rounded-lg text-white transition-colors bg-green-600 hover:bg-green-700 text-base transform hover:scale-105">
                                            {t('post_job_free')}
                                        </button>
                                    </div>
                                </div>

                                {/* Section for Resourcing Companies */}
                                <div>
                                    <div className="text-center mb-3">
                                        <h2 className="text-xl font-bold text-gray-800">For Resourcing Agencies</h2>
                                        <p className="text-gray-600 mt-1 text-sm">{t('agency_desc')}</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <div className="max-w-md w-full">
                                            <TierCard 
                                                {...RESOURCING_TIER}
                                                description="A powerful toolkit for agencies to manage their talent and workflow efficiently."
                                                isFeatured={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer onNavigate={onNavigate} onHowItWorksClick={onHowItWorksClick} />
        </div>
    );
};
