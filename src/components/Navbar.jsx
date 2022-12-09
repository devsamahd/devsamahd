import { Link } from 'react-router-dom'
import ThemeButton from './themeButton'


const Navbar = () => {

  return (
    <nav className='cus-navbar'>
      <Link className="navb-item"><img src="me.svg" alt="Samahd" /></Link>
      <Link className="navb-item">About Me</Link>
      <Link className="navb-item">Contact</Link>
      <Link className="navb-item">Projects</Link>
      <ThemeButton />
    </nav>
  )
}

export default Navbar