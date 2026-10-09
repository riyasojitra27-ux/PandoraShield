/** @type {import('tailwindcss').Config} */
export default {
  // Explicitly restrict content scanning to src/ and index.html only.
  // This prevents Tailwind v4 from walking public/ort-wasm/ (83MB of WASM files)
  // and public/models/ (22MB ONNX model) which causes the production build to deadlock.
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};
