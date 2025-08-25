import { TrainingProvider } from '../types/index.ts';

// --- Training Providers Database ---
export const MOCK_TRAINING_PROVIDERS: TrainingProvider[] = [
    { name: 'Crestron Technical Institute', url: 'https://www.crestron.com/Training-Events/Training', specialties: ['Crestron', 'AV Control', 'DM NVX'] },
    { name: 'Cisco Networking Academy', url: 'https://www.netacad.com/', specialties: ['Cisco', 'Networking', 'Cybersecurity', 'CCNP'] },
    { name: 'AWS Skill Builder', url: 'https://explore.skillbuilder.aws/', specialties: ['AWS', 'Cloud', 'Solutions Architect'] },
    { name: 'Biamp Training', url: 'https://www.biamp.com/training', specialties: ['Biamp', 'Tesira', 'DSP'] },
    { name: 'AVIXA Training', url: 'https://www.avixa.org/training-certification', specialties: ['AV', 'CTS'] },
    { name: 'Microsoft Learn', url: 'https://learn.microsoft.com/', specialties: ['Azure', 'Microsoft 365', 'C#'] },
    { name: 'Q-SYS Training', url: 'https://training.qsc.com/', specialties: ['Q-SYS', 'Q-SYS Designer'] }
];
