import React from 'react'
import BlurCSS from './Blur.module.scss'


export default React.memo(function Blur() {
  return (
    <div className={BlurCSS.blur}></div>
  )
})
