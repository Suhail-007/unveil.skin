"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  Tabs,
  Dialog,
} from "@chakra-ui/react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setGuest } from "@/lib/redux/slices/authSlice";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  allowGuest?: boolean;
}

export default function AuthModal({ open, onClose, allowGuest = true }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login");
  const dispatch = useAppDispatch();

  const handleSuccess = () => {
    onClose();
  };

  const handleGuestContinue = () => {
    dispatch(setGuest());
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(details) => !details.open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="md">
          <Dialog.Header>
            <Dialog.Title>
              {activeTab === "login" ? "Log In" : "Sign Up"}
            </Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>

          <Dialog.Body>
            <Stack gap={6}>
              <Tabs.Root
                value={activeTab}
                onValueChange={(details) => setActiveTab(details.value)}
                variant="plain"
              >
                <Tabs.List>
                  <Tabs.Trigger value="login">Log In</Tabs.Trigger>
                  <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
                </Tabs.List>

                <Box mt={6}>
                  <Tabs.Content value="login">
                    <LoginForm onSuccess={handleSuccess} />
                  </Tabs.Content>

                  <Tabs.Content value="signup">
                    <SignupForm onSuccess={handleSuccess} />
                  </Tabs.Content>
                </Box>
              </Tabs.Root>

              {allowGuest && (
                <>
                  <Box position="relative">
                    <Box
                      position="absolute"
                      top="50%"
                      left={0}
                      right={0}
                      h="1px"
                      className="bg-zinc-200 dark:bg-zinc-800"
                    />
                    <Text
                      position="relative"
                      textAlign="center"
                      fontSize="sm"
                      px={4}
                      display="inline-block"
                      mx="auto"
                      width="fit-content"
                      backgroundColor="white"
                      _dark={{ backgroundColor: "zinc.950" }}
                    >
                      or
                    </Text>
                  </Box>

                  <Button
                    variant="outline"
                    onClick={handleGuestContinue}
                    className="border-zinc-200 dark:border-zinc-800"
                  >
                    Continue as Guest
                  </Button>

                  <Text fontSize="xs" textAlign="center" className="text-zinc-500">
                    You can browse and add items to cart without an account
                  </Text>
                </>
              )}
            </Stack>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
