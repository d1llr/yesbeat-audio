import React, { memo } from 'react'
import logotype from '../logo.png'
import HeaderCSS from '../Header.module.scss'
export default memo(function Logotype(props) {
    return (
        <div className={props.className ? props.className : HeaderCSS.brand}>
            <img src={logotype} />
        </div>
    )
})
