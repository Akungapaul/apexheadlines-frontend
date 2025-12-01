import React, { useState } from 'react';
import { newsletterAPI } from '@/api/newsletter';
import { isValidEmail } from '@/utils/sanitize';
import clsx from 'clsx';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      await newsletterAPI.subscribe({ email });
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="bg-primary-600 dark:bg-primary-700 text-white p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
      <p className="text-primary-100 mb-4">
        Subscribe to our newsletter for the latest news and updates.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className={clsx(
              'w-full px-4 py-2 rounded-lg',
              'text-gray-900 placeholder-gray-500',
              'focus:ring-2 focus:ring-white focus:outline-none',
              'disabled:bg-gray-200 disabled:cursor-not-allowed'
            )}
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={clsx(
            'w-full px-4 py-2 rounded-lg font-semibold',
            'bg-white text-primary-600 hover:bg-primary-50',
            'disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        >
          {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
        </button>

        {message && (
          <p
            className={clsx(
              'text-sm',
              status === 'error' ? 'text-red-200' : 'text-primary-100'
            )}
          >
            {message}
          </p>
        )}
      </form>

      <p className="text-xs text-primary-200 mt-4">
        By subscribing, you agree to our Privacy Policy and consent to receive updates.
      </p>
    </div>
  );
};
