// src/components/common/ErrorBoundary.jsx
/**
 * Tujuan     : Menangkap error render React dan menampilkan halaman 500.
 * Caller     : main.jsx (membungkus App).
 * Dependensi : ServerError.
 * Main Funcs : ErrorBoundary (class component).
 * Side Effect: console.error saat error tertangkap.
 */
import { Component } from "react";
import ServerError from "../../pages/errors/ServerError";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) return <ServerError />;
    return this.props.children;
  }
}