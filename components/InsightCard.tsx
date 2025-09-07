import React from 'react';
import { Insight } from '../types';
import { Lightbulb, Award, Edit, ArrowRight } from './Icons';

interface InsightCardProps {
    insight: Insight;
    onNavigate: (view: string) => void;
}

const getInsightStyle = (type: Insight['type']) => {
    switch (type) {
        case 'Upskill':
            return { icon: Lightbulb, color: 'blue' };
        case 'Certification':
            return { icon: Award, color: 'green' };
        case 'Profile Enhancement':
            return { icon: Edit, color: 'purple' };
        default:
            return { icon: Lightbulb, color: 'gray' };
    }
};

export const InsightCard = ({ insight, onNavigate }: InsightCardProps) => {
    const { icon: Icon, color } = getInsightStyle(insight.type);
    const colors = {
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-500' },
        green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-600' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: 'text-purple-600' },
        gray: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: 'text-gray-500' },
    };
    const style = colors[color as keyof typeof colors];

    return (
        <div className={`p-4 border-l-4 rounded-r-lg ${style.bg} ${style.border}`}>
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-2 bg-white rounded-full mt-1 ${style.icon}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className={`font-bold text-lg ${style.text}`}>{insight.type}</h3>
                    <p className="text-gray-700">{insight.suggestion}</p>
                    {insight.callToAction && (
                        <button 
                            onClick={() => onNavigate(insight.callToAction.view)}
                            className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center group"
                        >
                            {insight.callToAction.text}
                            <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};