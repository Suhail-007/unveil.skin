"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Card,
  Text,
  Separator,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setSession } from "@/lib/redux/slices/authSlice";
import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";

export default function ProfilePageContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isGuest, loading: authLoading } = useAppSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && isGuest) {
      router.push("/login");
    }
  }, [isGuest, authLoading, router]);

  useEffect(() => {
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    } else if (user?.email) {
      // Set a default name from email if not set
      setName("");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update Redux with new user data
      if (data?.user) {
        dispatch(setSession({ user: data.user, session: null }));
      }

      toaster.create({
        title: "Profile updated successfully",
        type: "success",
      });

      setIsEditingProfile(false);
    } catch (error) {
      toaster.create({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toaster.create({
        title: "Passwords don't match",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      toaster.create({
        title: "Password must be at least 6 characters",
        type: "error",
      });
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setIsEditingPassword(false);
      toaster.create({
        title: "Password changed successfully",
        type: "success",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toaster.create({
        title: "Error changing password",
        description: error instanceof Error ? error.message : "Unknown error",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (isGuest) {
    return null;
  }

  return (
    <Container maxW="3xl" py={12}>
      <VStack gap={8} align="stretch">
        <Heading size="2xl">My Profile</Heading>

        {authLoading ? (
          <VStack gap={8} align="stretch">
            {/* Profile Information Skeleton */}
            <Card.Root>
              <Card.Header>
                <HStack justify="space-between">
                  <Skeleton height="28px" width="200px" />
                  <Skeleton height="32px" width="60px" />
                </HStack>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <Field label="Email">
                    <Skeleton height="24px" width="100%" />
                  </Field>
                  <Field label="Name">
                    <Skeleton height="24px" width="100%" />
                  </Field>
                </VStack>
              </Card.Body>
            </Card.Root>

            <Separator />

            {/* Password Skeleton */}
            <Card.Root>
              <Card.Header>
                <HStack justify="space-between">
                  <Skeleton height="28px" width="150px" />
                  <Skeleton height="32px" width="140px" />
                </HStack>
              </Card.Header>
              <Card.Body>
                <SkeletonText noOfLines={1} />
              </Card.Body>
            </Card.Root>
          </VStack>
        ) : (
          <>
            {/* Profile Information */}
            <Card.Root>
              <Card.Header>
                <HStack justify="space-between">
                  <Heading size="lg">Profile Information</Heading>
                  {!isEditingProfile && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Edit
                    </Button>
                  )}
                </HStack>
              </Card.Header>
              <Card.Body>
                {!isEditingProfile ? (
                  <VStack gap={4} align="stretch">
                    <Field label="Email">
                      <Text fontSize="md">{user?.email || "Not set"}</Text>
                    </Field>

                    <Field label="Name">
                      <Text fontSize="md">{name || user?.user_metadata?.name || "Not set"}</Text>
                    </Field>
                  </VStack>
                ) : (
                  <form onSubmit={handleUpdateProfile}>
                    <VStack gap={4} align="stretch">
                      <Field label="Email">
                        <Text fontSize="md" color="gray.500">{user?.email || ""}</Text>
                      </Field>

                      <Field label="Name">
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          autoFocus
                        />
                      </Field>

                      <HStack gap={2}>
                        <Button
                          type="submit"
                          colorPalette="blue"
                          loading={updating}
                        >
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setName(user?.user_metadata?.name || "");
                          }}
                          disabled={updating}
                        >
                          Cancel
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                )}
              </Card.Body>
            </Card.Root>

            <Separator />

            {/* Change Password */}
            <Card.Root>
              <Card.Header>
                <HStack justify="space-between">
                  <Heading size="lg">Password</Heading>
                  {!isEditingPassword && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingPassword(true)}
                    >
                      Change Password
                    </Button>
                  )}
                </HStack>
              </Card.Header>
              <Card.Body>
                {!isEditingPassword ? (
                  <Text color="gray.500">••••••••</Text>
                ) : (
                  <form onSubmit={handleChangePassword}>
                    <VStack gap={4} align="stretch">
                      <Field label="Current Password">
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          autoFocus
                        />
                      </Field>

                      <Field label="New Password">
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                      </Field>

                      <Field label="Confirm New Password">
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                      </Field>

                      <HStack gap={2}>
                        <Button
                          type="submit"
                          colorPalette="blue"
                          loading={updating}
                        >
                          Update Password
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setIsEditingPassword(false);
                            setCurrentPassword("");
                            setNewPassword("");
                            setConfirmPassword("");
                          }}
                          disabled={updating}
                        >
                          Cancel
                        </Button>
                      </HStack>
                    </VStack>
                  </form>
                )}
              </Card.Body>
            </Card.Root>
          </>
        )}
      </VStack>
    </Container>
  );
}
