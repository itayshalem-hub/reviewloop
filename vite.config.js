import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Minimal Vite setup: React fast-refresh + Tailwind v4's first-party plugin.
// Tailwind v4 needs no tailwind.config.js — design tokens live in src/index.css.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
