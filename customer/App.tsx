import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import PayPage from './pages/PayPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

const App: React.FC = () => {

  useEffect(() => {
    // Populate localStorage with dummy data for hackathon demonstration if it doesn't exist
    if (!localStorage.getItem('links')) {
      const dummyLinks = [
        {
          uniqueId: 'O_12345',
          productName: 'Handmade Vase',
          amount: 50,
          status: 'Pending',
          imageUrl: 'https://picsum.photos/id/1071/400/400',
          sellerEmail: 'seller@example.com',
          createdAt: new Date().toISOString(),
        },
        {
          uniqueId: 'O_67890',
          productName: 'Leather Wallet',
          amount: 75.50,
          status: 'Pending',
          imageUrl: '', // Test case with no image
          sellerEmail: 'seller2@example.com',
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('links', JSON.stringify(dummyLinks));
      console.log('Dummy data created. Try navigating to /#/pay/O_12345 or /#/pay/O_67890');
    }
  }, []);


  return (
    <HashRouter>
      <Routes>
        <Route path="/pay/:id" element={<PayPage />} />
        <Route path="/checkout/:id" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/pay/O_12345" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;