import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, Input, Button, Box, FormControl, FormLabel, Stack, Heading } from '@chakra-ui/react';
import { loginRequest } from '../../Constant/api-functions';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await loginRequest(password, email);
      toast({
        title: 'Login successful',
        description: 'You are now logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/admin/article');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      bg="gray.50"
    >
      <Box maxW="md" w="full" p={5} borderWidth={1} borderRadius="lg" bg="white">
        <Heading as="h2" size="lg" textAlign="center" mb={6}>
          Login
        </Heading>
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              isLoading={isLoading}
              loadingText="Logging in"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
