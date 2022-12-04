import React from 'react'
import ThemeButton from './themeButton'

const Navbar = ({theme, setTheme}) => {
  return (
    <nav className='cus-navbar'>
      <div className="navb-item">Logo</div>
      <div className="navb-item">About Me</div>
      <div className="navb-item">Contact</div>
      <div className="navb-item">Projects</div>
      <ThemeButton theme={theme} setTheme={setTheme} />
    </nav>
  )
}

export default Navbar