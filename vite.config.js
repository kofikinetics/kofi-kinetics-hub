import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change the base to match your GitHub repo name
// e.g. if your repo is github.com/yourname/kofi-kinetics-hub, set base: '/kofi-kinetics-hub/'
export default defineConfig({
  plugins: [react()],
  base: '/kofi-kinetics-hub/',
})
