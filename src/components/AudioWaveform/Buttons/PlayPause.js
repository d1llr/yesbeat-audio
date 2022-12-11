import React,{useState} from 'react'
import { memo } from 'react'
import AudioCSS from '../../AudioWaveform/AudioWaveform.module.scss'
import play from '../../../imgs/play.png';
import pause from '../../../imgs/pause.png';


export default memo(function PlayPause(props) {
    const [playing, setPlaying] = useState(true);
    let wavesurferObj = props.wavesurferObj
    
	const handlePlayPause = (e) => {
		wavesurferObj.playPause();
        setPlaying(!playing);
	};


    return (
        <button
            title='play/pause'
            className={AudioCSS.controls}
            onClick={handlePlayPause}>
            {playing ? (
                <img src={pause} />
            ) : (
                <img src={play} />
            )}
        </button>
    )
})
