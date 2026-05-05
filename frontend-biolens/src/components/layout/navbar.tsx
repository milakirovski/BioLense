"use client";

import {
  Box,
  Flex,
  Text,
  HStack,
  Link,
  Container,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

const LinkItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Analysis Lab", href: "/analysis" },
  { name: "History & Reports", href: "/history" },
  { name: "Settings", href: "/settings" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <Box as="nav" bg="white" py="7">
      <Container maxW="full" px="8">
        <Flex align="center" justify="space-between">
          {/* LEFT */}
          <Box>
            <HStack gap="4" align="baseline" paddingLeft={2}>
              <Text fontSize="2xl" fontWeight="bold" color="green.800">
                BioLens
              </Text>
              <Text
                fontSize="lg"
                color="gray.400"
                fontWeight="bold"
                letterSpacing="wider"
                transform="translateY(-1px)"
              >
                Farm Management Platform
              </Text>
            </HStack>
          </Box>

          {/* CENTER */}
          <Box>
            <HStack gap="14">
              {LinkItems.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    asChild
                    color={isActive ? "green.600" : "gray.500"}
                    fontWeight={isActive ? "bold" : "semibold"}
                    fontSize="lg"
                    _hover={{ color: "green.500", textDecoration: "none" }}
                    outline={"none"}
                  >
                    <NextLink href={link.href}>{link.name}</NextLink>
                  </Link>
                );
              })}
            </HStack>
          </Box>

          {/* RIGHT */}
          <Box>
            <NextLink href="/profile" passHref>
              <Button
                bg="green.50"
                color="green.700"
                w="12"
                h="12"
                fontWeight="bold"
                _hover={{ bg: "green.100", transform: "scale(1.05)" }}
                transition="0.2s"
                borderRadius={"full"}
              >
                MS
              </Button>
            </NextLink>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};
