import React, { memo, useEffect, useRef,useState } from 'react'
import AudioCSSFullScreen from './FullScreen.module.scss'
import wavesurfer from 'wavesurfer.js';
import Photo from '../../Photo/Photo';
import Blur from '../../Blur/Blur';
import Volume from '../Buttons/Volume/Volume';
import AudioCSS from '../../AudioWaveform/AudioWaveform.module.scss'
import ListPhoto from '../../../imgs/list.png'
import fullScreenPhoto from '../../../imgs/fullscreen.png'
import PlayPause from '../Buttons/PlayPause';
import Skip10sec from '../Buttons/Skip10sec';
import Speed from '../Buttons/Speed';
import Header from '../../Header/Header';
import logotype from '../../Header/logo.png'
import WarningIcon from '@mui/icons-material/Warning';
import TelegramIcon from '@mui/icons-material/Telegram';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Fullscreen_minimize from '../../../imgs/fullscreen_minimize.png';
import Timings from '../TimerComponent/Timings';
import Telegram from '../../Header/Components/Telegram';
import Download from '../../Header/Components/Download';
import Warning from '../../Header/Components/Warning';
import Logotype from '../../Header/Components/Logotype';

export default memo(function FullScreen(props) {
    const wavesurferRef = useRef(null);
    const inDev = useRef(null)
    useEffect(() => {
        if (wavesurferRef.current && !props.wavesurferObj) {
            props.setWavesurferObj(
                wavesurfer.create({
                    container: wavesurferRef.current,
                    scrollParent: false,
                    autoCenter: true,
                    height:  window.innerWidth < 444 ? 300 : 600,
                    loopSelection: true,
                    barWidth: window.innerWidth < 444 ? 2 : 5,
                    waveColor: '#7e898e ',
                    progressColor: '#dbe0e3',
                    barHeight:1,
                    barRadius: 1,
                    barMinHeight: 10,
                    cursorColor: 'transparent',
                    fillParent: true,
                    rate: props.rate,
                    interact: true,
                })
            )
            console.log('Создано');
            props.setPageLoad(true)
        }
    }, [wavesurferRef, props.wavesurferObj]);
    const handleInDevelopment = (e) => {
        console.log(e.target);
        e.target.addEventListener('mouseenter', () => {
            inDev.current.className = AudioCSSFullScreen.in_dev_true
        })
        e.target.addEventListener('mouseleave', () => {
            inDev.current.className = AudioCSSFullScreen.in_dev_false
        })
        inDev.current.className = AudioCSSFullScreen.in_dev
    }
    return (
        <section className={AudioCSSFullScreen.waveform_container_fullscreen}>
            <div className={props.pageLoad ? AudioCSSFullScreen.loader : AudioCSSFullScreen.loader_invisible}></div>
            <section className={AudioCSSFullScreen.waveform_wrapper_fullscreen}>
                <div className={AudioCSSFullScreen.fullscreen_info}>
                    <Logotype className={AudioCSSFullScreen.logotype} />
                    <div className={AudioCSSFullScreen.info_with_out_logotype}>
                        <span className={AudioCSSFullScreen.date}>
                            {props.date ? props.date : '5 дней назад'}
                        </span>
                        <h1 className={AudioCSSFullScreen.name}>
                            {props.name ? props.name : 'Наименование трека'}
                        </h1>
                        <h1 className={AudioCSSFullScreen.bpm}>
                            {props.info ? props.info : `999 BPM, `}{props.maxTime}{`,Март 2022`}
                        </h1>
                        <span className={AudioCSSFullScreen.hashtag}>
                            {props.hashtag ? props.hashtag : '#Музыкадляфитнеса'}
                        </span>
                    </div>
                </div>
                <Photo fullscreen={true} />
                <div className={AudioCSSFullScreen.waveform_timings_wrapper}>
                    <div ref={wavesurferRef} id="waveform" className={AudioCSSFullScreen.waveform} />
                    <Timings currentTime={props.currentTime} maxTime={props.maxTime} className={AudioCSSFullScreen} />
                </div>

                <div className={AudioCSSFullScreen.stopButtons}>
                    <Skip10sec wavesurferObj={props.wavesurferObj} direction='backward' />
                    <PlayPause wavesurferObj={props.wavesurferObj} setPlaying={props.setPlaying} playing={props.playing} className={AudioCSSFullScreen.controls} />
                    <Skip10sec wavesurferObj={props.wavesurferObj} direction='forward' />
                </div>
                {props.machine ? <div></div>
                    :
                    <div className={AudioCSSFullScreen.fullscreen}>
                        <img src={Fullscreen_minimize} onClick={() => props.handlefullScreen()} />
                    </div>
                }
            </section>
            <section className={AudioCSSFullScreen.footer_wrapper}>
                <Warning className={AudioCSSFullScreen.warning} />
                <section>
                    <Volume volume={props.volume} setVolume={props.setVolume} />
                    <Speed wavesurferObj={props.wavesurferObj} className={AudioCSSFullScreen.speed} />

                </section>
                <section className={AudioCSSFullScreen.in_dev}>
                    <img src={ListPhoto} onMouseEnter={handleInDevelopment} />
                    <span ref={inDev} className={AudioCSSFullScreen.in_dev_false}>
                        В разработке
                    </span>
                </section>

                <section>
                    <Telegram className={AudioCSSFullScreen.telegram} />
                    <Download className={AudioCSSFullScreen.download} src={props.src} />
                </section>
            </section>
        </section>
    )
})
