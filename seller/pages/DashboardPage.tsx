
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLinks, PaymentLink } from '../hooks/useLinks';
import { useLocalization } from '../hooks/useLocalization';

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

const EmptyTableIcon: React.FC = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
);

const StatusBadge: React.FC<{ status: PaymentLink['status'] }> = ({ status }) => {
    const { t } = useLocalization();
    const baseClasses = 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
    if (status === 'ÖDƏNİLDİ') {
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{t('dashboard_page.status.paid')}</span>;
    }
    if (status === 'Tamamlandı') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{t('dashboard_page.status.completed')}</span>;
    }
    return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{t('dashboard_page.status.created')}</span>;
};

const LinkDisplay: React.FC<{ linkId: string }> = ({ linkId }) => {
    const [copied, setCopied] = useState(false);
    const { t } = useLocalization();
    const displayLink = `.../pay/${linkId}`;
    
    const handleCopy = () => {
        const fullLink = `${window.location.origin}${window.location.pathname}#/pay/${linkId}`;
        navigator.clipboard.writeText(fullLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{displayLink}</span>
            <button
                onClick={handleCopy}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${copied ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
            >
                {copied ? t('dashboard_page.copied_button') : t('dashboard_page.copy_button')}
            </button>
        </div>
    );
};


const DashboardPage: React.FC = () => {
    const [links, setLinks] = useState<PaymentLink[]>([]);
    const { getLinks } = useLinks();
    const { t } = useLocalization();

    useEffect(() => {
        const interval = setInterval(() => setLinks(getLinks()), 500);
        return () => clearInterval(interval);
    }, [getLinks]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('dashboard_page.title')}</h1>
                    <Link
                        to="/create-link"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-200 transform hover:scale-105"
                    >
                        <PlusIcon />
                        {t('dashboard_page.new_link_button')}
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard_page.table.product_name')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard_page.table.amount')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard_page.table.status')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('dashboard_page.table.payment_link')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {links.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="text-center py-20 px-6">
                                            <EmptyTableIcon />
                                            <h3 className="mt-4 text-lg font-medium text-gray-900">{t('dashboard_page.empty.title')}</h3>
                                            <p className="mt-1 text-sm text-gray-500">{t('dashboard_page.empty.description')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                links.map(link => (
                                    <tr key={link.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{link.name}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{link.amount.toFixed(2)} AZN</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={link.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><LinkDisplay linkId={link.id} /></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;
