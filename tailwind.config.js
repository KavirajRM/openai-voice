/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#7F9CF5",
          DEFAULT: "#4C51BF",
          dark: "#434190",
        },
        secondary: {
          light: "#63B3ED",
          DEFAULT: "#3182CE",
          dark: "#2C5282",
        },
        accent: {
          light: "#F6E05E",
          DEFAULT: "#D69E2E",
          dark: "#B7791F",
        },
        neutral: {
          light: "#F7FAFC",
          DEFAULT: "#EDF2F7",
          dark: "#A0AEC0",
        },
        red: {
          light: "#FEB2B2",
          DEFAULT: "#E53E3E",
          dark: "#9B2C2C",
        },
        green: {
          light: "#9AE6B4",
          DEFAULT: "#38A169",
          dark: "#2F855A",
        },
        blue: {
          light: "#90CDF4",
          DEFAULT: "#3182CE",
          dark: "#2A4365",
        },
        gray: {
          light: "#F7FAFC",
          DEFAULT: "#A0AEC0",
          dark: "#4A5568",
        },
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        48: "12rem",
        60: "15rem",
      },
      boxShadow: {
        soft: "0 2px 4px rgba(0, 0, 0, 0.1)",
        medium: "0 4px 6px rgba(0, 0, 0, 0.1)",
        strong: "0 6px 8px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
