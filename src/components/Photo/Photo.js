import React from 'react'
import photo from './photo.jpg'
import PhotoCSS from './Photo.module.css'

export default React.memo(function Photo() {
    return (
        <div className={PhotoCSS}>
            <img src={photo}></img>
        </div>
    )
})
