import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Link,
  Button,   
  useColorModeValue,
  Stack,
  HStack,
  useColorMode,
  IconButton,
  useDisclosure,
  Center,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';

const NavLink = ({ children, link }: { children: ReactNode, link:string }) => (
    
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={link !== "github"?`/${link}`: "https://github.com/devsamahd"}>
    {children}
  </Link>
);

export default function Nav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navlist = [{name:'About',link:'about'},{name:'Blog',link:'blog'},{name:'Projects',link:'projects'},{name:'Github',link:'github'}]
  return (
    <>
      <Box bg={useColorModeValue('white', 'gray.800')} px={4}>
        <Flex pr={{ base: 0, md: 10 }} pl={{ base: 0, md: 10 }} h={16} alignItems={'center'} justifyContent={'space-between'}>
            
        <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Box><img src="me.svg" alt="Samahd" /></Box>

          <Center>
            
          <HStack
              as={'nav'}
              spacing={7}
              display={{ base: 'none', md: 'flex' }}>
            {navlist.map((nav, key) => <><NavLink key={key} link={nav.link}><b>{nav.name}</b></NavLink>&nbsp;</>)}
            </HStack>
          </Center>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {navlist.map((nav, key) => (
                <NavLink key={key} link={nav.link}>{nav.name }</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}