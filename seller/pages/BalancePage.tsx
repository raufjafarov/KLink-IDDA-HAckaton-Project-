
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { useWithdrawals, BankCard, Withdrawal } from '../hooks/useWithdrawals';
import { useLinks } from '../hooks/useLinks';
import { useLocalization } from '../hooks/useLocalization';

const WalletIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const CreditCardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const PlusIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EditIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;


const StatusBadge: React.FC<{ status: Withdrawal['status'] }> = ({ status }) => {
    const { t } = useLocalization();
    const baseClasses = 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
    if (status === 'Tamamlandı') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>{t('balance_page.history.status.completed')}</span>;
    }
    if (status === 'Emal edilir') {
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>{t('balance_page.history.status.processing')}</span>;
    }
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{t('balance_page.history.status.pending')}</span>;
};

const maskCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
};

const BalancePage: React.FC = () => {
    const { 
        getAvailableBalance,
        getPendingBalance, 
        getBankCards, 
        addBankCard,
        updateBankCard,
        deleteBankCard,
        getWithdrawalHistory,
        requestWithdrawal
    } = useWithdrawals();
    const { t } = useLocalization();

    const [availableBalance, setAvailableBalance] = useState(0);
    const [pendingBalance, setPendingBalance] = useState(0);
    const [cards, setCards] = useState<BankCard[]>([]);
    const [history, setHistory] = useState<Withdrawal[]>([]);
    
    // Modal states
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<BankCard | null>(null);
    const [deletingCardId, setDeletingCardId] = useState<string | null>(null);
    
    // Form states
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [selectedCardId, setSelectedCardId] = useState('');
    const [cardForm, setCardForm] = useState({ id: '', cardNumber: '', expiryDate: '', cvv: '', holderName: '' });

    const refreshData = () => {
        setAvailableBalance(getAvailableBalance());
        setPendingBalance(getPendingBalance());
        const bankCards = getBankCards();
        setCards(bankCards);
        setHistory(getWithdrawalHistory());
    };

    useEffect(() => {
        const interval = setInterval(refreshData, 1000);
        return () => clearInterval(interval);
    }, []);

    const openAddCardModal = () => {
        setEditingCard(null);
        setCardForm({ id: '', cardNumber: '', expiryDate: '', cvv: '', holderName: '' });
        setIsCardModalOpen(true);
    };

    const openEditCardModal = (card: BankCard) => {
        setEditingCard(card);
        setCardForm(card);
        setIsCardModalOpen(true);
    };

    const handleCardFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCard) {
            updateBankCard(cardForm);
        } else {
            addBankCard(cardForm);
        }
        setIsCardModalOpen(false);
        refreshData();
    };

    const handleDeleteCard = () => {
        if(deletingCardId) {
            deleteBankCard(deletingCardId);
            setIsDeleteModalOpen(false);
            setDeletingCardId(null);
            refreshData();
        }
    };

    const handleRequestWithdrawal = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0 || amount > availableBalance) {
            alert(t('balance_page.alert.invalid_amount'));
            return;
        }
        if (!selectedCardId) {
            alert(t('balance_page.alert.select_card'));
            return;
        }
        requestWithdrawal({ amount, bankCardId: selectedCardId });
        setIsWithdrawModalOpen(false);
        setWithdrawAmount('');
        setSelectedCardId('');
        refreshData();
    };

    const canWithdraw = useMemo(() => cards.length > 0 && availableBalance > 0, [cards, availableBalance]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight px-4 sm:px-0 mb-6">{t('balance_page.title')}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-lg text-white p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <WalletIcon />
                                <span className="font-semibold text-lg">{t('balance_page.card.available_balance')}</span>
                            </div>
                            <p className="text-5xl font-extrabold tracking-tight">{availableBalance.toFixed(2)} <span className="text-3xl font-medium opacity-80">AZN</span></p>
                            <p className="text-sm opacity-80 mt-2">{t('balance_page.card.pending_balance', { amount: pendingBalance.toFixed(2) })}</p>
                        </div>
                        <button onClick={() => setIsWithdrawModalOpen(true)} disabled={!canWithdraw} className="mt-6 w-full bg-white bg-opacity-20 text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-30 transition disabled:bg-opacity-10 disabled:cursor-not-allowed disabled:text-gray-300">
                            {t('balance_page.card.withdraw_button')}
                        </button>
                    </div>
                    <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{t('balance_page.cards.title')}</h2>
                            <button onClick={openAddCardModal} className="flex items-center space-x-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-md hover:bg-indigo-200 transition">
                                <PlusIcon />
                                <span>{t('balance_page.cards.new_button')}</span>
                            </button>
                        </div>
                        <div className="space-y-3">
                            {cards.map(card => (
                                <div key={card.id} className="p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <CreditCardIcon />
                                        <div>
                                            <p className="font-semibold text-gray-800">{card.holderName}</p>
                                            <p className="text-sm text-gray-500 font-mono">{maskCardNumber(card.cardNumber)}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openEditCardModal(card)} className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-gray-200 rounded-md"><EditIcon /></button>
                                        <button onClick={() => { setDeletingCardId(card.id); setIsDeleteModalOpen(true); }} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-200 rounded-md"><DeleteIcon /></button>
                                    </div>
                                </div>
                            ))}
                            {cards.length === 0 && <p className="text-center text-gray-500 py-4">{t('balance_page.cards.no_cards')}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-bold text-gray-800 p-6">{t('balance_page.history.title')}</h2>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('balance_page.history.table.amount')}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('balance_page.history.table.card')}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('balance_page.history.table.date')}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('balance_page.history.table.status')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {history.map(item => {
                                    const card = cards.find(c => c.id === item.bankCardId);
                                    return (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.amount.toFixed(2)} AZN</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{card ? maskCardNumber(card.cardNumber) : t('balance_page.history.unknown_card')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleString('az-AZ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                                        </tr>
                                    );
                                })}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-500 py-10">{t('balance_page.history.empty')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Card Add/Edit Modal */}
            {isCardModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingCard ? t('balance_page.modal.edit_card_title') : t('balance_page.modal.add_card_title')}</h2>
                        <form onSubmit={handleCardFormSubmit} className="space-y-4">
                            <input value={cardForm.holderName} onChange={e => setCardForm({...cardForm, holderName: e.target.value})} placeholder={t('balance_page.modal.card_holder_placeholder')} required className="w-full p-2 border rounded"/>
                            <input value={cardForm.cardNumber} onChange={e => setCardForm({...cardForm, cardNumber: e.target.value})} placeholder={t('balance_page.modal.card_number_placeholder')} required maxLength={16} className="w-full p-2 border rounded font-mono"/>
                            <div className="flex gap-4">
                                <input value={cardForm.expiryDate} onChange={e => setCardForm({...cardForm, expiryDate: e.target.value})} placeholder={t('balance_page.modal.expiry_placeholder')} required className="w-1/2 p-2 border rounded font-mono"/>
                                <input value={cardForm.cvv} onChange={e => setCardForm({...cardForm, cvv: e.target.value})} placeholder={t('balance_page.modal.cvv_placeholder')} required maxLength={3} className="w-1/2 p-2 border rounded font-mono"/>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsCardModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">{t('balance_page.modal.cancel_button')}</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{editingCard ? t('balance_page.modal.save_button') : t('balance_page.modal.add_button')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                         <h2 className="text-xl font-bold mb-2">{t('balance_page.modal.delete_title')}</h2>
                         <p className="text-gray-600 mb-4">{t('balance_page.modal.delete_body')}</p>
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">{t('balance_page.modal.cancel_button')}</button>
                            <button type="button" onClick={handleDeleteCard} className="px-4 py-2 bg-red-600 text-white rounded">{t('balance_page.modal.delete_button')}</button>
                        </div>
                    </div>
                </div>
            )}

             {/* Withdraw Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{t('balance_page.modal.withdraw_title')}</h2>
                        <form onSubmit={handleRequestWithdrawal} className="space-y-4">
                             <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} max={availableBalance} step="0.01" placeholder={t('balance_page.modal.amount_placeholder')} required className="w-full p-2 border rounded"/>
                            <select value={selectedCardId} onChange={e => setSelectedCardId(e.target.value)} required className="w-full p-2 border rounded">
                                <option value="" disabled>{t('balance_page.modal.select_card_placeholder')}</option>
                                {cards.map(card => <option key={card.id} value={card.id}>{`${card.holderName} - ${maskCardNumber(card.cardNumber)}`}</option>)}
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsWithdrawModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">{t('balance_page.modal.cancel_button')}</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">{t('balance_page.modal.submit_button')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default BalancePage;
