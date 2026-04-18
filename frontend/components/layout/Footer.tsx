export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
      <p>
        Built with React, TanStack Query, and Tailwind. © {new Date().getFullYear()}{" "}
        PromptForge.
      </p>
    </footer>
  );
}
