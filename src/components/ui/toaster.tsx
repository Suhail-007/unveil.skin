"use client";

import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast, createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  duration: 3000,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster 
        toaster={toaster} 
        insetInline={{ base: "4", md: "4" }}
        insetBlockStart={{ base: "20", md: "4" }}
      >
        {(toast) => (
          <Toast.Root width={{ base: "calc(100vw - 2rem)", md: "sm" }} maxWidth="sm">
            {toast.type === "loading" ? <Spinner size="sm" color="blue.solid" /> : <Toast.Indicator />}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
