import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { FileContext } from '../../contexts/fileContext';
import wavesurfer from 'wavesurfer.js';
import Photo from '../Photo/Photo';
import Blur from '../Blur/Blur';
import Volume from './Buttons/Volume/Volume';
import AudioCSS from '../AudioWaveform/AudioWaveform.module.scss'
import ListPhoto from '../../imgs/list.png'
import fullScreen from '../../imgs/fullscreen.png'
import PlayPause from './Buttons/PlayPause';
import Skip10sec from './Buttons/Skip10sec';
import Speed from './Buttons/Speed';
import Header from '../Header/Header';
import logotype from '../Header/logo.png'
import WarningIcon from '@mui/icons-material/Warning';
import TelegramIcon from '@mui/icons-material/Telegram';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import  Fullscreen_minimize  from '../../imgs/fullscreen_minimize.png';



const AudioWaveform = React.memo(() => {
	let props = {}
	const wavesurferRef = useRef(null);
	const fill = useRef(null);
	const inDev = useRef(null)
	const [rate, setRate] = useState(1)
	const [currentTime, setCurrentTime] = useState()
	const [maxTime, setMaxTime] = useState()
	// fetch file url from the context
	const { fileURL, setFileURL } = useContext(FileContext);
	const [fullscreen, setFullscreen] = useState(false)
	// crate an instance of the wavesurfer
	const [wavesurferObj, setWavesurferObj] = useState();

	const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
	const [volume, setVolume] = useState(0.1); // to control volume level of the audio. 0-mute, 1-max
	const [zoom, setZoom] = useState(0); // to control the zoom level of the waveform
	const [duration, setDuration] = useState(0); // duration is used to set the default region of selection for trimming the audio

	// create the waveform inside the correct component
	useEffect(() => {
		if (wavesurferRef.current && !wavesurferObj) {
			setWavesurferObj(
				wavesurfer.create({
					container: '#waveform',
					scrollParent: false,
					autoCenter: true,
					height: 600,
					loopSelection: true,
					barWidth: 2,
					waveColor: '#7e898e ',
					progressColor: '#dbe0e3',
					barMinHeight: 10,
					cursorColor: 'transparent',
					fillParent: true,
					rate: rate,
					interact: true,
				})
			)
		}
	}, [wavesurferRef, wavesurferObj, fullscreen]);

	// useEffect(() => {
	// 	if (duration && wavesurferObj) {
	// 		// add a region with default length
	// 		// wavesurferRef.current.addEventListener('mouseenter',()=>{
	// 		// 	let x = window.event.clientX
	// 		// 	wavesurferObj.addRegion({
	// 		// 		start: 0, // time in seconds
	// 		// 		end: 5,
	// 		// 		color: 'hsla(265, 100%, 86%, 0.4)', // color of the selected region, light hue of purple
	// 		// 	});
	// 		// })
	// 		wavesurferRef.current.addEventListener('mouseleave', () => {
	// 			console.log(window.event.clientX);
	// 			wavesurferObj.clearRegions()
	// 		})m 
	// 		console.log(wavesurferRef.current.getBoundingClientRect());
	// 	}
	// }, [duration, wavesurferObj]);


	// once the file URL is ready, load the file to produce the waveform
	useEffect(() => {
		if (fileURL && wavesurferObj) {
			wavesurferObj.load(fileURL);
		}
		console.log(window);
	}, [fileURL, wavesurferObj, fullscreen]);


	//timing functions
	useEffect(() => {
		if (wavesurferObj) {
			// once the waveform is ready, play the audio
			wavesurferObj.on('ready', () => {
				wavesurferObj.play();
				console.log('ready');
				let sec = wavesurferObj.getDuration()
				setMaxTime(Math.floor(sec / 60) + ':' + Math.floor(sec % 60));
				wavesurferObj.enableDragSelection({}); // to select the r egion to be trimmed
				setDuration(Math.floor(wavesurferObj.getDuration())); // set the duration in local state

			});
			// once audio starts playing, set the state variable to true
			wavesurferObj.on('play', () => {
				setPlaying(true);
			});

			// once audio starts playing, set the state variable to false
			wavesurferObj.on('finish', () => {
				setPlaying(false);
			});

			// if multiple regions are created, then remove all the previous regions so that only 1 is present at any given time
		}
	}, [wavesurferObj]);


	// const handleVolumeSliderShow = useCallback(e => {
	// 	console.log(e.target);
	// 	slider.current.addEventListener('mouseenter', () => {
	// 		sliderWrapper.current.className = AudioCSS.slider_wrapper_visible
	// 	})
	// 	slider.current.addEventListener('mouseleave', () => {
	// 		sliderWrapper.current.className = AudioCSS.slider_wrapper
	// 	})
	// })

	const innerFunc = useCallback(() => {
		if (wavesurferObj) {
			let timer
			let width
			wavesurferObj.on('play', () => {
				timer = setInterval(() => {
					if (wavesurferObj) {
						setCurrentTime(Math.floor(wavesurferObj.getCurrentTime() / 60) + ':' + Math.floor(wavesurferObj.getCurrentTime() % 60))
						width = Math.floor(wavesurferObj.getCurrentTime() / wavesurferObj.getDuration() * 100)
						console.log(fill.current);
						fill.current != null ? fill.current.style.width = width + 1 + '%' : console.log('fullscreen');
						if(window.innerWidth <=1600){
							setFullscreen(true)
						}
						else {
							setFullscreen(false)
						}
					}
				}, 1000);
			});
			wavesurferObj.on('pause', () => {
				clearInterval(timer)
			}) 
		}
	})

	useEffect(() => {
		innerFunc()
	}, [innerFunc]);
	useEffect(() => {
		if (wavesurferObj)
			wavesurferObj.on('seek', (e) => {
				let t = Math.floor(wavesurferObj.getDuration() * e.toFixed(2))
				setCurrentTime(Math.floor(t / 60) + ':' + Math.floor(t % 60))
				console.log('sekked')
				fill.current != null ? fill.current.style.width = e.toFixed(2) * 100 + '%' : console.log('fullscreen');
			})
	})

	// set volume of the wavesurfer object, whenever volume variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.setVolume(volume);
	}, [volume, wavesurferObj]);



	const handleSpeed = () => {
		if (wavesurferObj) {
			setRate(prev => prev + 0.5)
			if (rate < 2) {
				setRate(prev => {
					wavesurferObj.setPlaybackRate(prev)
					return prev
				})
				console.log(rate);
			}
			else {
				setRate(prev => {
					wavesurferObj.setPlaybackRate(1)
					return 1
				})
			}
		}
	}
	const handleInDevelopment = (e) => {
		console.log(e.target);
		e.target.addEventListener('mouseenter', () => {
			inDev.current.className = AudioCSS.in_dev_true
		})
		e.target.addEventListener('mouseleave', () => {
			inDev.current.className = AudioCSS.in_dev_false
		})
		inDev.current.className = AudioCSS.in_dev
	}

	const handleFullscreen = (e) => {
		setFullscreen(prev => !prev)
	}
	return (
		fullscreen ?
			<section className={AudioCSS.waveform_container_fullscreen}>
				<section className={AudioCSS.waveform_wrapper_fullscreen}>
					<div className={AudioCSS.fullscreen_info}>
						<img src={logotype} className={AudioCSS.logotype} />
						<span className={AudioCSS.date}>
							{props.date ? props.date : '5 дней назад'}
						</span>
						<h1 className={AudioCSS.name}>
							{props.name ? props.name : 'Наименование трека'}
						</h1>
						<h1 className={AudioCSS.bpm}>
							{props.info ? props.info : `999 BPM, `}{maxTime}{`,Март 2022`}
						</h1>
						<span className={AudioCSS.hashtag}>
							{props.hashtag ? props.hashtag : '#Музыкадляфитнеса'}
						</span>
					</div>
					<Photo fullscreen={true} />
					<div ref={wavesurferRef} id="waveform" className={AudioCSS.waveform} />
					<div className={AudioCSS.timings}>
						<span className={AudioCSS.currentTime}>
							{currentTime}
						</span>
						<span className={AudioCSS.duration}>
							{maxTime}
						</span>
					</div>
					<div className={AudioCSS.stopButtons}>
						<Skip10sec wavesurferObj={wavesurferObj} direction='backward' />
						<PlayPause wavesurferObj={wavesurferObj} setPlaying={setPlaying} playing={playing} />
						<Skip10sec wavesurferObj={wavesurferObj} direction='forward' />
					</div>
					<div className={AudioCSS.fullscreen}>
						<img src={Fullscreen_minimize} onClick={() => handleFullscreen()}/>
					</div>

				</section>
				<section className={AudioCSS.footer_wrapper}>
					<section className={AudioCSS.warning}>
						<WarningIcon />
						<span>
							<b>Запрещено</b> распространять музыку и выкладывать в соц. сети
						</span>
					</section>
					<section>
						<Volume volume={volume} setVolume={setVolume} />
						<Speed wavesurferObj={wavesurferObj} />
					</section>

					<section>
						<img src={ListPhoto} onClick={handleInDevelopment} />
						<span ref={inDev} className={AudioCSS.in_dev_false}>
							В разработке
						</span>
					</section>
					<section>
						<button className={AudioCSS.telegram}>
							<TelegramIcon />
							<span>
								Отправить в Telegram
							</span>
						</button>
						<button className={AudioCSS.download}>
							<FileDownloadIcon sx={{ color: 'black' }} />
							<span>
								Скачать
							</span>
						</button>
					</section>
				</section>
			</section> :
			<section className={AudioCSS.waveform_container}>
				<Header />
				<div className={AudioCSS.waveform_wrapper}>
					<div className={AudioCSS.waveform_inner_wrapper}>
						<div className={AudioCSS.text}>
							<div className={AudioCSS.first_text}>
								<h1>
									{props.name ? props.name : 'Наименование трека'}
								</h1>
								<h1>
									{props.info ? props.info : `999 BPM, `}{maxTime}{`,Март 2022`}
								</h1>
							</div>
							<div className={AudioCSS.second_text}>
								<span className={AudioCSS.date}>
									{props.date ? props.date : '5 дней назад'}
								</span>
								<span className={AudioCSS.hashtag}>
									{props.hashtag ? props.hashtag : '#Музыкадляфитнеса'}
								</span>
							</div>
						</div>
						<div ref={wavesurferRef} id="waveform" className={AudioCSS.waveform} />
						<div className={AudioCSS.timings}>
							<span className={AudioCSS.currentTime}>
								{currentTime}
							</span>
							<span className={AudioCSS.duration}>
								{maxTime}
							</span>
						</div>
					</div>
					<Photo fullscreen={fullscreen} />
					<Blur />
				</div>
				<div className={AudioCSS.all_controls}>
					<section className={AudioCSS.left_side}>
						<PlayPause wavesurferObj={wavesurferObj} setPlaying={setPlaying} playing={playing} />
						<Skip10sec wavesurferObj={wavesurferObj} direction='backward' />
						<Skip10sec wavesurferObj={wavesurferObj} direction='forward' />

						<div className={AudioCSS.timeline}>
							<span>
								{currentTime}
							</span>
							<div className={AudioCSS.values}>
								<div className={AudioCSS.fill} ref={fill}>

								</div>
							</div>
							<span>
								{maxTime}
							</span>
						</div>
						<Volume volume={volume} setVolume={setVolume} />
						<Speed wavesurferObj={wavesurferObj} />
					</section>
					<section className={AudioCSS.second_side} >
						<div>
							<img src={ListPhoto} onMouseEnter={handleInDevelopment} />
							<span ref={inDev} className={AudioCSS.in_dev_false}>
								В разработке
							</span>
						</div>
						<div>
							<img src={fullScreen} onClick={() => handleFullscreen()} />
						</div>


					</section>
				</div>
			</section>
	);
}
)
export default AudioWaveform;
