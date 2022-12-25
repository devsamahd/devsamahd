import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
    Center
  } from '@chakra-ui/react';
  import { ReactNode } from 'react';
  
  const SocialButton = ({
    children,
    label,
    href,
  }: {
    children: ReactNode;
    label: string;
    href: string;
  }) => {
    return (
      <chakra.button
        rounded={'full'}
        w={8}
        h={8}
        cursor={'pointer'}
        as={'a'}
        href={href}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
        }}>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
  };
  
  export default function Footer() {
    return (
      <Box
        color={useColorModeValue('gray.700', 'gray.200')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          marginTop={10}
          direction={{ base: 'column', md: 'row' }}
          spacing={10}
          justify={{ base: 'center', md: 'center' }}
          align={{ base: 'center', md: 'center' }}>
          
          <Text>© {new Date().getFullYear()} Made by DevSamahd.</Text><Text>Twitter</Text><Text>Ko-Fi</Text><Text>Github</Text>
        </Container>
      </Box>
    );
  }