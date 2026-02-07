import { useState } from 'react';
import Prism from './Prism';

interface SignUpFormProps {
  onComplete: () => void;
}

const SignUpForm = ({ onComplete }: SignUpFormProps) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    product_description: '',
    product_link: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          product_description: form.product_description,
          product_link: form.product_link || undefined,
        }),
      });

      if (!res.ok) throw new Error('Sign-up failed');
      onComplete();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded border border-border-primary bg-bg-primary/80 px-3 py-2 text-sm text-text-primary placeholder-text-secondary/50 outline-none transition-colors focus:border-accent-cyan/50';

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-70">
        <Prism
          animationType="rotate"
          glow={1.4}
          noise={0.3}
          scale={3.6}
          timeScale={0.4}
          bloom={1.4}
        />
      </div>

      <div className="fixed inset-0 z-0 bg-bg-primary/40" />

      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-xl border border-border-primary/60 bg-bg-secondary/60 p-8 backdrop-blur-xl"
        >
          <h2
            className="mb-1 text-center font-mono text-2xl font-bold text-text-primary"
            style={{ textShadow: '0 0 30px rgba(0, 229, 255, 0.3)' }}
          >
            Welcome to Prism
          </h2>
          <p className="mb-6 text-center text-sm text-text-secondary">
            Tell us about your product to get started.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Name</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jane@company.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">Company</label>
              <input
                name="company"
                type="text"
                required
                value={form.company}
                onChange={handleChange}
                placeholder="Acme Corp"
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Product Description
              </label>
              <textarea
                name="product_description"
                required
                rows={3}
                value={form.product_description}
                onChange={handleChange}
                placeholder="Describe your product and what problem it solves..."
                className={inputClass + ' resize-none'}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Product Link{' '}
                <span className="text-text-secondary/50">(optional)</span>
              </label>
              <input
                name="product_link"
                type="url"
                value={form.product_link}
                onChange={handleChange}
                placeholder="https://github.com/your-org/your-product"
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 text-center text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full cursor-pointer rounded border border-accent-cyan/50 bg-transparent py-3 font-mono text-sm tracking-wider text-accent-cyan transition-all duration-300 hover:border-accent-cyan hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Begin Research'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
