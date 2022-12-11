import React from 'react'
import { memo } from 'react'
import AudioCSS from '../../AudioWaveform/AudioWaveform.module.scss'
import Forw10sec from '../../../imgs/forward.png';
import Back10sec from '../../../imgs/back.png';

export default memo(function Skip(props) {
    let wavesurferObj = props.wavesurferObj

    const handleSkip = (value) => {
        if (wavesurferObj) {
            wavesurferObj.skip(value)
        }

    }
    if (props.direction == 'forward')
        return (
            <button onClick={(e) => handleSkip(10)} >
                <img src={Forw10sec} />
            </button>
        )
    else
        return (
            <button onClick={(e) => handleSkip(-10)} >
                <img src={Back10sec} />
            </button>
        )
})
