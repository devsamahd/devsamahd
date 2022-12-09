import React from 'react'

const Footer = () => {
    const year =new Date().getFullYear()
  return (
    <footer>
        &copy;{year}. DevSamahd. MIT Licensed.
    </footer>
  )
}

export default Footer