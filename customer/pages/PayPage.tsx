import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from '../types';

// Fix: Moved PageWrapper outside the PayPage component to avoid re-creation on every render.
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

const PayPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [link, setLink] = useState<Link | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    try {
      const linksJSON = localStorage.getItem('links');
      if (linksJSON) {
        const links: Link[] = JSON.parse(linksJSON);
        const foundLink = links.find(l => l.uniqueId === id);
        if (foundLink) {
          if (foundLink.status === 'PAID') {
            setError('Payment for this link has already been completed.');
          } else {
            setLink(foundLink);
          }
        } else {
          setError('Payment link not found.');
        }
      } else {
        setError('Payment links not found.');
      }
    } catch (err) {
      setError('An error occurred while reading data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleProceed = () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email format.');
        return;
    }

    try {
        const linksJSON = localStorage.getItem('links');
        if (linksJSON) {
            let links: Link[] = JSON.parse(linksJSON);
            const linkIndex = links.findIndex(l => l.uniqueId === id);
            if (linkIndex !== -1) {
                links[linkIndex].buyerEmail = email;
                localStorage.setItem('links', JSON.stringify(links));
                navigate(`/checkout/${id}`);
            } else {
                setError('Link not found while updating.');
            }
        }
    } catch (err) {
        setError('An error occurred while saving data.');
    }
  };

  if (loading) {
    return <PageWrapper><p className="text-center text-slate-500">Loading...</p></PageWrapper>;
  }

  if (error && !link) {
    return <PageWrapper><p className="text-center text-red-500 font-medium">{error}</p></PageWrapper>;
  }

  return (
    <PageWrapper>
      {link ? (
        <div className="space-y-6">
          {link.imageUrl && (
            <img src={link.imageUrl} alt={link.productName} className="w-full h-64 object-cover rounded-lg" />
          )}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 uppercase">{link.productName}</h2>
            <p className="text-3xl font-light text-slate-600 mt-2">
              Amount: <span className="font-semibold text-slate-900">{link.amount.toFixed(2)} AZN</span>
            </p>
          </div>
          <div className="space-y-4">
             {error && <p className="text-sm text-center text-red-500">{error}</p>}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Enter your email to receive the receipt
                </label>
                <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
                />
            </div>
            <button
              onClick={handleProceed}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
};

export default PayPage;