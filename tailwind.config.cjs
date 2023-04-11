/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  mode: "jit",
  theme: {
    extend: {
      screens: {
        md: { min: "838px" },
        "3xl": { min: "1792px" },
      },
    },
    plugins: [],
  },
};
