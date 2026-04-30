const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative z-10 pt-24 overflow-hidden mt-auto">
      <div className="flex flex-col items-center gap-6">
        <a href="https://github.com/123JUICE-BOY321/ForeSight" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 backdrop-blur-md group">
          <GithubIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>

        <div className="text-slate-600 text-xs font-bold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} FORESIGHT. All rights reserved.
        </div>

        <h1 className="text-[17vw] leading-none font-bold text-white/5 tracking-tighter select-none pointer-events-none">
          FORESIGHT
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
