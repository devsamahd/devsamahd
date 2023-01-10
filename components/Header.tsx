import {
    Stack,
    Flex,
    Heading,
    Text,
    Image,
    useColorModeValue,
    Container,
  } from '@chakra-ui/react';
import { useRef } from 'react';
  
  export default function Header() {
    const audRef = useRef<HTMLAudioElement>(null)
  const playintro = ():void => {
    if(audRef.current) audRef.current.play() 
  }

 return (
      <>
      <div  style={{"maxWidth":"80%", "marginTop":"90px"}}>
        <Stack
          py={{ base: 10, md: 10}}
          >
          <Stack flex={1} >
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
            <Text color={'gray.600'} width={{base:'100%', md:'65%'}}>
              I'm a passionate software developer with a desire for writing clean, effective, efficient and scalable programs.
              This is my digital garden where I write about what I love and share my knowledge with others.
            </Text>
          </Stack>
        </Stack>
        </div>
      </>
    );
  }