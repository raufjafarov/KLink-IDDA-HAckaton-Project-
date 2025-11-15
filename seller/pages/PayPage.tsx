
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
  
const PayPage: React.FC = () => {
    const { linkId } = useParams<{ linkId: string }>();
    const navigate = useNavigate();
    const { getLinkById } = useLinks();
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
            if (foundLink.status !== 'Gözləmədə') {
                 setError(t('public_page.error.link_paid_or_invalid'));
            } else {
                setLink(foundLink);
            }
        } else {
            setError(t('public_page.error.link_not_found'));
        }
        setIsLoading(false);
    }, [linkId, getLinkById, t]);
    
    const handleProceed = () => {
        if (linkId) {
            navigate(`/checkout/${linkId}`);
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
                    <div className="flex flex-col items-center space-y-4 mb-6">
                        {link.image ? (
                            <img src={link.image} alt={link.name} className="w-32 h-32 object-cover rounded-lg shadow-md" />
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">{t('pay_page.no_image')}</span>
                            </div>
                        )}
                        <h1 className="text-2xl font-bold text-gray-800">{link.name}</h1>
                        <p className="text-4xl font-extrabold text-indigo-600 tracking-tight">{link.amount.toFixed(2)} AZN</p>
                    </div>

                     <button onClick={handleProceed} type="button" className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-105">
                        {t('pay_page.proceed_button')}
                    </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-b-2xl flex justify-center items-center space-x-2">
                    <KlinkLogoText />
                </div>
            </div>
        </div>
    );
};

export default PayPage;
