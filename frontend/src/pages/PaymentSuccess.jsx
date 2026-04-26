import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate('/orders');
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-surface p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-green-100 border border-green-50 max-w-lg w-full text-center hover:-translate-y-2 transition-transform duration-500">
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-green-400 blur-2xl opacity-20 rounded-full animate-pulse"></div>
          <CheckCircle className="w-32 h-32 text-green-500 relative z-10 animate-[bounce_1s_ease-in-out_infinite]" />
        </div>
        
        <h1 className="text-4xl font-black text-textPrimary tracking-tight mb-4">Payment Successful!</h1>
        <p className="text-textSecondary text-lg font-medium mb-8">
          Your order has been confirmed and sent to the restaurant. They are preparing your delicious food right now!
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 flex items-center justify-center gap-4">
          <Package className="text-primary w-8 h-8" />
          <div className="text-left">
            <p className="text-sm text-textSecondary font-medium text-nowrap">Redirecting to Dashboard inside</p>
            <p className="text-xl font-bold text-textPrimary">{countdown} seconds</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/orders')}
          className="btn-primary w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
        >
          Go to Dashboard Now <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
