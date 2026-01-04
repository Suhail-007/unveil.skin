"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/lib/redux/store';

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider attribute="class" disableTransitionOnChange>
          {children}
        </ColorModeProvider>
      </ChakraProvider>
    </ReduxProvider>
  );
}

