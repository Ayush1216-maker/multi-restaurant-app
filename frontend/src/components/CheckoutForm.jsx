import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CheckoutForm({ restaurantId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        
        await api.post(`/orders/place/${user.id}/${restaurantId}`);
        onSuccess();
      } catch (err) {
        console.error('Error placing order after payment', err);
        setErrorMessage('Payment succeeded but order creation failed. Please contact support.');
      }
      setIsProcessing(false);
    } else {
      setErrorMessage("An unexpected state occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement />
      {errorMessage && <div className="text-danger bg-danger/10 p-3 rounded-lg text-sm font-bold border border-danger/20">{errorMessage}</div>}
      <button 
        disabled={!stripe || isProcessing} 
        className="btn-primary py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all mt-4 w-full"
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}
