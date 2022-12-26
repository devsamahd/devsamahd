import {
    Container,
    Stack,
    Flex,
    Box,
    Heading,
    Text,
    Button,
    Image,
    useColorModeValue,
  } from '@chakra-ui/react';
import { useRef } from 'react';
  
  export default function Header() {
    const audRef = useRef<HTMLAudioElement>(null)
  const playintro = ():void => {
    if(audRef.current) audRef.current.play() 
  }

  const backgrounds = `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='560' height='185' viewBox='0 0 560 185' fill='none'%3E%3Cellipse cx='457.367' cy='123.926' rx='102.633' ry='61.0737' transform='rotate(-180 457.367 123.926)' fill='%23ECC94B'/%3E%3Cellipse cx='160.427' cy='61.0737' rx='102.633' ry='61.0737' transform='rotate(-180 160.427 61.0737)' fill='%239F7AEA'/%3E%3Cellipse cx='193.808' cy='111.771' rx='193.808' ry='73.2292' transform='rotate(-180 193.808 111.771)' fill='%234299E1'/%3E%3Cellipse cx='337.295' cy='74.415' rx='193.808' ry='73.2292' transform='rotate(-180 337.295 74.415)' fill='%2348BB78'/%3E%3C/svg%3E")`
    return (
      <Container maxW={'7xl'}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 10, md: 18 }}
          direction={{ base: 'column', md: 'row' }}>
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '3xl', lg: '5xl' }}>
              <Text as={'span'} position={'relative'} >
                <Flex>Hello, I'm Samahd!&nbsp; {useColorModeValue(<img src="sound.svg" alt="" onClick={playintro}/>, <img src="soundl.svg" alt="" onClick={playintro}  /> )}</Flex>
                <audio src="intro.mp3" ref={audRef}></audio>
              </Text>
            </Heading>
            <Text color={useColorModeValue('gray.600','gray.200')}>
              Hello, I'm a passionate software developer with a desire for writing clean, effective, efficient and scalable programs. <br />
              This is my digital graden where I write about what I love and share my knowledge with others.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}>
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}
                color={'white'}
                colorScheme={'blue'}
                bg={'blue.600'}
                _hover={{ bg: 'blue.800' }}>
                Portfolio
              </Button>
              <Button
                rounded={'full'}
                size={'lg'}
                fontWeight={'normal'}
                px={6}>
                Contact Me
              </Button>
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
              _before={{
                content: '"g"',
                position: 'absolute',
                zIndex: '-1',
                height: '70%',
                maxW: '640px',
                width: '50%',
                filter: 'blur(40px)',
                transform: 'scale(0.98)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                top: 20,
                left: 20,
                backgroundImage: backgrounds,
              }}
            >
            
            <Box
              position={'relative'}
              height={'500px'}
              overflow={'hidden'}
              >
              <Image
                alt={'Hero Image'}
                fit={'cover'}
                align={'center'}
                w={'100%'}
                h={'100%'}
                src={
                  'header.svg'
                }
                
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
    );
  }
  
