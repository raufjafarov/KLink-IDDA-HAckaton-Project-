import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from '../types';

// Moved PageWrapper outside the CheckoutPage component to avoid re-creation on every render.
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">
        <span className="text-indigo-600">K</span>LINK
      </h1>
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );

const ApplePayIcon = () => (
    <svg height="24" viewBox="0 0 128 52.3" xmlns="http://www.w3.org/2000/svg"><path d="M128 52.3V0H0v52.3z" fill="#000"></path><g fill="#fff"><path d="M83.8 29.5c0 .8.8 1.2 1.9 1.2s1.9-.4 1.9-1.2c0-.8-.8-1.2-1.9-1.2s-1.9.4-1.9 1.2zm-1.1 0c0-1.5 1.4-2.3 3-2.3s3 1 3 2.1c0 .6-.2 1.1-.7 1.4.5.3.8.8.8 1.5 0 1.2-1.3 2.1-3.1 2.1s-3-1-3-2.3c0-.6.3-1.1.7-1.4-.4-.3-.7-.8-.7-1.3zm12.3-3.2h1.1v5.6h-1.1zm3.8 5.6V26h3.4v1h-2.3v.9h2.2v1h-2.2v1.7zM66.4 27.6v-.9h-1.2v-1.1h3.7v1.1h-1.2v.9zm1.9 2.6v-3.7h1.1v3.7zm2.4 0v-3.7h1.3c1.4 0 2 .5 2 1.9s-.6 1.9-2 1.9zm1.1.9h.2c1.8 0 2.9-.8 2.9-2.8s-1.1-2.8-2.9-2.8h-1.3v5.6zm-18.7-1.2v-1.1h2.4v-1h-2.4v-1.2h2.7v-1.1H49.7v4.4zm5.1-4.4h1.1v4.4h-1.1zm3.8 0h1.1v3.4h2.4v1h-3.5z"></path><path d="M43.3 18.2c1.3.1 2.6-.2 3.8-.8 1.1-.6 2.1-1.4 2.8-2.5.2-.3.3-.6.5-.9.1-.3.2-.6.2-.9-.1.3-.2.6-.3.9-.1.3-.2.6-.4.8-.7 1.1-1.6 2-2.8 2.6-1.1.6-2.4.9-3.7.8-1.2-.1-2.5-.4-3.6-1-.9-.6-1.8-1.4-2.5-2.4-.7-1-1.2-2.1-1.5-3.3-.3-1.2-.4-2.5-.1-3.7.3-1.2.9-2.3 1.7-3.3s1.7-1.8 2.9-2.5c1.2-.6 2.4-.9 3.7-1 .3 1.2.2 2.4-.1 3.6-.3 1.2-.9 2.3-1.7 3.2-.8.9-1.8 1.6-2.9 2.1-1.1.5-2.3.7-3.4.7-1.3 0-2.6-.4-3.7-1.1-1.1-.7-2-1.7-2.7-2.8-.7-1.1-1.1-2.4-1.1-3.8 0-1.6.5-3.2 1.5-4.5 1-1.3 2.4-2.4 4-3.1 1.6-.7 3.4-1.1 5.2-1.1 1.6 0 3.2.3 4.7.9 1.5.6 2.9 1.5 4.1 2.7.2.2.4.4.6.6.2.2.4.5.6.7-.2-.3-.5-.5-.7-.7-.2-.2-.4-.4-.6-.6-1.2-1.1-2.6-2-4.1-2.6-1.5-.6-3.1-.9-4.7-.9-1.8 0-3.6.4-5.2 1.1-1.6.7-3.1 1.8-4.2 3-1.1 1.2-1.9 2.7-2.4 4.4-.5 1.6-.6 3.4-.3 5.1.3 1.7.9 3.3 1.9 4.8 1 1.5 2.3 2.7 3.8 3.7s3.2 1.8 5 2c.2 0 .4.1.6.1h.4z"></path></g></svg>
);

const GooglePayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 76 30"><rect width="76" height="30" rx="4" fill="#fff" stroke="#888" strokeWidth="1"></rect><g transform="translate(19.2 6.4)"><path d="M9.42 2.06h2.23L13.88 0h-4.3zm2.59 7.42c-.62 0-1.12-.5-1.12-1.12s.5-1.12 1.12-1.12 1.12.5 1.12 1.12c0 .61-.5 1.12-1.12 1.12zm-3.8 2.59V9.48h7.61V12zm6.65-8.03c-.2-.21-.48-.34-.78-.34H8.48c-.53 0-.96.43-.96.96v.02c0 .28.13.55.34.74l3.14 3.1c.21.2.34.48.34.78v2.1c0 .53.43.96.96.96h.02c.28 0 .55-.13.74-.34l3.1-3.14c.2-.21.48-.34.78-.34h.6c.53 0 .96-.43.96-.96v-.6c0-.3-.13-.57-.34-.78z" fill="#4285F4"></path><path d="M3.14 8.52c0-2.26 1.3-3.46 3.09-3.46 1.2 0 1.9.52 2.47 1.2l-1.15.82c-.36-.5-.77-.8-1.32-.8-1 0-1.6.64-1.6 1.62 0 .98.6 1.63 1.6 1.63.55 0 .96-.3 1.32-.8l1.15.82c-.57.68-1.27 1.2-2.47 1.2-1.8 0-3.1-1.2-3.1-3.46zM13.3 5.2h1.2v6.6h-1.2z" fill="#5F6368"></path><path d="M19.16 8.52c0-1.26.98-2.02 2.1-2.02.58 0 1.05.2 1.42.53l-.6 1c-.26-.23-.55-.4-..82-.4-.5 0-.82.3-.82.8s.33.8.83.8c.27 0 .56-.17.82-.4l.6 1c-.37.33-.84.53-1.42.53-1.12 0-2.1-0.76-2.1-2.02z" fill="#5F6368" transform="translate(-1.4)"></path><path d="M21.7 8.52c0-2.26 1.3-3.46 3.09-3.46 1.2 0 1.9.52 2.47 1.2l-1.15.82c-.36-.5-.77-.8-1.32-.8-1 0-1.6.64-1.6 1.62 0 .98.6 1.63 1.6 1.63.55 0 .96-.3 1.32-.8l1.15.82c-.57.68-1.27 1.2-2.47 1.2-1.8 0-3.1-1.2-3.1-3.46zM32 5.2l-1.3 6.6h-1.2L28.2 5.2h1.28l.78 3.9.77-3.9z" fill="#5F6368"></path></g></svg>
);


const CheckoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<Link | null>(null);
  
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!id) return;
    try {
      const linksJSON = localStorage.getItem('links');
      if (linksJSON) {
        const links: Link[] = JSON.parse(linksJSON);
        const foundLink = links.find(l => l.uniqueId === id);
        if (foundLink) {
            if (!foundLink.buyerEmail) {
                navigate(`/pay/${id}`); // Redirect if email step was skipped
            }
          setLink(foundLink);
        } else {
          setErrors({ form: 'Payment link not found.' });
        }
      }
    } catch (err) {
      setErrors({ form: 'An error occurred while reading data.' });
    }
  }, [id, navigate]);
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!cardholderName.trim()) {
        newErrors.cardholderName = 'Full name is required.';
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits.';
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = 'Date must be in MM/YY format.';
    } else {
        const [monthStr, yearStr] = expiryDate.split('/');
        const month = parseInt(monthStr, 10);
        const year = parseInt(`20${yearStr}`, 10);
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 1-12
        const currentYear = today.getFullYear();
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
             newErrors.expiryDate = 'Card has expired.';
        }
    }

    if (cvc.length < 3) {
        newErrors.cvc = 'CVC must be 3 or 4 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPayment = () => {
     if (!validateForm()) {
       return;
     }
     try {
        const linksJSON = localStorage.getItem('links');
        if (linksJSON) {
            let links: Link[] = JSON.parse(linksJSON);
            const linkIndex = links.findIndex(l => l.uniqueId === id);
            if (linkIndex !== -1) {
                links[linkIndex].status = 'PAID';
                localStorage.setItem('links', JSON.stringify(links));
                navigate('/success');
            } else {
                setErrors({form: 'Link not found while updating.'});
            }
        }
    } catch (err) {
        setErrors({form: 'An error occurred while saving data.'});
    }
  };
  
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = e.target.value
            .replace(/\D/g, '')
            .slice(0, 16)
            .replace(/(\d{4})/g, '$1 ')
            .trim();
        setCardNumber(formatted);
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        setExpiryDate(value);
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setCvc(value);
        }
    };


  if (errors.form) {
    return <PageWrapper><p className="text-center text-red-500 font-medium">{errors.form}</p></PageWrapper>;
  }
  
  if (!link) {
    return <PageWrapper><p className="text-center text-slate-500">Loading...</p></PageWrapper>;
  }

  return (
    <PageWrapper>
        <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Payment Information</h2>
            <p className="text-slate-500">Total amount: {link.amount.toFixed(2)} AZN</p>
        </div>
        <div className="space-y-4">
            <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                    type="text"
                    id="cardholderName"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${errors.cardholderName ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
            </div>
            <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-1">Card number</label>
                <input
                    type="tel"
                    id="cardNumber"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${errors.cardNumber ? 'border-red-500' : 'border-slate-300'}`}
                />
                 {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">Expiry date</label>
                     <input
                        type="tel"
                        id="expiryDate"
                        inputMode="numeric"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${errors.expiryDate ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                <div className="w-1/2">
                    <label htmlFor="cvc" className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                    <input
                        type="tel"
                        id="cvc"
                        inputMode="numeric"
                        value={cvc}
                        onChange={handleCvcChange}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${errors.cvc ? 'border-red-500' : 'border-slate-300'}`}
                    />
                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                </div>
            </div>
            <div className="pt-2">
                <button
                    onClick={handleConfirmPayment}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
                >
                    CONFIRM PAYMENT
                </button>
            </div>
             <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>
             <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                 <button
                    onClick={handleConfirmPayment}
                    className="w-full flex items-center justify-center bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
                    aria-label="Pay with Apple Pay"
                >
                    <ApplePayIcon />
                </button>
                 <button
                    onClick={handleConfirmPayment}
                    className="w-full flex items-center justify-center bg-white text-black border border-slate-300 py-2 px-4 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition"
                    aria-label="Pay with Google Pay"
                >
                    <GooglePayIcon />
                </button>
            </div>
             <p className="text-xs text-slate-400 text-center pt-2">This is a simulation. No real payment information is required.</p>
        </div>
    </PageWrapper>
  );
};

export default CheckoutPage;