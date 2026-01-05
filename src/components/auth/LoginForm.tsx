"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setSession } from "@/lib/redux/slices/authSlice";
import { setCartItems } from "@/lib/redux/slices/cartSlice";
import { login, getSession } from "@/lib/services/auth.service";
import { syncGuestCart, getCart } from "@/lib/services/cart.service";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });

      // Update Redux with session
      dispatch(setSession({ user: data.user, session: data.session }));

      // Sync guest cart with user cart
      const guestCart = localStorage.getItem("guestCart");
      if (guestCart) {
        const guestCartItems = JSON.parse(guestCart);
        if (guestCartItems.length > 0) {
          await syncGuestCart({ guestCart: guestCartItems });
          localStorage.removeItem("guestCart");
        }
      }

      // Fetch user cart
      const cartData = await getCart();
      dispatch(setCartItems(cartData.items));

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && (
          <Box
            px={4}
            py={3}
            borderRadius="md"
            className="bg-red-50 dark:bg-red-900/20"
          >
            <Text fontSize="sm" className="text-red-600 dark:text-red-400">
              {error}
            </Text>
          </Box>
        )}

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2} className="text-black dark:text-white">
            Email
          </Text>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={loading}
          />
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2} className="text-black dark:text-white">
            Password
          </Text>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </Box>

        <Button
          type="submit"
          disabled={loading}
          loading={loading}
          className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </Stack>
    </Box>
  );
}
