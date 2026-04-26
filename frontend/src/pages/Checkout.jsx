import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';


const stripePromise = loadStripe('pk_test_51TEBM25pgNXLA3g7vu4aZ0xGhm4TjkYjbRxhFtwpFcQWOIacF0sGMkYQPm8mdNWaqPOjC756Uuzlity36ygjoiUb00hmPHxP3X');

export default function Checkout() {
  const { restaurantId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(0);
  const [pageError, setPageError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartAndCreateIntent();
  }, [restaurantId]);

  const fetchCartAndCreateIntent = async () => {
    try {
      setPageError(null);
      // We need to fetch foods to map foodId to restaurantId
      const foodsRes = await api.get('/foods');
      const allFoods = foodsRes.data;

      // Fetch cart items
      const res = await api.get(`/cart/user/${user.id}`);

      const restaurantItems = res.data.filter(item => {
        const matchingFood = allFoods.find(f => f.id === item.foodId);
        return matchingFood && matchingFood.restaurantId.toString() === restaurantId;
      });

      if (restaurantItems.length === 0) {
        navigate('/cart');
        return;
      }

      const total = restaurantItems.reduce((acc, item) => acc + item.totalPrice, 0);
      // In Cart.jsx there's a $5 delivery fee added to the visual total. We should include it in Stripe too!
      const totalWithDelivery = total + 5;

      setAmount(totalWithDelivery);

      // Create PaymentIntent
      // Stripe expects amount in cents for USD
      const intentRes = await api.post('/payment/create-payment-intent', {
        amount: Math.round(totalWithDelivery * 100)
      });

      setClientSecret(intentRes.data.clientSecret);
    } catch (err) {
      console.error("Setup checkout failed", err);
      // Display error on the screen so we know exactly what is wrong
      setPageError(err.response?.data?.error || err.message || "Failed to initialize payment.");
    }
  };

  const handleSuccess = () => {
    navigate('/payment-success');
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#EF4F5F',
      colorBackground: '#ffffff',
      colorText: '#111827',
      colorDanger: '#EF4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    }
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-textPrimary tracking-tight mb-2">Secure Checkout</h1>
        <p className="text-textSecondary text-lg font-medium">Complete your payment of <span className="text-primary font-bold">${amount.toFixed(2)}</span></p>
      </div>

      {pageError ? (
        <div className="bg-danger/10 text-danger p-6 rounded-[2rem] text-center font-bold border border-danger/20 mb-6">
          <p>⚠️ Error Setup: {pageError}</p>
          <p className="text-sm mt-3 font-medium opacity-80">Did you completely restart your backend server to load the new Stripe Java package?</p>
        </div>
      ) : clientSecret ? (
        <div className="bg-surface p-8 rounded-[2rem] shadow-2xl shadow-gray-200 border border-gray-100">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm restaurantId={restaurantId} onSuccess={handleSuccess} />
          </Elements>
        </div>
      ) : (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
