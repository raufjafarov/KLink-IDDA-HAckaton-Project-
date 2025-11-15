
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useUser, User } from '../hooks/useUser';
import { useLocalization } from '../hooks/useLocalization';

// A simple toast notification component
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2500); // Auto-close after 2.5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out z-50">
            {message}
        </div>
    );
};

// Reusable Card component for settings sections
const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);


const SettingsPage: React.FC = () => {
    const { getCurrentUser, updateCurrentUser, updateUserEmail } = useUser();
    const { t } = useLocalization();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    
    // State for email change flow
    const [emailChangeStep, setEmailChangeStep] = useState<'idle' | 'verifying'>('idle');
    const [newEmail, setNewEmail] = useState('');

    const refreshUser = useCallback(() => {
        setUser(getCurrentUser());
    }, [getCurrentUser]);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const showToast = (message: string) => {
        setToastMessage(message);
    };

    const handleProfileInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            updateCurrentUser({
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture
            });
            showToast(t("settings_page.toast.profile_updated"));
        }
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUser(prevUser => prevUser ? { ...prevUser, profilePicture: reader.result as string } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUser(prevUser => prevUser ? { ...prevUser, [id]: value } : null);
    }

    const handleEmailChangeRequest = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const newEmailInput = form.elements.namedItem('new-email') as HTMLInputElement;
        const confirmEmailInput = form.elements.namedItem('confirm-email') as HTMLInputElement;
        
        if (newEmailInput.value !== confirmEmailInput.value) {
            alert(t("settings_page.alert.emails_do_not_match"));
            return;
        }
        setNewEmail(newEmailInput.value);
        showToast(t("settings_page.toast.email_code_sent"));
        setEmailChangeStep('verifying');
    };

    const handleEmailVerificationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = updateUserEmail(newEmail);
        if (success) {
            showToast(t("settings_page.toast.email_changed"));
            refreshUser();
        } else {
            alert(t("settings_page.alert.email_in_use"));
        }
        setNewEmail('');
        setEmailChangeStep('idle');
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showToast(t("settings_page.toast.password_changed"));
    }


    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('settings_page.title')}</h1>
                </div>

                <div className="space-y-8">
                    {/* Personal Info Card */}
                    <SettingsCard title={t('settings_page.card.personal_info')}>
                        <form onSubmit={handleProfileInfoSubmit}>
                            <div className="p-6 space-y-6">
                                <div className="flex items-center space-x-5">
                                    <div className="relative">
                                        <img
                                            className="h-20 w-20 rounded-full object-cover bg-gray-200"
                                            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName || 'A'}+${user?.lastName || 'B'}&background=c7d2fe&color=3730a3&bold=true`}
                                            alt={t('settings_page.personal_info.profile_picture')}
                                        />
                                        <label htmlFor="profile-picture-upload" className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 transition">
                                            <CameraIcon />
                                            <input id="profile-picture-upload" name="profile-picture-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg" />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">{t('settings_page.personal_info.profile_picture')}</h3>
                                        <p className="text-sm text-gray-500">{t('settings_page.personal_info.picture_formats')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">{t('settings_page.personal_info.first_name')}</label>
                                        <input type="text" id="firstName" value={user?.firstName || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">{t('settings_page.personal_info.last_name')}</label>
                                        <input type="text" id="lastName" value={user?.lastName || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 text-right rounded-b-lg">
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-sm">{t('settings_page.buttons.save')}</button>
                            </div>
                        </form>
                    </SettingsCard>

                    {/* Change Email Card */}
                    <SettingsCard title={t('settings_page.card.change_email')}>
                        {emailChangeStep === 'idle' ? (
                            <form onSubmit={handleEmailChangeRequest}>
                                <div className="p-6 space-y-4">
                                     <div>
                                        <label className="block text-sm font-medium text-gray-700">{t('settings_page.email.current')}</label>
                                        <input type="email" value={user?.email || ''} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">{t('settings_page.email.new')}</label>
                                        <input type="email" id="new-email" name="new-email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="confirm-email" className="block text-sm font-medium text-gray-700">{t('settings_page.email.confirm')}</label>
                                        <input type="email" id="confirm-email" name="confirm-email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 text-right rounded-b-lg">
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-sm">{t('settings_page.buttons.start_change')}</button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleEmailVerificationSubmit}>
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-gray-600">
                                        {t('settings_page.email.verification_prompt', { email: newEmail })}
                                    </p>
                                     <div>
                                        <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">{t('settings_page.email.verification_code')}</label>
                                        <input type="text" id="verification-code" required autoFocus className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                                 <div className="bg-gray-50 px-6 py-3 flex justify-between items-center rounded-b-lg">
                                    <button type="button" onClick={() => setEmailChangeStep('idle')} className="text-sm font-medium text-gray-600 hover:text-gray-800">{t('settings_page.buttons.cancel')}</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-sm">{t('settings_page.buttons.confirm')}</button>
                                </div>
                            </form>
                        )}
                    </SettingsCard>

                    {/* Change Password Card */}
                    <SettingsCard title={t('settings_page.card.change_password')}>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">{t('settings_page.password.current')}</label>
                                    <input type="password" id="current-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">{t('settings_page.password.new')}</label>
                                    <input type="password" id="new-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">{t('settings_page.password.confirm')}</label>
                                    <input type="password" id="confirm-password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 text-right rounded-b-lg">
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 text-sm">{t('settings_page.buttons.change_password')}</button>
                            </div>
                        </form>
                    </SettingsCard>
                </div>
            </div>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: translateY(20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(20px); }
                }
                .animate-fade-in-out {
                    animation: fade-in-out 3s ease-in-out forwards;
                }
            `}</style>
        </Layout>
    );
};

export default SettingsPage;
