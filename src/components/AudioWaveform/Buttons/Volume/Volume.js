import React, {useRef,useCallback } from 'react'
import { Slider } from '@mui/material';
import AudioCSS from './Volume.module.scss'
import { memo } from 'react';
import VolumePhoto from '../../../../imgs/volume.png'


export default memo(function Volume(props) {
    const slider = useRef(null)
	const sliderWrapper = useRef(null)
    const handleVolumeSliderShow = useCallback(e => {
		console.log(e.target);
		slider.current.addEventListener('mouseenter', () => {
			sliderWrapper.current.className = AudioCSS.slider_wrapper_visible
		})
		slider.current.addEventListener('mouseleave', () => {
			sliderWrapper.current.className = AudioCSS.slider_wrapper
		})
	})

    
	const handleVolumeSlider = useCallback((e) => {
		props.setVolume(e.target.value / 100);
	});
    return (
        <section className={AudioCSS.volume_slide_container} ref={slider} onMouseEnter={handleVolumeSliderShow}>
            <img src={VolumePhoto} />
            <div className={AudioCSS.slider_wrapper} ref={sliderWrapper}>
                <Slider orientation="vertical" aria-label="Volume" defaultvalue={props.volume} onChange={handleVolumeSlider} />
            </div>

        </section>
    )
})
