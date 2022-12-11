import React from 'react'
import photo from './photo.jpg'
import PhotoCSS from './Photo.module.scss'

export default React.memo(function Photo(props) {
    return (
        props.fullscreen ?
            <div className={PhotoCSS.photo_fullscreen}>
                <img src={photo}></img>
            </div> :
            <div className={PhotoCSS.photo}>
                <img src={photo}></img>
            </div>

    )
})
