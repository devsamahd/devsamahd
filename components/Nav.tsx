import { ReactNode, useEffect, useRef } from 'react';
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
  const navRef = useRef<any>(null)
  useEffect(()=>{
    let prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      navRef.current.style.top = "0";
    } else {
      navRef.current.style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;
  }
  })

  const navRef1 = useRef<any>(null)
  useEffect(()=>{
    let prevScrollpos = window.pageYOffset;
  window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      navRef1.current.style.top = "0";
    } else {
      navRef1.current.style.top = "-100px";
    }
    prevScrollpos = currentScrollPos;
  }
  })
  

  return (
    <>
      <Box ml={"20vw"} width={"60vw"} bg={"rgba(0,0,0,.20)"} borderRadius={10} px={4} mt={4} position={"fixed"}  transition={"top 0.7s"} visibility={{base:"hidden", md:"visible"}} ref={navRef1}>
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
                "color": "#4299e1",
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


      <Box width={"100%"} bg={"rgba(0,0,0,.2)"} pt={5} px={4} mt={0} position={"fixed"} visibility={{base:"visible", md:"hidden"}} transition={"top 0.7s"} ref={navRef}>
        <Flex overflowX={{base:'scroll', sm:"hidden"}} pr={{ base: 0, md: 10 }} pl={{ base: 0, md: 10 }} h={16} alignItems={'center'} justifyContent={'space-between'}>
        
         
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
                "color": "#4299e1",
                "textAlign": "right",
                "marginRight":"5px",
                "fontFamily":"monospace"
              }}
              >0{key+1}.</span>
                {nav.name === "Github"? <>Github<ExternalLinkIcon visibility={{base:"hidden"}} /></>: nav.name}
              </b>
              </NavLink>
            ))}
          </HStack>
        </Flex>
      </Box>
    </>
  );
}