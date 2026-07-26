import { Language } from "./types";

interface Translations {
    [key: string]: string;
}

const en: Translations = {
    signed_in_as: 'Signed in as',
    logout: 'Logout',
};

const fr: Translations = {
    signed_in_as: 'Connecté en tant que',
    logout: 'Déconnexion',
};

const es: Translations = {
    signed_in_as: 'Conectado como',
    logout: 'Cerrar sesión',
};

// Partial, not a full Record<Language, ...>: only languages with a
// finished dictionary need an entry here. Any Language not listed falls
// back to English UI text automatically (see SettingsContext's t()) -
// that language can still be used for chat translation right away.
export const i18n: Partial<Record<Language, Translations>> = {
    [Language.ENGLISH]: en,
    [Language.FRENCH]: fr,
    [Language.SPANISH]: es,
};
