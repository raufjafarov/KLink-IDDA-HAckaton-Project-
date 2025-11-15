
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';

const SuccessIcon: React.FC = () => (
    <svg className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuccessPage: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
                <SuccessIcon />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{t('success_page.title')}</h1>
                    <p className="mt-2 text-gray-600">
                        {t('success_page.body')}
                    </p>
                </div>
                <Link
                    to="/login"
                    className="inline-block w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                >
                    {t('success_page.back_button')}
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;
