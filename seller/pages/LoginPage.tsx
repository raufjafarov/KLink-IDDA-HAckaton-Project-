
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useLocalization } from '../hooks/useLocalization';


const KlinkLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
    <h1 className={`text-4xl font-bold text-gray-800 ${className}`}>
        <span className="text-indigo-600">K</span>LINK
    </h1>
);

const MailIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);


const LoginPage: React.FC = () => {
  const { login } = useAuthActions();
  const { getUsers, addUser, setCurrentUser } = useUser();
  const [email, setEmail] = useState('demo@klink.az');
  const { t } = useLocalization();

  const seedInitialData = () => {
    // Check if data has already been seeded
    if (localStorage.getItem('klink_isSeeded')) {
      return;
    }

    // 1. Seed Fake Links to get an initial balance.
    const fakeLinks = [
      { id: `O_${Date.now() - 350000}`, name: 'Kətan Şərf', amount: 64.50, status: 'ÖDƏNİLDİ', createdAt: Date.now() - 350000 },
      { id: `O_${Date.now() - 250000}`, name: 'Vintage Gözlük', amount: 75.00, status: 'ÖDƏNİLDİ', createdAt: Date.now() - 250000 },
      { id: `O_${Date.now() - 150000}`, name: 'Gümüş Boyunbağı', amount: 85.50, status: 'Tamamlandı', createdAt: Date.now() - 150000 },
      { id: `O_${Date.now() - 50000}`, name: 'Əl işi Dəri Çanta', amount: 125.00, status: 'Tamamlandı', createdAt: Date.now() - 50000 },
    ];
    localStorage.setItem('klink_links', JSON.stringify(fakeLinks));

    // 2. Seed a Fake Bank Card
    const fakeCard = {
      id: `card_${Date.now()}`,
      cardNumber: '5555444433331234',
      expiryDate: '12/28',
      cvv: '123',
      holderName: 'Demo İstifadəçi',
    };
    localStorage.setItem('klink_bank_cards', JSON.stringify([fakeCard]));

    // 3. Seed Fake Withdrawal History
    const fakeWithdrawals = [
      { id: `wd_${Date.now() - 100000}`, amount: 50.00, bankCardId: fakeCard.id, status: 'Tamamlandı', createdAt: Date.now() - 100000 },
      { id: `wd_${Date.now() - 200000}`, amount: 110.00, bankCardId: fakeCard.id, status: 'Tamamlandı', createdAt: Date.now() - 200000 },
       { id: `wd_${Date.now() - 20000}`, amount: 40.00, bankCardId: fakeCard.id, status: 'Emal edilir', createdAt: Date.now() - 20000 },
    ];
    localStorage.setItem('klink_withdrawals', JSON.stringify(fakeWithdrawals));
    
    // Mark as seeded
    localStorage.setItem('klink_isSeeded', 'true');
  };

  const handleDemoLogin = () => {
      let users = getUsers();
      if (users.length === 0) {
          const demoUser1 = { email: 'demo@klink.az', firstName: 'Demo', lastName: 'İstifadəçi', profilePicture: null };
          const demoUser2 = { email: 'test@klink.az', firstName: 'Test', lastName: 'Hesab', profilePicture: null };
          addUser(demoUser1);
          addUser(demoUser2);
          users = [demoUser1, demoUser2]; // Refresh users list
      }
      
      // Seed data on the very first demo login
      seedInitialData();

      // Log in with the first user available, or the first demo user
      setCurrentUser(users[0].email);
      login();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP, login logic is simplified. It finds a user or defaults to demo login.
    const users = getUsers();
    const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if(userExists) {
        setCurrentUser(userExists.email);
        login();
    } else {
        // If user not found, default to creating demo accounts and logging in.
        handleDemoLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <KlinkLogo />
          <p className="text-gray-500">{t('login_page.title')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon />
            </div>
            <input
              type="email"
              placeholder={t('login_page.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon />
            </div>
            <input
              type="password"
              placeholder={t('login_page.password_placeholder')}
              defaultValue="demopassword"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105"
          >
            {t('login_page.login_button')}
          </button>
        </form>
         <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">{t('login_page.or_separator')}</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>
         <button
            onClick={handleDemoLogin}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition"
        >
            {t('login_page.demo_login_button')}
        </button>
        <p className="text-center text-gray-500 pt-2">
          {t('login_page.no_account')}{' '}
          <Link to="/qeydiyyat" className="font-semibold text-indigo-600 hover:text-indigo-500">
            {t('login_page.sign_up_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
