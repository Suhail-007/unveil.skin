'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ColorModeProvider } from '@/components/ui/color-mode';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { FeatureFlagsProvider } from '@/lib/features/FeatureFlagsContext';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ReduxProvider store={store}>
        <FeatureFlagsProvider>
          <ColorModeProvider attribute='class' disableTransitionOnChange>
            {children}
          </ColorModeProvider>
        </FeatureFlagsProvider>
      </ReduxProvider>
    </ChakraProvider>
  );
}
