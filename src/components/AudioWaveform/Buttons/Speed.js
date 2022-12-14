import React,{memo, useState} from 'react'
import SpeedIcon from '../../../imgs/speed.png';
import AudioCSS from '../../AudioWaveform/AudioWaveform.module.scss'


export default memo(function Speed(props) {
    let wavesurferObj = props.wavesurferObj
	const [rate, setRate] = useState(1)

    const handleSpeed = () => {
		if (wavesurferObj) {
			setRate(prev => prev + 0.5)
			if (rate < 2) {
				setRate(prev => {
					wavesurferObj.setPlaybackRate(prev)
					return prev
				})
			}
			else {
				setRate(prev => {
					wavesurferObj.setPlaybackRate(1)
					return 1
				})
			}
		}
	}

    return (
        <section className={props.className} onClick={handleSpeed}>
            <img src={SpeedIcon} />
            <span>{rate}x</span>
        </section>
    )
})
