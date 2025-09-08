
import { TrainingProvider } from '../types';

// --- Training Providers Database ---
export const MOCK_TRAINING_PROVIDERS: TrainingProvider[] = [
    // Industry Standard
    { name: 'AVIXA Training', url: 'https://www.avixa.org/training-certification', specialties: ['AV', 'CTS', 'CTS-D', 'CTS-I'], type: 'Industry Standard' },
    { name: 'CEDIA Training', url: 'https://cedia.net/education-events/education', specialties: ['Residential AV', 'Home Automation'], type: 'Industry Standard' },
    
    // Manufacturer
    { name: 'Crestron Technical Institute', url: 'https://www.crestron.com/Training-Events/Training', specialties: ['Crestron', 'AV Control', 'DM NVX'], type: 'Manufacturer' },
    { name: 'Cisco Networking Academy', url: 'https://www.netacad.com/', specialties: ['Cisco', 'Networking', 'Cybersecurity', 'CCNP'], type: 'Manufacturer' },
    { name: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws/', specialties: ['AWS', 'Cloud', 'Solutions Architect'], type: 'Manufacturer' },
    { name: 'Biamp Training', url: 'https://www.biamp.com/training', specialties: ['Biamp', 'Tesira', 'DSP'], type: 'Manufacturer' },
    { name: 'Q-SYS Training', url: 'https://training.qsc.com/', specialties: ['Q-SYS', 'QSC', 'Q-SYS Designer'], type: 'Manufacturer' },
    { name: 'Extron Institute', url: 'https://www.extron.com/training', specialties: ['Extron', 'Control Professional', 'AV Associate'], type: 'Manufacturer' },
    { name: 'AMX University', url: 'https://www.amx.com/en-US/training', specialties: ['AMX', 'Control Systems'], type: 'Manufacturer' },
    { name: 'Control4 University', url: 'https://www.control4.com/dealer/training/', specialties: ['Control4', 'Home Automation'], type: 'Manufacturer' },
    { name: 'Audinate (Dante)', url: 'https://www.audinate.com/learning', specialties: ['Dante', 'Audio Networking'], type: 'Manufacturer' },
    { name: 'WyreStorm Technical', url: 'https://www.wyrestorm.com/training-events/', specialties: ['WyreStorm', 'Video Distribution'], type: 'Manufacturer' },

    // Sponsored / Private IT Training
    { name: 'Global Knowledge IT Training', url: 'https://www.globalknowledge.com/', specialties: ['IT Skills', 'Cisco', 'Microsoft', 'Cybersecurity'], type: 'Sponsored' },
    { name: 'QA IT Training', url: 'https://www.qa.com/', specialties: ['IT Skills', 'Project Management', 'Agile', 'Microsoft'], type: 'Sponsored' },
];