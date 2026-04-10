import { createContext, useContext, useState, ReactNode } from 'react';

interface DemoDataContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  hasRegisteredSystems: boolean;
  setHasRegisteredSystems: (value: boolean) => void;
  isFirstRun: boolean;
  completeFirstRun: () => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(true); // Start in demo mode
  const [hasRegisteredSystems, setHasRegisteredSystems] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const completeFirstRun = () => {
    setIsFirstRun(false);
  };

  return (
    <DemoDataContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        hasRegisteredSystems,
        setHasRegisteredSystems,
        isFirstRun,
        completeFirstRun,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (context === undefined) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
}
