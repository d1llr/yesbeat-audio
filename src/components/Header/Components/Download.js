import React, { memo } from 'react'
import downloadIcon from '../../../imgs/download.png'
export default memo(function Telegram(props) {
    return (
        <a href={props.src} download="" className={props.className}>
            <img src={downloadIcon} />
            <span>
                Скачать
            </span>
        </a>
    )
})