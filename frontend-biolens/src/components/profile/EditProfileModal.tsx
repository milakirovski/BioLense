'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useAuth } from '@/context/AuthContext'

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [farmName, setFarmName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open && user) {
      setFirstName(user.firstName ?? '')
      setLastName(user.lastName ?? '')
      setEmail(user.email ?? '')
      setFarmName(user.farmName ?? '')
      setPassword('')
      setConfirmPassword('')
      setError('')
    }
  }, [open, user])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        farmName,
        ...(password ? { password } : {}),
      })
      onClose()
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(d) => { if (!d.open) onClose() }}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <DialogBody>
              <VStack gap="4" align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">First Name</Text>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    borderColor="gray.200"
                    required
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Last Name</Text>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    borderColor="gray.200"
                    required
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Email Address</Text>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    borderColor="gray.200"
                    required
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Farm Name</Text>
                  <Input
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    borderColor="gray.200"
                    required
                  />
                </Box>
                <Box w="full" h="1px" bg="gray.100" />
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">
                    New Password{' '}
                    <Text as="span" color="gray.400" fontWeight="normal">(leave blank to keep current)</Text>
                  </Text>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    borderColor="gray.200"
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb="1.5" color="gray.700">Confirm New Password</Text>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    borderColor="gray.200"
                  />
                </Box>
                {error && (
                  <Box bg="red.50" border="1px solid" borderColor="red.100" borderRadius="md" p="3">
                    <Text fontSize="sm" color="red.700">{error}</Text>
                  </Box>
                )}
              </VStack>
            </DialogBody>
            <DialogFooter gap="3">
              <Button variant="ghost" colorPalette="gray" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button colorPalette="green" type="submit" loading={isLoading} loadingText="Saving…">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
