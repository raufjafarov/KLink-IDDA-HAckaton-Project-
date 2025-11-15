import { useCallback } from 'react';
import { useLinks } from './useLinks';

export interface BankCard {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
}

export interface Withdrawal {
  id:string;
  amount: number;
  bankCardId: string;
  status: 'Gözləmədə' | 'Emal edilir' | 'Tamamlandı';
  createdAt: number;
}

const BANK_CARDS_KEY = 'klink_bank_cards';
const WITHDRAWALS_KEY = 'klink_withdrawals';

export const useWithdrawals = () => {
    const { getLinks } = useLinks();

    // --- Bank Card Management ---
    const getBankCards = useCallback((): BankCard[] => {
        const data = localStorage.getItem(BANK_CARDS_KEY);
        return data ? JSON.parse(data) : [];
    }, []);
    
    const saveBankCards = useCallback((cards: BankCard[]) => {
        localStorage.setItem(BANK_CARDS_KEY, JSON.stringify(cards));
    }, []);

    const addBankCard = useCallback((card: Omit<BankCard, 'id'>) => {
        const cards = getBankCards();
        const newCard: BankCard = { ...card, id: `card_${Date.now()}` };
        saveBankCards([...cards, newCard]);
    }, [getBankCards, saveBankCards]);
    
    const updateBankCard = useCallback((updatedCard: BankCard) => {
        const cards = getBankCards();
        const cardIndex = cards.findIndex(c => c.id === updatedCard.id);
        if(cardIndex > -1) {
            cards[cardIndex] = updatedCard;
            saveBankCards(cards);
        }
    }, [getBankCards, saveBankCards]);

    const deleteBankCard = useCallback((cardId: string) => {
        let cards = getBankCards();
        cards = cards.filter(c => c.id !== cardId);
        saveBankCards(cards);
    }, [getBankCards, saveBankCards]);


    // --- Withdrawal History ---
    const getWithdrawalHistory = useCallback((): Withdrawal[] => {
        const data = localStorage.getItem(WITHDRAWALS_KEY);
        const withdrawals = data ? JSON.parse(data) as Withdrawal[] : [];
        return withdrawals.sort((a, b) => b.createdAt - a.createdAt);
    }, []);

    const saveWithdrawals = useCallback((withdrawals: Withdrawal[]) => {
        localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(withdrawals));
    }, []);


    // --- Core Balance & Withdrawal Logic ---
    const getPendingBalance = useCallback((): number => {
        const pendingLinks = getLinks().filter(link => link.status === 'ÖDƏNİLDİ');
        return pendingLinks.reduce((sum, link) => sum + link.amount, 0);
    }, [getLinks]);
    
    const getAvailableBalance = useCallback((): number => {
        const completedLinks = getLinks().filter(link => link.status === 'Tamamlandı');
        const totalIncome = completedLinks.reduce((sum, link) => sum + link.amount, 0);

        const allWithdrawals = getWithdrawalHistory();
        const totalWithdrawn = allWithdrawals.reduce((sum, w) => sum + w.amount, 0);

        return totalIncome - totalWithdrawn;
    }, [getLinks, getWithdrawalHistory]);

    const requestWithdrawal = useCallback((request: { amount: number; bankCardId: string }) => {
        const history = getWithdrawalHistory();
        const newWithdrawal: Withdrawal = {
            id: `wd_${Date.now()}`,
            amount: request.amount,
            bankCardId: request.bankCardId,
            status: 'Gözləmədə',
            createdAt: Date.now(),
        };
        const updatedHistory = [newWithdrawal, ...history];
        saveWithdrawals(updatedHistory);

        // --- Simulation of processing ---
        setTimeout(() => {
            const currentHistory = JSON.parse(localStorage.getItem(WITHDRAWALS_KEY) || '[]') as Withdrawal[];
            const idx = currentHistory.findIndex(w => w.id === newWithdrawal.id);
            if (idx > -1) {
                currentHistory[idx].status = 'Emal edilir';
                saveWithdrawals(currentHistory);
            }
        }, 3000); // 3 seconds to "Processing"

        setTimeout(() => {
            const currentHistory = JSON.parse(localStorage.getItem(WITHDRAWALS_KEY) || '[]') as Withdrawal[];
            const idx = currentHistory.findIndex(w => w.id === newWithdrawal.id);
            if (idx > -1) {
                currentHistory[idx].status = 'Tamamlandı';
                saveWithdrawals(currentHistory);
            }
        }, 8000); // 8 seconds to "Completed"

    }, [getWithdrawalHistory, saveWithdrawals]);
    

    return { 
        getAvailableBalance,
        getPendingBalance,
        getBankCards,
        addBankCard,
        updateBankCard,
        deleteBankCard,
        getWithdrawalHistory,
        requestWithdrawal
    };
};