'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false 
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Actualizar el estado para que el siguiente renderizado muestre la UI de repuesto
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error('Uncaught error:', error, errorInfo);
    
    // Opcional: Enviar error a servicio de monitoreo
    if (process.env.NEXT_PUBLIC_ERROR_TRACKING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_TRACKING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        }),
      });
    }
  }

  render() {
    if (this.state.hasError) {
      // Renderizar UI de error personalizada
      return this.props.fallback || (
        <div 
          role="alert" 
          className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-600 p-4"
        >
          <AlertTriangle className="w-16 h-16 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Algo salió mal</h1>
          <p className="text-center">
            Lo sentimos, ha ocurrido un error inesperado. 
            Por favor, recarga la página o intenta de nuevo más tarde.
          </p>
          {this.state.error && (
            <details className="mt-4 text-sm text-gray-600">
              <summary>Detalles técnicos</summary>
              <pre>{this.state.error.toString()}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
