"use client";

import { useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogBackdrop,
} from "@/components/ui/dialog";
import { Box, Button, Stack, Text, Tabs } from "@chakra-ui/react";
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
    <DialogRoot open={open} onOpenChange={(e) => !e.open && onClose()}>
      <DialogBackdrop />
      <DialogContent maxW="md">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "login" ? "Log In" : "Sign Up"}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Stack gap={6}>
            <Tabs.Root
              value={activeTab}
              onValueChange={(e) => setActiveTab(e.value)}
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
                    className="bg-white dark:bg-zinc-950"
                    display="inline-block"
                    mx="auto"
                    width="fit-content"
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
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
