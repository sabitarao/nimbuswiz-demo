import { createContext, useContext, ReactNode, useState } from 'react';

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja';

interface Translation {
  [key: string]: string | Translation;
}

const translations: { [locale: string]: Translation } = {
  en: {
    common: {
      apply: 'Apply',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    nav: {
      overview: 'Overview',
      systems: 'Systems',
      assessment: 'System Assessment',
      advisor: 'Modernization Advisor',
      modernization: 'Modernization',
      deployment: 'Deployment',
      monitoring: 'Monitoring',
      api: 'API & Integrations',
      automation: 'Automation',
      troubleshooting: 'Troubleshooting',
      settings: 'Settings',
    },
    dashboard: {
      title: 'Fleet Overview',
      subtitle: 'Real-time health monitoring for all Nimbus systems',
      stabilityIndex: 'Stability Index',
      responsivenessScore: 'Responsiveness Score',
      networkInteraction: 'Network Interaction',
    },
    onboarding: {
      welcome: 'Welcome to NimbusWiz! 🎉',
      getStarted: 'Get Started with NimbusWiz',
      subtitle: 'See stability insights in under 3 minutes—try our demo or connect your first system',
      useDemoFleet: 'Use Demo Fleet',
      registerSystem: 'Register Your First System',
      startTour: 'Start Product Tour',
    },
    recommendations: {
      title: 'Modernization Advisor',
      subtitle: 'Intelligent upgrade recommendations based on system behavior, dependencies, and usage patterns',
      recommended: 'Recommended',
      confidenceScore: 'Confidence Score',
      applyUpgrade: 'Apply Upgrade',
      previewChanges: 'Preview Changes',
      runSimulation: 'Run Simulation',
    },
    toast: {
      upgradeApplied: 'Upgrade applied successfully',
      upgradeRolledBack: 'Upgrade rolled back successfully',
      undo: 'Undo',
    },
  },
  es: {
    common: {
      apply: 'Aplicar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      search: 'Buscar',
      filter: 'Filtrar',
      close: 'Cerrar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
    },
    nav: {
      overview: 'Resumen',
      systems: 'Sistemas',
      assessment: 'Evaluación del Sistema',
      advisor: 'Asesor de Modernización',
      modernization: 'Modernización',
      deployment: 'Despliegue',
      monitoring: 'Monitoreo',
      api: 'API e Integraciones',
      automation: 'Automatización',
      troubleshooting: 'Resolución de Problemas',
      settings: 'Configuración',
    },
    dashboard: {
      title: 'Vista General de la Flota',
      subtitle: 'Monitoreo de salud en tiempo real para todos los sistemas Nimbus',
      stabilityIndex: 'Índice de Estabilidad',
      responsivenessScore: 'Puntuación de Respuesta',
      networkInteraction: 'Interacción de Red',
    },
    onboarding: {
      welcome: '¡Bienvenido a NimbusWiz! 🎉',
      getStarted: 'Comienza con NimbusWiz',
      subtitle: 'Consulta información de estabilidad en menos de 3 minutos: prueba nuestra demo o conecta tu primer sistema',
      useDemoFleet: 'Usar Flota de Demostración',
      registerSystem: 'Registrar Tu Primer Sistema',
      startTour: 'Iniciar Tour del Producto',
    },
    recommendations: {
      title: 'Asesor de Modernización',
      subtitle: 'Recomendaciones inteligentes de actualización basadas en el comportamiento del sistema, dependencias y patrones de uso',
      recommended: 'Recomendado',
      confidenceScore: 'Puntuación de Confianza',
      applyUpgrade: 'Aplicar Actualización',
      previewChanges: 'Vista Previa de Cambios',
      runSimulation: 'Ejecutar Simulación',
    },
    toast: {
      upgradeApplied: 'Actualización aplicada con éxito',
      upgradeRolledBack: 'Actualización revertida con éxito',
      undo: 'Deshacer',
    },
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }

    if (typeof value === 'string') {
      return value;
    }

    // Fallback to English if translation not found
    if (locale !== 'en') {
      let fallbackValue: any = translations.en;
      for (const k of keys) {
        if (fallbackValue && typeof fallbackValue === 'object') {
          fallbackValue = fallbackValue[k];
        } else {
          break;
        }
      }
      if (typeof fallbackValue === 'string') {
        return fallbackValue;
      }
    }

    return fallback || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
