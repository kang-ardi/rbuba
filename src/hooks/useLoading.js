// src/hooks/useLoading.js
/**
 * Tujuan     : Hook konsumsi LoadingContext + helper withLoading.
 * Caller     : Pages/services yang butuh loading global.
 * Dependensi : LoadingContext.
 * Main Funcs : useLoading (default export).
 * Side Effect: Tidak ada.
 */
import { useCallback, useContext } from "react";
import { LoadingContext } from "../contexts/LoadingContext";

export default function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading harus dipakai di dalam LoadingProvider");

  const { isLoading, showLoading, hideLoading } = ctx;

  // Bungkus async task: loading otomatis on/off (aman terhadap error)
  const withLoading = useCallback(
    async (task) => {
      showLoading();
      try {
        return await task();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  return { isLoading, showLoading, hideLoading, withLoading };
}