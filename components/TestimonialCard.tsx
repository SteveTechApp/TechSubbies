
import React from 'react';
import { Star } from './Icons';

interface TestimonialCardProps {
    text: string;
    author: string;
    company: string;
    avatar: string;
}

export const TestimonialCard = ({ text, author, company, avatar }: TestimonialCardProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
            <div className="flex items-center mb-4">
                <img src={avatar} alt={author} className="w-14 h-14 rounded-full mr-4 border-2 border-blue-200" />
                <div>
                    <p className="font-bold text-lg text-gray-800">{author}</p>
                    <p className="text-sm text-gray-500">{company}</p>
                </div>
            </div>
            <p className="text-gray-600 italic flex-grow">"{text}"</p>
            <div className="flex mt-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-400 fill-current" />)}
            </div>
        </div>
    );
};
