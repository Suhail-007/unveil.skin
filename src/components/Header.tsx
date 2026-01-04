"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, HStack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import CartIcon from "./cart/CartIcon";
import CartDrawer from "./cart/CartDrawer";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setSession, setGuest } from "@/lib/redux/slices/authSlice";
import { setCartItems } from "@/lib/redux/slices/cartSlice";

export default function Header() {
  const [logoSrc, setLogoSrc] = useState("/Logo_Dark.svg");
  const [cartOpen, setCartOpen] = useState(false);
  const resolvedLogoSrc = useColorModeValue("/Logo_Dark.svg", "/Logo.svg");
  const dispatch = useAppDispatch();
  const { isGuest, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setLogoSrc(resolvedLogoSrc);
  }, [resolvedLogoSrc]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();

        if (data.session && data.user) {
          dispatch(setSession({ user: data.user, session: data.session }));

          // Load user cart
          const cartResponse = await fetch("/api/cart/get");
          if (cartResponse.ok) {
            const cartData = await cartResponse.json();
            dispatch(setCartItems(cartData.items));
          }
        } else {
          dispatch(setGuest());

          // Load guest cart from localStorage
          if (typeof window !== "undefined") {
            const guestCart = localStorage.getItem("guestCart");
            if (guestCart) {
              const cartItems = JSON.parse(guestCart);
              dispatch(setCartItems(cartItems));
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        dispatch(setGuest());
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <>
      <Box as="header" borderBottom="1px" className="border-zinc-200 dark:border-zinc-800">
        <Container maxW="7xl" px={{ base: 4, md: 6 }} py={6}>
          <HStack justify="space-between">
            <Link href="/">
              <Image
                src={logoSrc}
                alt="unveil.skin"
                width={360}
                height={106}
                priority
                style={{ height: "64px", width: "auto" }}
                className="h-16 w-auto"
              />
            </Link>

            {!loading && <CartIcon onClick={() => setCartOpen(true)} />}
          </HStack>
        </Container>
      </Box>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
