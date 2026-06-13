export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        accent: '#378ADD',
        background: '#f7fafc',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(30, 58, 95, 0.08)',
      },
    },
  },
  plugins: [],
};
