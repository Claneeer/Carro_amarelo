import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// --- ADICIONE ESTE BLOCO ---
const resizeObserverLoopErr = 'ResizeObserver loop completed with undelivered notifications';

// Evita que o erro apareça no console
const originalError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes(resizeObserverLoopErr)) {
    return;
  }
  originalError.call(console, ...args);
};

// Evita que a tela vermelha (overlay) apareça
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes(resizeObserverLoopErr)) {
    e.stopImmediatePropagation();
  }
});
// ---------------------------

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);