
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLinks, PaymentLink } from '../hooks/useLinks';
import { useLocalization } from '../hooks/useLocalization';

const KlinkLogoText: React.FC = () => {
    const { t } = useLocalization();
    return (
    <span className="text-sm font-semibold text-gray-600">
        {t('public_page.powered_by')}{' '}
        <span className="font-bold"><span className="text-indigo-600">K</span>LINK</span>
    </span>
    );
};

const CheckoutPage: React.FC = () => {
    const { linkId } = useParams<{ linkId: string }>();
    const navigate = useNavigate();
    const { getLinkById, updateLinkStatus } = useLinks();
    const { t } = useLocalization();

    const [link, setLink] = useState<PaymentLink | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!linkId) {
            setError(t('public_page.error.link_id_missing'));
            setIsLoading(false);
            return;
        }
        const foundLink = getLinkById(linkId);
        if (foundLink) {
             if (foundLink.status === 'ÖDƏNİLDİ') {
                 setError(t('public_page.error.link_paid_or_invalid'));
            } else {
                setLink(foundLink);
            }
        } else {
            setError(t('public_page.error.link_not_found'));
        }
        setIsLoading(false);
    }, [linkId, getLinkById, t]);

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (link) {
            updateLinkStatus(link.id, 'ÖDƏNİLDİ');
            navigate('/success');
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">{t('public_page.loading')}</div>;
    }
    
    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
                <h2 className="text-2xl font-bold text-red-600">{t('public_page.error.title')}</h2>
                <p className="mt-2 text-gray-700">{error}</p>
            </div>
        );
    }

    if (!link) {
        return null; // Should be handled by error state
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg">
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold text-gray-800">{link.name}</h1>
                        <p className="text-3xl font-extrabold text-indigo-600 tracking-tight">{link.amount.toFixed(2)} AZN</p>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <p className="text-sm text-center text-gray-500">{t('checkout_page.simulation_note')}</p>
                        <div>
                            <label className="text-sm font-medium text-gray-700">{t('checkout_page.card_number')}</label>
                            <input disabled value="4111 1111 1111 1111" className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700">{t('checkout_page.expiry_date')}</label>
                                    <input disabled value="12/26" className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed" />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium text-gray-700">{t('checkout_page.cvc')}</label>
                                <input disabled value="123" className="mt-1 w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed" />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform hover:scale-105">
                            {t('checkout_page.confirm_button')}
                        </button>
                    </form>
                </div>
                <div className="bg-gray-50 p-4 rounded-b-2xl flex justify-center items-center space-x-2">
                    <KlinkLogoText />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
