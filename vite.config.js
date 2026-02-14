import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Daily-Habit-Tracker/'  // must match repo name EXACTLY
})
