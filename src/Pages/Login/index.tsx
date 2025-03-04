import React, { useState } from 'react';
import { Box, Heading, Text, FormControl, FormLabel, Input, Button, Stack, Link, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { loginRequest } from '../../Constant/api-functions';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.themeMode.mode);

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await loginRequest(password, email);
      toast({
        title: 'Login successful',
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

  const isDarkMode = !themeMode;

  return (
    <Box
      position="relative"
      height="100vh"
      width="100vw"
      bgGradient={!themeMode ? "linear(to-b, #0c1022, #3d4285 )" : "linear(to-b, #2fdaa1 , #07714e )"}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Login Form Container */}
      <Box
        bg={!themeMode ? "rgba(15, 23, 42, 0.85)" : "#124635"}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        width="full"
        maxW="md"
        color={!themeMode ? "white" : "white"}
      >
        <Heading as="h2" size="lg" mb={2}>
          Here you can <Text as="span" fontWeight="bold">Login</Text>
        </Heading>
        <Text fontSize="sm" mb={6}>Let's join us :)</Text>

        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                bg={isDarkMode ? "gray.700" : "gray.100"}
                borderColor={isDarkMode ? "gray.600" : "gray.300"}
                _placeholder={{ color: isDarkMode ? 'gray.400' : 'gray.500' }}
                color={isDarkMode ? "white" : "gray.800"}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                bg={isDarkMode ? "gray.700" : "gray.100"}
                borderColor={isDarkMode ? "gray.600" : "gray.300"}
                _placeholder={{ color: isDarkMode ? 'gray.400' : 'gray.500' }}
                color={isDarkMode ? "white" : "gray.800"}
              />
            </FormControl>

            <Button
              type="submit"
              bgGradient={!themeMode ? "linear(to-r, #6B46C1, #805AD5)" : "linear(to-r, #52b997  , #0d714f )"}
              color="white"
              _hover={{ bgGradient: "linear(to-r, #6B46C1, #9F7AEA)" }}
              isLoading={isLoading}
            >
              LOGIN
            </Button>
          </Stack>
        </form>

        {/* <Text mt={4} textAlign="center" fontSize="sm">
          <Link color={isDarkMode ? "gray.400" : "gray.600"} href="#">Forgot your password?</Link>
        </Text> */}
      </Box>

      {/* Optional Wave Background */}
      <Box
        position="absolute"
        bottom="0"
        width="100%"
        height="100px"
        backgroundImage="url('/path-to-wave.svg')"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        backgroundPosition="bottom"
        filter={isDarkMode ? 'brightness(0.7)' : 'none'}
      />
    </Box>
  );
};

export default Login;
