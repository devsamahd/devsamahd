import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Link, TagRightIcon } from '@chakra-ui/react';
import { useState } from 'react';
import styled from 'styled-components';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }
  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }
  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;
    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);
  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }
  a {
    position: relative;
    z-index: 1;
  }
  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: #1a202c;
    transition: var(--transition);
    overflow: auto;
  }
  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;
    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }
    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);
      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;
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
    }
  }
  .project-title {
    margin: 0 0 10px;
    color: white;
    font-size: var(--fz-xxl);
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
  .project-description {
    color: var(--light-slate);
    font-size: 17px;
    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }
  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;
    color:white;
    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;
      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;
export const ProjectInner = ({project}:{project:any}) => {

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <img src="default.svg" alt="" />
            </div>
            <div className="project-links">
              
                <a href={"/"} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <img src="github.png" alt="" />
                </a>
              
             
                <a
                  href={""}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <ExternalLinkIcon />
                </a>
             
            </div>
          </div>

          <h3 className="project-title">
            <a href={"/"} target="_blank" rel="noreferrer">
              {project.name}
            </a>
          </h3>

          <div className="project-description" >{project.description}</div>
        </header>

        <footer>
            <ul className="project-tech-list">
              {project?.tags?.map((tag:any, i:any) => (
                <li key={i}>{tag?.title}</li>
              ))}
            </ul>
        </footer>
      </div>
    );
  };

const Projects = ({projects}:{projects:any[]}) => {

  const [showMore, setShowMore] = useState(false);


  return (
    <StyledProjectsSection>
      <h2>Other Noteworthy Projects</h2>

      <Link className="inline-link archive-link" href="https://github.com/devsamahd" >
        view the archive
      </Link>

      <ul className="projects-grid">
          <>
            {
              projects.map((project, i) => (
                <StyledProject key={i}><ProjectInner project={project} /></StyledProject>
              ))}
          </>
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </StyledProjectsSection>
  );
};

export default Projects;