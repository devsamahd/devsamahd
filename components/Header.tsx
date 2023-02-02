import {
    Stack,
    Flex,
    Heading,
    Text,
    Button,
    Box,
  } from '@chakra-ui/react';
import { useRef } from 'react';
import { Blur } from './Experience';
  
  export default function Header() {
    const audRef = useRef<HTMLAudioElement>(null)
  const playintro = ():void => {
    if(audRef.current) audRef.current.play() 
  }

 return (
      <>
      <Box maxWidth={{base: "100%", md:"80%"}} style={{ "marginTop":"150px"}} data-aos="fade-in">
        <Stack
          py={{ base: 10, md: 10}}
          >
          <Stack flex={1} >
          <Blur
              position={'absolute'}
              top={10}
              left={10}
              opacity={0.5}
              style={{ filter: 'blur(70px)' }}
            />
            <Heading
              fontWeight={400}
              fontSize={{ base: 'sm', sm: 'sm', lg: 'sm' }}
              >
              <Text as={'span'} position={'relative'} >
                <Flex justifyContent={'space-between'}>
                  <p className="start mt-2" >Hello, my name is</p> <img src="sound.svg" alt="" onClick={playintro}/>
                  <audio src="intro.mp3" ref={audRef}></audio>
                </Flex>
              </Text>
            </Heading>
            <Heading size={'4xl'}>
              AO Abdulsalam.
            </Heading>
            <Heading size={'3xl'} color={'gray.700'}>
              I build things for the web.
            </Heading>
            
            <Text color={'gray.600'} width={{base:'100%', md:'72%'}} letterSpacing={"wide"} fontWeight={"500"} pt={30}>
              I'm a passionate software developer with a desire for writing clean, effective, efficient and scalable software programs.
              This is my digital garden where I write about what I love and share my knowledge with others.
            </Text>
            <Flex pt={10}>
              <Button p={7} m={"3"} width={"sm"} border={"2px solid #1a202c"} color={"#1a202c"}  background={'transparent'}>Portfolio</Button>
              <Button p={7} m={"3"} width={"sm"} color={"white"}  background={"#1a202c"} _hover={{bg:"gray"}}>Contact me!</Button>
            </Flex>
          </Stack>
        </Stack>
        </Box>
      </>
    );
  }