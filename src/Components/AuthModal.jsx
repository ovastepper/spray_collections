import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin', onSuccess }) => {
  const { currentUser, signup, login, logout } = useCart();
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signupData, setSignupData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    address: '',
    phone: ''
  });
  const [signinData, setSigninData] = useState({ email: '', password: '' });

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const handleSignupChange = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSigninChange = (field, value) => {
    setSigninData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    if (mode === 'signup') {
      const result = await signup(signupData);
      setIsSubmitting(false);
      if (!result.success) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      if (onSuccess) onSuccess();
      setTimeout(onClose, 500);
      return;
    }

    const result = await login(signinData);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess(result.message);
    if (onSuccess) onSuccess();
    setTimeout(onClose, 500);
  };

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 z-[99999] flex items-center justify-center overflow-auto bg-slate-950/90 p-3 sm:p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="mx-auto w-full max-w-[96vw] sm:max-w-3xl max-h-[calc(100vh-1.5rem)] overflow-hidden rounded-2xl sm:rounded-[32px] bg-white shadow-[0_32px_120px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 sm:gap-3 border-b border-slate-200 px-4 sm:px-6 py-4 sm:py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-slate-950 text-[1.1rem] sm:text-2xl">{currentUser ? 'Manage Account' : mode === 'signup' ? 'Create Account' : 'Sign In'}</h2>
            <p className="text-sm text-slate-500">{currentUser ? 'Your current session is active.' : mode === 'signup' ? 'Fill in your details to create a new account.' : 'Enter your email and password to sign in.'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setMode('signin')} className={`rounded-full px-4 py-2 text-sm ${mode === 'signin' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Sign In</button>
            <button onClick={() => setMode('signup')} className={`rounded-full px-4 py-2 text-sm ${mode === 'signup' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Sign Up</button>
            <button onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">Close</button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          {currentUser ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{`${currentUser.firstName} ${currentUser.lastName}`}</p>
                <p className="text-sm text-slate-500">{currentUser.email}</p>
              </div>
              <button onClick={async () => { await logout(); setSuccess('You have been signed out.'); }} className="w-full rounded-full bg-black px-6 py-3 text-sm uppercase tracking-[0.2em] font-semibold text-white hover:bg-amber-400 transition">Logout</button>
            </div>
          ) : mode === 'signup' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-600">
                First name
                <input type="text" value={signupData.firstName} onChange={(e) => handleSignupChange('firstName', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600">
                Middle name
                <input type="text" value={signupData.middleName} onChange={(e) => handleSignupChange('middleName', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600">
                Last name
                <input type="text" value={signupData.lastName} onChange={(e) => handleSignupChange('lastName', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600">
                Email address
                <input type="email" value={signupData.email} onChange={(e) => handleSignupChange('email', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600 sm:col-span-2">
                Password
                <input type="password" value={signupData.password} onChange={(e) => handleSignupChange('password', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600">
                Country
                <input type="text" value={signupData.country} onChange={(e) => handleSignupChange('country', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600">
                Phone number
                <input type="tel" value={signupData.phone} onChange={(e) => handleSignupChange('phone', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600 sm:col-span-2">
                Address
                <input type="text" value={signupData.address} onChange={(e) => handleSignupChange('address', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-600 sm:col-span-2">
                Email address
                <input type="email" value={signinData.email} onChange={(e) => handleSigninChange('email', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
              <label className="block text-sm text-slate-600 sm:col-span-2">
                Password
                <input type="password" value={signinData.password} onChange={(e) => handleSigninChange('password', e.target.value)} className="mt-2 w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-amber-300" />
              </label>
            </div>
          )}

          {error && <p className="mt-6 text-sm text-red-500">{error}</p>}
          {success && <p className="mt-6 text-sm text-emerald-600">{success}</p>}

          {!currentUser && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button disabled={isSubmitting} onClick={handleSubmit} className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm uppercase tracking-[0.2em] font-semibold text-white hover:bg-amber-400 transition disabled:cursor-wait disabled:opacity-60">
                {isSubmitting ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
              <button onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm uppercase tracking-[0.2em] font-semibold text-slate-700 hover:bg-slate-100 transition">
                {mode === 'signup' ? 'Already have an account?' : 'Create new account'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
