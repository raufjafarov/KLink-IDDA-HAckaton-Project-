import React from 'react';

const CheckmarkIcon = () => (
    <svg className="w-24 h-24 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
);


const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
       <h1 className="text-4xl font-bold text-slate-800 mb-4">
        <span className="text-indigo-600">K</span>LINK
       </h1>
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 w-full max-w-md text-center space-y-5">
        <CheckmarkIcon />
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Payment successfully completed!
        </h2>
        <p className="text-slate-600">
          An official receipt has been sent to the email address you provided. Your seller has been notified about your order.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;