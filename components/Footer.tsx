import React from 'react';
import { Logo } from './Logo.tsx';
import { APP_NAME } from '../context/AppContext.tsx';

export const Footer = () => (
    <footer className='bg-gray-800 text-white p-8 mt-12'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='col-span-1'>
                <Logo className="text-white" />
                <p className='mt-2 text-gray-400'>Connecting tech talent with opportunity.</p>
            </div>
            <div>
                <h3 className='font-bold'>For Engineers</h3>
                <ul className='mt-2 space-y-2'>
                    <li><a href='#' className='text-gray-400 hover:text-white'>Find Work</a></li>
                    <li><a href='#' className='text-gray-400 hover:text-white'>Profile Setup</a></li>
                    <li><a href='#' className='text-gray-400 hover:text-white'>Pricing</a></li>
                </ul>
            </div>
            <div>
                <h3 className='font-bold'>For Companies</h3>
                <ul className='mt-2 space-y-2'>
                    <li><a href='#' className='text-gray-400 hover:text-white'>Post a Job</a></li>
                    <li><a href='#' className='text-gray-400 hover:text-white'>Find Talent</a></li>
                    <li><a href='#' className='text-gray-400 hover:text-white'>Why It's Free</a></li>
                </ul>
            </div>
            <div>
                <h3 className='font-bold'>Company</h3>
                <ul className='mt-2 space-y-2'>
                    <li><a href='#investors' className='text-gray-400 hover:text-white'>For Investors</a></li>
                    <li><a href='#' className='text-gray-400 hover:text-white'>About Us</a></li>
                    <li><a href='#' className='text-gray-400 hover:text-white'>Contact</a></li>
                </ul>
            </div>
        </div>
        <div className='text-center text-gray-500 mt-8 pt-4 border-t border-gray-700'>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
    </footer>
);
