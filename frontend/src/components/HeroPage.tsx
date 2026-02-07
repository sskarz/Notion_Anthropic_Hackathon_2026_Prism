import Prism from './Prism';

interface HeroPageProps {
  onStart: () => void;
}

const HeroPage = ({ onStart }: HeroPageProps) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Prism WebGL background at high intensity */}
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

      {/* Dark overlay for readability */}
      <div className="fixed inset-0 z-0 bg-bg-primary/40" />

      {/* Centered content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6">
        <h1
          className="text-7xl font-bold tracking-tight text-text-primary font-mono"
          style={{ textShadow: '0 0 40px rgba(0, 229, 255, 0.3), 0 0 80px rgba(0, 229, 255, 0.15)' }}
        >
          Prism
        </h1>

        <p className="text-xl text-text-secondary font-sans tracking-wide">
          User Research, Refracted.
        </p>

        <button
          onClick={onStart}
          className="mt-4 cursor-pointer rounded border border-accent-cyan/50 bg-transparent px-8 py-3 font-mono text-sm tracking-wider text-accent-cyan transition-all duration-300 hover:border-accent-cyan hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default HeroPage;
