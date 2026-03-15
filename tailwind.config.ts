import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          500: "#3266ff",
          700: "#1f47c7"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
