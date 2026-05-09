"use client";

import { Navbar } from "@/components/layout/navbar";
import { Box } from "@chakra-ui/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <Box as="main" p="8" bg="gray.50" minHeight="100vh">
        {children}
      </Box>
    </>
  );
}
