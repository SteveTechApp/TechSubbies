import { Currency } from '../types';

export const formatCurrencyAmount = (amount: number, currency: Currency = Currency.GBP) =>
    `${currency}${amount.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
