export function Footer() {
  return (
    <footer className="border-t border-[#E5E0D8] bg-flent-cream px-5 py-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 text-center">
        <span className="font-serif text-2xl font-bold text-flent-dark">flent</span>
        <p className="max-w-md text-sm leading-relaxed text-[#6B6B6B]">
          Fully furnished designer homes in Bangalore for folks looking for a better living.
        </p>
        <a
          href="https://flent.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-flent-green transition-colors hover:text-flent-green/80"
        >
          flent.in
        </a>
      </div>
    </footer>
  )
}
