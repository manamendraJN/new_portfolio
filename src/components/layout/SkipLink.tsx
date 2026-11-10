/** First focusable element on the page. Hidden until focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-fg focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-bg"
    >
      Skip to content
    </a>
  );
}
