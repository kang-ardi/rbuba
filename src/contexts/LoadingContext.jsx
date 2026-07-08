// src/contexts/LoadingContext.jsx
/**
 * Tujuan     : Global loading state + overlay fullscreen.
 * Caller     : main.jsx (provider), semua page/service via useLoading.
 * Dependensi : React Context.
 * Main Funcs : LoadingProvider, LoadingContext.
 * Side Effect: Tidak ada.
 */
import { createContext, useCallback, useState } from "react";

export const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0); // counter: aman untuk request paralel

  const showLoading = useCallback(() => setCount((c) => c + 1), []);
  const hideLoading = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);

  const isLoading = count > 0;

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}

      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50"
          style={{ zIndex: 2000 }}
        >
          <div className="spinner-border text-light" role="status" />
          <span className="text-light mt-2 small">Memproses...</span>
        </div>
      )}
    </LoadingContext.Provider>
  );
}