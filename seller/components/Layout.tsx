
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import { useUser, User } from '../hooks/useUser';
import { useLocalization } from '../hooks/useLocalization';

const KlinkLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
    <h1 className={`text-2xl font-bold text-gray-800 hidden sm:block ${className}`}>
        <span className="text-indigo-600">K</span>LINK
    </h1>
);

const UserIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8 text-gray-400" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

const ProfileAvatar: React.FC<{ user: User | null; size?: number }> = ({ user, size = 8 }) => {
    const classSize = `h-${size} w-${size}`;
    if (user?.profilePicture) {
      return <img className={`${classSize} rounded-full object-cover`} src={user.profilePicture} alt="User profile" />;
    }
    if (user?.firstName) {
        return (
            <span className={`inline-flex ${classSize} items-center justify-center rounded-full bg-indigo-100`}>
                <span className="text-sm font-medium leading-none text-indigo-700">{user.firstName[0]}</span>
            </span>
        );
    }
    return <UserIcon className={classSize} />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout } = useAuthActions();
    const { getCurrentUser, getUsers, setCurrentUser } = useUser();
    const { language, setLanguage, t } = useLocalization();

    const [currentUser, setCurrentUserState] = useState<User | null>(null);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchUserData = useCallback(() => {
        setCurrentUserState(getCurrentUser());
        setAllUsers(getUsers());
    }, [getCurrentUser, getUsers]);

    useEffect(() => {
        fetchUserData();
        window.addEventListener('storage', fetchUserData);
        return () => {
            window.removeEventListener('storage', fetchUserData);
        };
    }, [fetchUserData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleAddAccount = () => {
        setIsDropdownOpen(false);
        navigate('/qeydiyyat');
    }

    const handleSwitchUser = (email: string) => {
        setCurrentUser(email);
        setIsDropdownOpen(false);
        window.location.reload();
    };

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
            ? 'bg-indigo-50 text-indigo-700'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-6">
                            <Link to="/dashboard" className="flex items-center space-x-3 flex-shrink-0">
                                <KlinkLogo />
                            </Link>
                            <div className="hidden md:flex items-baseline space-x-1">
                                <NavLink to="/dashboard" className={getNavLinkClass} end>
                                    {t('layout.nav.dashboard')}
                                </NavLink>
                                <NavLink to="/analytics" className={getNavLinkClass}>
                                    {t('layout.nav.analytics')}
                                </NavLink>
                                <NavLink to="/balance" className={getNavLinkClass}>
                                    {t('layout.nav.balance')}
                                </NavLink>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${language === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => setLanguage('az')}
                                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${language === 'az' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    AZ
                                </button>
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <ProfileAvatar user={currentUser} />
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}`: t('layout.user_menu.menu')}
                                    </span>
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-20">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
                                            <p className="text-sm text-gray-500 truncate">{currentUser?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                to="/settings"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('layout.user_menu.settings')}
                                            </Link>
                                        </div>
                                        {allUsers.filter(u => u.email !== currentUser?.email).length > 0 && (
                                             <div className="border-t border-gray-100 py-1">
                                                 <p className="px-4 pt-1 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('layout.user_menu.switch_account')}</p>
                                                {allUsers.filter(u => u.email !== currentUser?.email).map(user => (
                                                     <button key={user.email} onClick={() => handleSwitchUser(user.email)} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        <ProfileAvatar user={user} />
                                                        <div className="flex-1">
                                                            <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
                                                            <p className="text-gray-500 truncate text-xs">{user.email}</p>
                                                        </div>
                                                     </button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="border-t border-gray-100 py-1">
                                            <button
                                                onClick={handleAddAccount}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {t('layout.user_menu.add_account')}
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                {t('layout.user_menu.logout')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
