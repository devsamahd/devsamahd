import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Link,  
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

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
  const navlist = [{name:'About',link:'me'},{name:'Experience',link:'experience'},{name:'Projects',link:'projects'},{name:'Github',link:'github'}]
  return (
    <>
      <Box ml={"20vw"} width={"60vw"} bg={"rgba(0,0,0,.25)"} borderRadius={10} px={4} mt={4} position={"fixed"} visibility={{base:"hidden", md:"visible"}}>
        <Flex pr={{ base: 0, md: 10 }} pl={{ base: 0, md: 10 }} h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box><Link href='/'><img src="me.svg" alt="Samahd" /></Link></Box>
         
          <HStack as={'nav'} spacing={7} align={'right'} display={{ base: 'flex', md: 'flex' }}>
            {navlist.map((nav,key) => (
              <NavLink 
              key={key} 
              link={nav.link}
              >
                <b>
                  <span
              style={{
                "content": '"0"',
                "color": "lightblue",
                "textAlign": "right",
                "marginRight":"5px",
                "fontFamily":"monospace"
              }}
              >0{key+1}.</span>
                {nav.name === "Github"? <>Github<ExternalLinkIcon /></>: nav.name}
              </b>
              </NavLink>
            ))}
          </HStack>
        </Flex>
      </Box>
    </>
  );
}