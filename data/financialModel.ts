import { ProfileTier } from '../types/index.ts';

// Pricing data
export const TIER_PRICES = {
    [ProfileTier.BASIC]: 0,
    [ProfileTier.PROFESSIONAL]: 7, // Silver
    [ProfileTier.SKILLS]: 15,       // Gold
    [ProfileTier.BUSINESS]: 35,      // Platinum
};

// Operational cost assumptions
const OPERATIONAL_COSTS = {
    // Fixed Annual Costs
    baseSalaries: 150000, // 2 Devs + 1 Founder
    officeRent: 20000, // Small office in Oxfordshire
    insurance: 5000,
    softwareLicensing: 10000,

    // Per-User/Per-Transaction Variable Costs
    hostingCostPer1000UsersPerMonth: 50,
    transactionFeePercentage: 0.02, // 2% of transaction revenue

    // Scalable Staffing Costs
    supportAgentCostPerYear: 35000,
    usersPerSupportAgent: 2000,
    developerCostPerYear: 65000,
    revenueThresholdPerDeveloper: 400000,

    // Taxes
    corporationTaxRate: 0.25,
    employersNationalInsuranceRate: 0.138,
};

// The calculation function, callable from any component
export const calculateFinancials = (subscriberNumbers: { [key in ProfileTier]?: number }) => {
    const subs = {
        [ProfileTier.PROFESSIONAL]: subscriberNumbers[ProfileTier.PROFESSIONAL] || 0,
        [ProfileTier.SKILLS]: subscriberNumbers[ProfileTier.SKILLS] || 0,
        [ProfileTier.BUSINESS]: subscriberNumbers[ProfileTier.BUSINESS] || 0,
    };

    const totalSubscribers = subs[ProfileTier.PROFESSIONAL] + subs[ProfileTier.SKILLS] + subs[ProfileTier.BUSINESS];
    // Assuming a 20:1 ratio of total users to paid subscribers
    const totalUsers = totalSubscribers > 0 ? totalSubscribers * 20 : 0;

    // --- Revenue Calculation ---
    const annualSubscriptionRevenue = (
        (subs[ProfileTier.PROFESSIONAL] * TIER_PRICES[ProfileTier.PROFESSIONAL] * 12) +
        (subs[ProfileTier.SKILLS] * TIER_PRICES[ProfileTier.SKILLS] * 12) +
        (subs[ProfileTier.BUSINESS] * TIER_PRICES[ProfileTier.BUSINESS] * 12)
    );
    // Simulate other revenues as a percentage of subscription revenue
    const annualMicrotransactionRevenue = annualSubscriptionRevenue * 0.15;
    const annualAdRevenue = annualSubscriptionRevenue * 0.10;
    const totalAnnualRevenue = annualSubscriptionRevenue + annualMicrotransactionRevenue + annualAdRevenue;

    const revenue = {
        subscriptions: annualSubscriptionRevenue,
        microtransactions: annualMicrotransactionRevenue,
        advertising: annualAdRevenue,
        total: totalAnnualRevenue,
    };

    // --- Cost Calculation ---
    const fixedCosts = OPERATIONAL_COSTS.baseSalaries + OPERATIONAL_COSTS.officeRent + OPERATIONAL_COSTS.insurance + OPERATIONAL_COSTS.softwareLicensing;
    
    const variableHostingCost = (totalUsers / 1000) * OPERATIONAL_COSTS.hostingCostPer1000UsersPerMonth * 12;
    const variableTransactionFee = (annualMicrotransactionRevenue) * OPERATIONAL_COSTS.transactionFeePercentage;

    const numSupportAgents = totalUsers > 0 ? Math.floor(totalUsers / OPERATIONAL_COSTS.usersPerSupportAgent) : 0;
    const supportSalaryCost = numSupportAgents * OPERATIONAL_COSTS.supportAgentCostPerYear;
    
    const numExtraDevelopers = totalAnnualRevenue > 0 ? Math.floor(totalAnnualRevenue / OPERATIONAL_COSTS.revenueThresholdPerDeveloper) : 0;
    const developerSalaryCost = numExtraDevelopers * OPERATIONAL_COSTS.developerCostPerYear;

    const totalSalaryCost = OPERATIONAL_COSTS.baseSalaries + supportSalaryCost + developerSalaryCost;
    const nationalInsuranceCost = totalSalaryCost * OPERATIONAL_COSTS.employersNationalInsuranceRate;
    
    const totalOperatingCosts = fixedCosts + variableHostingCost + variableTransactionFee + supportSalaryCost + developerSalaryCost + nationalInsuranceCost;

    const costs = {
        fixed: fixedCosts,
        variable: variableHostingCost + variableTransactionFee,
        staffing: supportSalaryCost + developerSalaryCost,
        payrollTax: nationalInsuranceCost,
        total: totalOperatingCosts,
        headcount: {
            support: numSupportAgents,
            developers: 2 + numExtraDevelopers,
            total: 3 + numSupportAgents + numExtraDevelopers,
        }
    };
    
    // --- Profit Calculation ---
    const grossProfit = totalAnnualRevenue - totalOperatingCosts;
    const corporationTax = Math.max(0, grossProfit * OPERATIONAL_COSTS.corporationTaxRate);
    const netProfit = grossProfit - corporationTax;

    const profit = {
        gross: grossProfit,
        tax: corporationTax,
        net: netProfit,
    };

    return { totalRevenue: revenue, totalUsers, costs, profit };
};