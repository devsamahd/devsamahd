import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Img,
  Flex,
  Center,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { BsArrowUpRight} from 'react-icons/bs';
import { urlFor } from '../lib/sanity';
import Link from 'next/link';

const ProjectSection = ({data}:{data:any[]}) => {
    const newData = ((data.reverse()).slice(0,3))
    const more = data.slice(3)
  return (
    <div style={{"marginTop":"40px"}}>
        <Heading size={'lg'} fontFamily={'inherit'}>Projects</Heading>
        <div className='row'>
            {
                newData && newData.map((project:any) => (
                    <div className="col-md-4" key={project._id}>
                    <Center py={6}> 
                        <Box
                            w="xs"
                            rounded={'sm'}
                            my={5}
                            mx={[0, 5]}
                            overflow={'hidden'}
                            bg={useColorModeValue('gray.100','gray.900')}
                            borderRadius={'lg'}
                            border={"1px"}
                            borderColor={useColorModeValue("gray.100","blackAlpha.200")}
                            >
                            <Box h={'200px'} borderColor="black">
                            <Img
                                src={urlFor(project.mainImage)} 
                                roundedTop={'sm'}
                                objectFit="cover"
                                h="full"
                                w="full"
                                alt={'Blog Image'}
                            />
                            </Box>
                            <Box p={4}>

                            <Box
                                bg="green.900"
                                display={'inline-block'}
                                px={2}
                                py={1}
                                color="white"
                                mb={2}>
                                <Text fontSize={'xs'} fontWeight="medium">
                                {project.year}
                                </Text>
                            </Box>
                            
                            <Heading fontSize={'xl'} noOfLines={1}>
                                {project.name}
                            </Heading>
                            <Text color={'gray.500'} noOfLines={1}>
                                {project.description}
                            </Text>
                            <br />
                            {project.tags.map((tag:any) => (<><Box
                                bg="black"
                                display={'inline-block'}
                                px={2}
                                py={1}
                                color="white"
                                mb={2}>
                                <Text fontSize={'xs'} fontWeight="medium">
                                {tag.title}
                                </Text>
                            </Box>&nbsp;</>))}
                            </Box>
                            <Link href={project.name}>
                                <Flex
                                    p={4}
                                    pt={0}
                                    alignItems="center"
                                    justifyContent={'space-between'}
                                    roundedBottom={'sm'}
                                    cursor={'pointer'}
                                    w="full"
                                    >
                                    <Text fontSize={'md'} fontWeight={'semibold'}>
                                    Preview
                                    </Text>
                                    <BsArrowUpRight />
                                </Flex>
                            </Link>
                        </Box>
                    </Center>
                    </div>
                ))
            }
            {
                more && newData.map((project:any) => (
                    <div className="col-md-4" key={project._id}>
                    <Center py={6}>
                    <div className="card p-1" style={{"width" : "20rem", "background": useColorModeValue('#e2e8f0','#171923')}}>
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 text-success">{project.year}</h6>
                            <Heading size={'md'} style={{"color": "inherit"}}>{project.name}</Heading>
                            <Text noOfLines={1} fontWeight={400}><p className="card-text text-muted">{project.description}</p></Text>
                            <br />
                            <a href="#" className="butn">Code</a>
                        </div>
                    </div>
                    </Center>
                    </div>
                ))
            }
        </div>
    </div>
  )
}




export default ProjectSection