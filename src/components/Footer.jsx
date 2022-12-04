import React from 'react'

const Footer = () => {
    const year =new Date().getFullYear()
  return (
    <footer>
        &copy;copyright {year}. DevSamahd
    </footer>
  )
}

export default Footer