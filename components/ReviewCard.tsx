import React from 'react';
import { Review, UserProfile } from '../types/index.ts';
import { Star } from './Icons.tsx';

interface ReviewCardProps {
    review: Review;
    company: UserProfile | undefined;
}

const StarRatingDisplay = ({ rating, label }: { rating: number, label: string }) => (
    <div className="flex items-center">
        <span className="text-sm font-semibold text-gray-600 w-48">{label}</span>
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
            ))}
        </div>
    </div>
);

export const ReviewCard = ({ review, company }: ReviewCardProps) => {
    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
            <div className="flex items-start gap-4">
                <img src={company?.avatar || ''} alt={company?.name || 'Company'} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                <div className="flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-bold text-gray-800">{company?.name || 'A Company'}</h4>
                            <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <StarRatingDisplay rating={review.peerRating} label="Technical Skill & Professionalism" />
                            <StarRatingDisplay rating={review.customerRating} label="Communication & Reliability" />
                        </div>
                    </div>
                    <p className="mt-3 text-gray-700 italic border-l-4 border-gray-200 pl-3">"{review.comment}"</p>
                </div>
            </div>
        </div>
    );
};