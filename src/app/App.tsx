import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DemoDataProvider } from './contexts/DemoDataContext';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { ToastProvider } from './contexts/ToastContext';
import { OnboardingTourProvider } from './contexts/OnboardingTourContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { ABTestProvider } from './contexts/ABTestContext';
import { I18nProvider } from './contexts/I18nContext';

export default function App() {
  return (
    <I18nProvider>
      <AnalyticsProvider>
        <DemoDataProvider>
          <UserRoleProvider>
            <ToastProvider>
              <OnboardingTourProvider>
                <ABTestProvider>
                  <RouterProvider router={router} />
                </ABTestProvider>
              </OnboardingTourProvider>
            </ToastProvider>
          </UserRoleProvider>
        </DemoDataProvider>
      </AnalyticsProvider>
    </I18nProvider>
  );
}
