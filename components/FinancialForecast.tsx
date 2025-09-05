import React from 'react';

// Define props based on the output of calculateFinancials
interface FinancialForecastProps {
    revenue: { subscriptions: number; microtransactions: number; advertising: number; total: number; };
    users: number;
    costs: { fixed: number; variable: number; staffing: number; payrollTax: number; total: number; headcount: { support: number; developers: number; total: number; } };
    profit: { gross: number; tax: number; net: number; };
}

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Row component for the forecast table
const ForecastRow = ({ label, value, isBold = false, isTotal = false, isSubItem = false, tooltipText }: { label: string, value: string, isBold?: boolean, isTotal?: boolean, isSubItem?: boolean, tooltipText?: string }) => (
    <div className={`flex justify-between py-2 ${isTotal ? 'border-t-2 border-gray-300 font-bold' : 'border-t'} ${isBold ? 'font-bold' : ''}`}>
        <span className={` ${isSubItem ? 'pl-4' : ''}`}>
            {label}
            {tooltipText && (
                <span className="tooltip-container ml-2">
                    ?
                    <span className="tooltip-text">{tooltipText}</span>
                </span>
            )}
        </span>
        <span>{value}</span>
    </div>
);


export const FinancialForecast = ({ revenue, users, costs, profit }: FinancialForecastProps) => {
    return (
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg border">
            <h3 className="text-3xl font-bold text-center mb-6">Commercial Viability Forecast</h3>
            <div className="space-y-6">
                {/* Revenue Section */}
                <div>
                    <h4 className="text-xl font-semibold text-green-700 mb-2">Annual Revenue</h4>
                    <ForecastRow label="Subscription ARR" value={formatCurrency(revenue.subscriptions)} />
                    <ForecastRow label="Microtransactions" value={formatCurrency(revenue.microtransactions)} isSubItem />
                    <ForecastRow label="Advertising" value={formatCurrency(revenue.advertising)} isSubItem />
                    <ForecastRow label="Total Revenue" value={formatCurrency(revenue.total)} isTotal />
                </div>

                {/* Costs Section */}
                 <div>
                    <h4 className="text-xl font-semibold text-red-700 mb-2">Operating Costs (Annual)</h4>
                    <ForecastRow label="Fixed Costs" value={formatCurrency(costs.fixed)} tooltipText="Includes base salaries, office rent, insurance, and software."/>
                    <ForecastRow label="Variable Costs" value={formatCurrency(costs.variable)} tooltipText="Includes hosting costs and payment processing fees that scale with users and revenue."/>
                    <ForecastRow label="Staffing Growth" value={formatCurrency(costs.staffing)} tooltipText={`Hiring ${costs.headcount.support} support agent(s) and ${costs.headcount.developers - 2} additional developer(s) based on user growth and revenue.`} />
                    <ForecastRow label="Employer's NI" value={formatCurrency(costs.payrollTax)} tooltipText="UK Employer's National Insurance contributions on salaries."/>
                    <ForecastRow label="Total Operating Costs" value={formatCurrency(costs.total)} isTotal />
                </div>

                {/* Profit Section */}
                 <div>
                    <h4 className="text-xl font-semibold text-blue-700 mb-2">Profitability</h4>
                    <ForecastRow label="Gross Profit (EBIT)" value={formatCurrency(profit.gross)} isBold />
                    <ForecastRow label="Corporation Tax (25%)" value={formatCurrency(profit.tax)} />
                    <ForecastRow label="Net Profit" value={formatCurrency(profit.net)} isTotal isBold />
                </div>
            </div>
        </div>
    );
};