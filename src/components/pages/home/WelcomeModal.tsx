"use client";

import { useEffect, useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function WelcomeModal() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setTimeout(() => {
        setShowWelcomeModal(true);
        localStorage.setItem("hasVisited", "true");
      }, 1000);
    }
  }, []);

  return (
    <AuthModal
      open={showWelcomeModal}
      onClose={() => setShowWelcomeModal(false)}
      allowGuest={true}
    />
  );
}
