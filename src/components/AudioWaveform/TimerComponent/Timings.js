import React from 'react'
import AudioCSS from '../AudioWaveform.module.scss'
import { memo } from 'react'
export default memo(function Timings(props) {
    return (
        <div className={props.className.timings}>
            <span className={props.className.currentTime}>
                {props.currentTime}
            </span>
            <span className={props.className.duration}>
                {props.maxTime}
            </span>
        </div>
    )
})