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

export const i18n: Record<Language, Translations> = {
    [Language.ENGLISH]: en,
    [Language.FRENCH]: fr,
    [Language.SPANISH]: es,
};
