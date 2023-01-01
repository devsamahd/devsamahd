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
        <Flex>
            
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                src={
                  'devsamahd.svg'
                }
              />
          </Flex>
          <Container maxW={'7xl'}>
        <Stack
          align={'center'}
          py={{ base: 10, md: 10}}
          >
          <Stack flex={1} >
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: 'xl', sm: 'xl', lg: 'md' }}>
              <Text as={'span'} position={'relative'} >
                <Flex><p className="start">Hello, I'm Samahd!</p> &nbsp; {useColorModeValue(<img src="sound.svg" alt="" onClick={playintro}/>, <img src="soundl.svg" alt="" onClick={playintro}  /> )}</Flex>
                <audio src="intro.mp3" ref={audRef}></audio>
              </Text>
            </Heading>
            <Text color={useColorModeValue('gray.600','gray.200')}>
              Hello, I'm a passionate software developer with a desire for writing clean, effective, efficient and scalable programs. <br />
              This is my digital graden where I write about what I love and share my knowledge with others.
            </Text>
          </Stack>
        </Stack>
        </Container>
      </>
    );
  }