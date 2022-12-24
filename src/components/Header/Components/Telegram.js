import React, { memo } from 'react'
import TelegramIcon from '../../../imgs/telegram.png'
export default memo(function Telegram(props) {
    return (
        <button className={props.className}>
            <img src={TelegramIcon} />
            <span>
                Отправить в Telegram
            </span>
        </button>
    )
})