import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Box,
    Container,
    Stack,
    Text,
    useColorModeValue
  } from '@chakra-ui/react';
import Link from 'next/link';
  
  
  export default function Footer() {
    return (
      <Box
        color={useColorModeValue('gray.700', 'gray.200')}
        borderTop={"1px solid"}
        >
        <Container
          as={Stack}
          maxW={'6xl'}
          marginTop={5}
          marginBottom={5}
          direction={{ base: 'column', md: 'row' }}
          spacing={10}
          justify={{ base: 'center', md: 'center' }}
          align={{ base: 'center', md: 'center' }}>
          
          <Text>© {new Date().getFullYear()} Made by DevSamahd.</Text>
          <Text><Link href={"https://www.twitter.com/devsamahd"} >Twitter<ExternalLinkIcon /></Link></Text>
          <Text><Link href={"https://www.buymeacoffee.com/devsamahd"} >Ko-Fi<ExternalLinkIcon /></Link></Text>
          <Text><Link href={"https://www.github.com/devsamahd"} >Github<ExternalLinkIcon /></Link></Text>
        </Container>
      </Box>
    );
  }