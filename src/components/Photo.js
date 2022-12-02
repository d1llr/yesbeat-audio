import React from 'react'
import photo from './photo.jpg'


export default React.memo(function Photo() {
    return (
        <div className='photo'>
            <img src={photo}></img>
        </div>
    )
})
