import { PoundSterling, DollarSign } from 'lucide-react';
import { Currency } from './types.ts';

export const APP_NAME = "TechSubbies.com";

export const CURRENCY_ICONS = {
  [Currency.GBP]: PoundSterling,
  [Currency.USD]: DollarSign,
};
