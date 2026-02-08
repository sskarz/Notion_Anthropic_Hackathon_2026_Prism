import { useState } from 'react';
import Prism from './Prism';

export interface UserFormData {
  name: string;
  company: string;
  problem_description: string;
  steps_to_reproduce: string;
  urgency: 'high' | 'medium' | 'low';
}

interface UserFormProps {
  onComplete: (data: UserFormData) => void;
}

export default function UserForm({ onComplete }: UserFormProps) {
  const [form, setForm] = useState<UserFormData>({
    name: '',
    company: '',
    problem_description: '',
    steps_to_reproduce: '',
    urgency: 'medium',
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
      const res = await fetch('/api/user-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Submission failed');
      onComplete(form);
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
            Share Your Feedback
          </h2>
          <p className="mb-6 text-center text-sm text-text-secondary">
            Tell us about the issue you're experiencing.
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
                Problem Description
              </label>
              <textarea
                name="problem_description"
                required
                rows={3}
                value={form.problem_description}
                onChange={handleChange}
                placeholder="Describe the problem you're experiencing..."
                className={inputClass + ' resize-none'}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Steps to Reproduce{' '}
                <span className="text-text-secondary/50">(optional)</span>
              </label>
              <textarea
                name="steps_to_reproduce"
                rows={2}
                value={form.steps_to_reproduce}
                onChange={handleChange}
                placeholder="1. Go to... 2. Click on... 3. See error..."
                className={inputClass + ' resize-none'}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-text-secondary">
                Urgency Level
              </label>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm({ ...form, urgency: level })}
                    className={`flex-1 rounded border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                      form.urgency === level
                        ? level === 'high'
                          ? 'border-red-400/60 bg-red-400/15 text-red-400'
                          : level === 'medium'
                            ? 'border-amber-400/60 bg-amber-400/15 text-amber-400'
                            : 'border-emerald-400/60 bg-emerald-400/15 text-emerald-400'
                        : 'border-border-primary bg-bg-primary/40 text-text-secondary hover:bg-bg-primary/60'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
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
            {loading ? 'Submitting...' : 'Start Interview'}
          </button>
        </form>
      </div>
    </div>
  );
}
