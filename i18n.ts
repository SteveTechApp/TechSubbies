import { Language } from './types';

const translations: Record<Language, Record<string, string>> = {
    [Language.ENGLISH]: {
        'signed_in_as': 'Signed in as',
        'logout': 'Logout',
    },
    [Language.SPANISH]: {
        'signed_in_as': 'Conectado como',
        'logout': 'Cerrar sesión',
    },
    [Language.FRENCH]: {
        'signed_in_as': 'Connecté en tant que',
        'logout': 'Déconnexion',
    },
};

export default translations;
