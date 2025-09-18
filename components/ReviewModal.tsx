import React, { useState } from 'react';
import { Job, EngineerProfile, Review } from '../types';
import { X, Star } from './Icons';
// FIX: Corrected import path for useAppContext to resolve 'not a module' error.
import { useAppContext } from '../context/InteractionContext';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job;
    engineer: EngineerProfile;
    onSubmit: (reviewData: Omit<Review, 'id' | 'date'>) => void;
}

const StarRatingInput = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button" onClick={() => setRating(star)}>
                <Star 
                    size={28} 
                    className={`cursor-pointer transition-colors ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 hover:text-yellow-300'
                    }`} 
                />
            </button>
        ))}
    </div>
);

export const ReviewModal = ({ isOpen, onClose, job, engineer, onSubmit }: ReviewModalProps) => {
    const { user } = useAppContext();
    const [peerRating, setPeerRating] = useState(0); // Technical Skill & Professionalism
    const [customerRating, setCustomerRating] = useState(0); // Communication & Reliability
    const [comment, setComment] = useState('');

    if (!isOpen || !user) return null;

    const handleSubmit = () => {
        if (peerRating === 0 || customerRating === 0 || !comment.trim()) {
            alert("Please provide a rating for both categories and a comment.");
            return;
        }
        onSubmit({
            jobId: job.id,
            companyId: user.profile.id,
            engineerId: engineer.id,
            peerRating,
            customerRating,
            comment,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 m-4 max-w-xl w-full relative transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-2">Leave a Review</h2>
                <p className="text-gray-600 mb-1">For: <span className="font-semibold">{engineer.name}</span></p>
                <p className="text-gray-600 mb-6">Job: <span className="font-semibold">{job.title}</span></p>

                <div className="space-y-6">
                    <div>
                        <label className="block font-medium mb-1">Technical Skill & Professionalism</label>
                        <StarRatingInput rating={peerRating} setRating={setPeerRating} />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Communication & Reliability</label>
                        <StarRatingInput rating={customerRating} setRating={setCustomerRating} />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Comments</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder={`How was your experience working with ${engineer.name}?`}
                            className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};