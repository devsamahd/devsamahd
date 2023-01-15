import { SectionNumber } from './ProjectSection'
import { Icon, IconProps, useBreakpointValue } from '@chakra-ui/react'

const ProjectTab = () => {
  return (
    <div className="row mt-5 mb-5 pb-5">
      <div className="col-md-2"></div>
      <div className="col-md-8">

        <div className='pt-5'>
          <SectionNumber title='Experience' number={2}/>
          <div className="d-flex align-items-start">
            <div className="nav flex-column me-5" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <div className="active expbtn" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Home</div>
              <div className="expbtn" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</div>
            </div>
            <div className="tab-content" id="v-pills-tabContent">
              <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">This is some placeholder content the Messages tab's associated content. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling. You can use it with tabs, pills, and any other .nav-powered navigation.</div>
              <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">2</div>
            </div>
          </div>
        </div>


      </div>
      <div className="col-md-2"></div>
    </div>
    
  )
}

export default ProjectTab

export const Blur = (props: IconProps) => {
  return (
    <Icon
      width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
      zIndex={useBreakpointValue({ base: -1, md: -1, lg: 0 })}
      height="560px"
      viewBox="0 0 528 560"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle cx="71" cy="61" r="111" fill="#F56565" />
      <circle cx="244" cy="106" r="139" fill="#ED64A6" />
      <circle cy="291" r="139" fill="#ED64A6" />
      <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
      <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
      <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
      <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
    </Icon>
  );
};