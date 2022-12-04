import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({theme, setTheme}) => {
  return (
    <>
    <Navbar theme={theme} setTheme={setTheme} />
    <main>
        <Outlet theme={theme} />
    </main>
    <Footer />
    </>
    
  )
}

export default Layout