import {
  Img,
  Flex,
  Text,
} from '@chakra-ui/react';
import { urlFor } from '../lib/sanity'
import styled from 'styled-components'
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Projects from './MoreProject';
interface GridProps {
    readonly children: any;
    readonly theme: any;
  };

const StyledProjectsGrid = styled.ul<GridProps>`
  ${({ theme }) => theme.mixins.resetList};
  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;
  @media (max-width: 768px) {
    ${({ theme }) => theme.mixins.boxShadow};
  }
  &:not(:last-of-type) {
    margin-bottom: 100px;
    @media (max-width: 768px) {
      margin-bottom: 70px;
    }
    @media (max-width: 480px) {
      margin-bottom: 30px;
    }
  }
  &:nth-of-type(odd) {
    .project-content {
      grid-column: 7 / -1;
      text-align: right;
      @media (max-width: 1080px) {
        grid-column: 5 / -1;
      }
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding: 40px 40px 30px;
        text-align: left;
      }
      @media (max-width: 480px) {
        padding: 25px 25px 20px;
      }
    }
    .project-tech-list {
      justify-content: flex-end;
      @media (max-width: 768px) {
        justify-content: flex-start;
      }
      li {
        margin: 0 0 5px 20px;
        @media (max-width: 768px) {
          margin: 0 10px 5px 0;
        }
      }
    }
    .project-links {
      justify-content: flex-end;
      margin-left: 0;
      margin-right: -10px;
      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: -10px;
        margin-right: 0;
      }
    }
    .project-image {
      grid-column: 1 / 8;
      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }
  .project-content {
    position: relative;
    grid-column: 1 / 7;
    grid-row: 1 / -1;
    @media (max-width: 1080px) {
      grid-column: 1 / 9;
    }
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      grid-column: 1 / -1;
      padding: 40px 40px 30px;
      z-index: 5;
    }
    @media (max-width: 480px) {
      padding: 30px 25px 20px;
    }
  }
  .project-overline {
    margin: 10px 0;
    color: #4299e1;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 500;
  }
  .project-title {
    color: #1a300f;
    font-size: clamp(24px, 5vw, 28px);
    @media (min-width: 768px) {
      margin: 0 0 20px;
    }
    @media (max-width: 768px) {
      color: var(--white);
      a {
        position: static;
        &:before {
          content: '';
          display: block;
          position: absolute;
          z-index: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }
  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: #1a202c;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;
      &:hover {
        box-shadow: none;
      }
    }
    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
    strong {
      color: var(--white);
      font-weight: normal;
    }
  }
  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;
    li {
      margin: 0 20px 5px 0;
      color: #1a202c;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }
    @media (max-width: 768px) {
      margin: 10px 0;
      li {
        margin: 0 10px 5px 0;
        color: var(--lightest-slate);
      }
    }
  }
  .project-links {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 10px;
    margin-left: -10px;
    color: #1a202c;
    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 10px;
      &.external {
        svg {
          width: 22px;
          height: 22px;
          margin-top: -4px;
        }
      }
      svg {
        width: 20px;
        height: 20px;
      }
    }
    .cta {
      ${({ theme }) => theme.mixins.smallButton};
      margin: 10px;
    }
  }
  .project-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 6 / -1;
    grid-row: 1 / -1;
    position: relative;
    z-index: 1;
    @media (max-width: 768px) {
      grid-column: 1 / -1;
      height: 100%;
      opacity: 0.25;
    }
    a {
      width: 100%;
      height: 100%;
      background-color: var(--green);
      border-radius: var(--border-radius);
      vertical-align: middle;
      &:hover,
      &:focus {
        background: transparent;
        outline: 0;
        &:before,
        .img {
          background: transparent;
          filter: none;
        }
      }
      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--navy);
        mix-blend-mode: screen;
      }
    }
    .img {
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1) brightness(90%);
      @media (max-width: 768px) {
        object-fit: cover;
        width: auto;
        height: 100%;
        filter: grayscale(100%) contrast(1) brightness(50%);
      }
    }
  }
`;

export const SectionNumber = ({ number, title}: { number: number, title: string}) => {
    return(
        <Flex
          align={'center'}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: 'gray.300',
            flexGrow: 1,
            ml: 0,
            mr: {base:"0%", md:"50%"}
        }}
        >
        <Flex
        p={5}
        fontSize={20}
        fontWeight={600}
        fontFamily={'monospace'}
        color={'blue.400'}
        >
            0{number}.&nbsp;<Text color={'gray.900'} fontSize={'3xl'}>{title}</Text>
        </Flex>
        </Flex>
        
    )
}




const ProjectSection = ({data}:{data:any[]}) => {

    const newData = ((data.reverse()).slice(0,3))
    const secondData = ((data.reverse()).slice(3))

    
return (
    <section><br /><br /><br /><br />
        <SectionNumber number={2} title={`Some things I've built`} /><br /><br />
    <StyledProjectsGrid>
        {newData && newData.map(( data, i) => (
            <StyledProject key={i} ref={el => (data[i] = el)}>
                <div className="project-content">
                  <div>
                    <p className="project-overline">Featured Project</p>

                    <h3 className="project-title">
                      <a href={"/"}>{data.name}</a>
                    </h3>

                    <div
                      className="project-description"
                    >{data.description}</div>

                    {
                      <ul className="project-tech-list">
                        {data?.tags?.map((tag:any, i:any) => (
                          <li key={i}>{tag?.title}</li>
                        ))}
                      </ul>
                    }

                    <div className="project-links">
                        {data.github !== "un" && <a href={data.github} aria-label="Course Link" className="cta">
                          Code
                        </a>}
                        <a href={"/"} aria-label="External Link" className="external">
                          <ExternalLinkIcon />
                        </a>
                    </div>
                  </div>
                </div>

                <div className="project-image">
                  <a href={"/"}>
                  {data.mainImage ? <Img
                    src={urlFor(data.mainImage).url()}
                    h="100%"
                    w="100%"
                    alt={'Blog Image'}
                  />: <></>}
                  </a>
                </div>
              </StyledProject>
            
          ))}
      </StyledProjectsGrid><br /><br /><br /><br /><br /><br />
      <Projects projects={secondData} />
    </section>

)
}




export default ProjectSection