"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";

export function SettingsLayout() {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [farmName, setFarmName] = useState(user?.farmName ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      setSuccess(false);
      return;
    }
    setIsLoading(true);
    setSuccess(false);
    setError("");
    try {
      await updateProfile({ firstName, lastName, farmName });
      setSuccess(true);
      setIsEditing(false);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box px={{ base: 4, md: 6, lg: 10 }} pb={10}>
      <Box pt={6} mb={6}>
        <Heading size="2xl" color="green.800" fontWeight="bold">
          Settings
        </Heading>
        <Text color="gray.500" fontSize="sm" mt="1">
          Manage your profile and account preferences
        </Text>
      </Box>

      <VStack align="stretch" gap="6" maxW="2xl">
        <Box
          bg="white"
          p="8"
          borderRadius="xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <HStack justify="space-between" mb="6">
            <Heading size="md">Profile Information</Heading>
          </HStack>

          <form onSubmit={onSubmit}>
            <VStack gap="4" align="stretch">
              <HStack gap="4">
                <Box flex="1">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb="1.5"
                    color="gray.700"
                  >
                    First Name
                  </Text>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    borderColor={isEditing ? "gray.200" : "transparent"}
                    bg={isEditing ? "white" : "gray.50"}
                    color={isEditing ? "gray.900" : "gray.600"}
                    cursor={isEditing ? "text" : "default"}
                  />
                </Box>
                <Box flex="1">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    mb="1.5"
                    color="gray.700"
                  >
                    Last Name
                  </Text>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    borderColor={isEditing ? "gray.200" : "transparent"}
                    bg={isEditing ? "white" : "gray.50"}
                    color={isEditing ? "gray.900" : "gray.600"}
                    cursor={isEditing ? "text" : "default"}
                  />
                </Box>
              </HStack>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  mb="1.5"
                  color="gray.700"
                >
                  Farm Name
                </Text>
                <Input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  disabled={!isEditing}
                  borderColor={isEditing ? "gray.200" : "transparent"}
                  bg={isEditing ? "white" : "gray.50"}
                  color={isEditing ? "gray.900" : "gray.600"}
                  cursor={isEditing ? "text" : "default"}
                />
              </Box>

              {success && (
                <Box
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.100"
                  borderRadius="md"
                  p="3"
                >
                  <Text fontSize="sm" color="green.700">
                    Profile updated successfully.
                  </Text>
                </Box>
              )}
              {error && (
                <Box
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.100"
                  borderRadius="md"
                  p="3"
                >
                  <Text fontSize="sm" color="red.700">
                    {error}
                  </Text>
                </Box>
              )}
              <HStack display={"flex"} align="end">
                <Button
                  type="submit"
                  colorPalette="green"
                  variant={isEditing ? "solid" : "outline"}
                  loading={isLoading}
                  loadingText="Saving…"
                >
                  {isEditing ? "Save Changes" : "Edit"}
                </Button>
                {isEditing && (
                  <Button
                    size="md"
                    variant="ghost"
                    colorPalette="gray"
                    onClick={() => {
                      setIsEditing(false);
                      setFirstName(user?.firstName ?? "");
                      setLastName(user?.lastName ?? "");
                      setFarmName(user?.farmName ?? "");
                      setError("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </HStack>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
}
