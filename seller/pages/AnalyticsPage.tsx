
import React, { useMemo } from 'react';
import Layout from '../components/Layout';
import { useLinks } from '../hooks/useLinks';
import { useLocalization } from '../hooks/useLocalization';

const ChartIcon: React.FC = () => (
    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-4">
        <div className="bg-indigo-100 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    </div>
);

const AnalyticsPage: React.FC = () => {
    const { getLinks } = useLinks();
    const { t } = useLocalization();

    const analyticsData = useMemo(() => {
        // Analytics should be based on finalized transactions
        const completedLinks = getLinks().filter(link => link.status === 'Tamamlandı');
        const totalRevenue = completedLinks.reduce((sum, link) => sum + link.amount, 0);
        const totalOrders = completedLinks.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            sales: completedLinks
        };
    }, [getLinks]);

    const maxSale = Math.max(...analyticsData.sales.map(s => s.amount), 1); // Use 1 as minimum to avoid division by zero

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('analytics_page.title')}</h1>
                </div>

                {analyticsData.totalOrders === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <ChartIcon />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">{t('analytics_page.no_data.title')}</h2>
                        <p className="mt-2 text-gray-600">
                            {t('analytics_page.no_data.description')}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard 
                                title={t('analytics_page.card.total_revenue')} 
                                value={`${analyticsData.totalRevenue.toFixed(2)} AZN`} 
                                icon={<svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} 
                            />
                            <StatCard 
                                title={t('analytics_page.card.successful_orders')}
                                value={analyticsData.totalOrders.toString()} 
                                icon={<svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
                            />
                            <StatCard 
                                title={t('analytics_page.card.avg_order_value')} 
                                value={`${analyticsData.averageOrderValue.toFixed(2)} AZN`} 
                                icon={<svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                            />
                        </div>
                        
                        {/* Sales Chart */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">{t('analytics_page.chart.sales_title')}</h2>
                             <div className="h-80 flex items-end justify-around space-x-4">
                                {analyticsData.sales.map((sale, index) => (
                                    <div key={sale.id} className="flex-1 flex flex-col items-center group">
                                        <div className="text-xs font-bold text-white bg-gray-800 px-2 py-1 rounded-md mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {sale.amount.toFixed(2)} AZN
                                        </div>
                                        <div 
                                            className="w-full bg-indigo-600 rounded-t-md transition-all duration-500 hover:bg-indigo-700"
                                            style={{ height: `${(sale.amount / maxSale) * 100}%` }}
                                        ></div>
                                        <p className="text-center text-xs text-gray-500 mt-2 truncate w-full">{sale.name}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default AnalyticsPage;
