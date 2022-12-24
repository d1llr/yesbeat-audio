import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import wavesurfer from 'wavesurfer.js';
import { json, useParams } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import Photo from '../Photo/Photo';
import Blur from '../Blur/Blur';
import Volume from './Buttons/Volume/Volume';
import AudioCSS from '../AudioWaveform/AudioWaveform.module.scss'
import ListPhoto from '../../imgs/list.png'
import fullScreenPhoto from '../../imgs/fullscreen.png'
import PlayPause from './Buttons/PlayPause';
import Skip10sec from './Buttons/Skip10sec';
import Speed from './Buttons/Speed';
import Header from '../Header/Header';
import Timings from './TimerComponent/Timings';
import FullScreen from './FullScreenMode/FullScreen';
const AudioWaveform = React.memo(() => {
	let props = {}
	const src = "https://s3.eu-central-1.amazonaws.com/some-sprouts/Mindcrush.mp3";
	const wavesurferRef = useRef(null);
	const fill = useRef(null);
	const inDev = useRef(null)
	const [pageLoad, setPageLoad] = useState(true)
	const [rate, setRate] = useState(1)
	const [currentTime, setCurrentTime] = useState()
	const [maxTime, setMaxTime] = useState()
	const [fullScreen, setfullScreen] = useState(() => {
		if (window.innerWidth < 1500) {
			return true
		}
		else {
			return false
		}
	})
	const MyLoaderRef = useRef(null)
	const [machine, setMachine] = useState(true)
	const [wavesurferObj, setWavesurferObj] = useState();
	const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
	const [volume, setVolume] = useState(0.1); // to control volume level of the audio. 0-mute, 1-max
	const [currentProgress, setCurrentProgress] = useState(0)
	// create the waveform inside the correct component

	const params = useParams()
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		if (wavesurferRef.current && !wavesurferObj) {
			setPageLoad(true)
			setWavesurferObj(
				wavesurfer.create({
					container: wavesurferRef.current,
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
			console.log('Создано');
		}
		// if (window.innerWidth <= 1700) {
		// 	setfullScreen(true)
		// }
	}, [wavesurferRef, wavesurferObj]);

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
		if (wavesurferObj) {
			console.log(searchParams.get('name'));
			searchParams.get('name') ? 
				fetch(`https://test.yesbeat.ru/player_file.php?&data=${searchParams.get('name')}`)
				  .then(res => res.json())
				  .then(
					(result) => {
						console.log(JSON.parse(result));
					}
				  )
				:
			console.log('Нет');
			wavesurferObj.load(src);
		}
	}, [wavesurferObj]);


	//timing functions
	useEffect(() => {
		if (wavesurferObj) {
			// once the waveform is ready, play the audio
			wavesurferObj.on('ready', () => {
				setTimeout(() => {
					setPageLoad(false)
					wavesurferObj.play();
					wavesurferObj.seekTo(currentProgress)
					console.log('ready');
					let sec = wavesurferObj.getDuration()
					setMaxTime(Math.floor(sec / 60) + ':' + Math.floor(sec % 60));
					// wavesurferObj.enableDragSelection({}); // to select the r egion to be trimmed
				}, 500);

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

	const innerFunc = () => {
		if (wavesurferObj) {
			let timer
			let width
			wavesurferObj.on('play', () => {
				if (wavesurferObj)
					timer = setInterval(() => {
						setCurrentTime(Math.floor(wavesurferObj.getCurrentTime() / 60) + ':' + Math.floor(wavesurferObj.getCurrentTime() % 60))
						width = Math.floor(wavesurferObj.getCurrentTime() / wavesurferObj.getDuration() * 100)
						fill.current != null ? fill.current.style.width = width + 1 + '%' : console.log('fullScreen');
						console.log('Работа setInterval`a');
					}, 1000);
			});
			wavesurferObj.on('pause', () => {
				clearInterval(timer)
			})
		}
	}

	useEffect(() => {
		innerFunc()
		console.log('Вызов innerfunc');
	}, [wavesurferObj]);
	useEffect(() => {
		if (wavesurferObj)
			wavesurferObj.on('seek', (e) => {
				let t = Math.floor(wavesurferObj.getDuration() * e.toFixed(2))
				setCurrentTime(Math.floor(t / 60) + ':' + Math.floor(t % 60))
				console.log('sekked')
				fill.current != null ? fill.current.style.width = e.toFixed(2) * 100 + '%' : console.log('fullScreen');
			})
	}, [wavesurferObj])

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
	const handlefullScreen = (e) => {
		setfullScreen(e)
		setMachine(false)
		if (wavesurferObj) {
			setCurrentProgress(wavesurferObj.getCurrentTime() / wavesurferObj.getDuration())
			console.log(`${wavesurferObj.getDuration()} - длительность трека`);
			console.log(`${wavesurferObj.getCurrentTime()} - текущее время`);
			console.log(`${currentProgress * 100} - результат деления`);
		}
		wavesurferObj.pause()
		wavesurferObj.destroy()
		setWavesurferObj(null)
		console.log('handlefullScreen');
	}
	// const machinefullScreen = (e) => {
	// 	setfullScreen(e)
	// 	setCurrentProgress(wavesurferObj.getCurrentTime() / wavesurferObj.getDuration())
	// 	console.log(`${wavesurferObj.getDuration()} - длительность трека`);
	// 	console.log(`${wavesurferObj.getCurrentTime()} - текущее время`);
	// 	console.log(`${currentProgress * 100} - результат деления`);
	// 	wavesurferObj.pause()
	// 	wavesurferObj.destroy()
	// 	setWavesurferObj(null)
	// 	console.log('machinefullScreen');
	// }
	return (
		fullScreen ?
			<FullScreen
				wavesurferObj={wavesurferObj}
				setWavesurferObj={setWavesurferObj}
				rate={rate}
				currentTime={currentTime}
				maxTime={maxTime}
				playing={playing}
				setPlaying={setPlaying}
				handlefullScreen={handlefullScreen}
				volume={volume}
				setVolume={setVolume}
				handleInDevelopment={handleInDevelopment}
				inDev={inDev}
				pageLoad = {pageLoad}
				setPageLoad = {setPageLoad}
				src={src}
				machine={machine}
			/>
			:
			<section className={AudioCSS.waveform_container}>
				<div className={pageLoad ? AudioCSS.loader : AudioCSS.loader_invisible}></div>
				<Header src={src} />
				<div className={AudioCSS.waveform_wrapper}>
					<div className={AudioCSS.waveform_inner_wrapper}>
						<div className={AudioCSS.text}>
							<div className={AudioCSS.first_text}>
								<h1>
									{props.name ? props.name : 'Наименование трека'}
								</h1>
								<h2>
									{props.info ? props.info : `999 BPM, `}{maxTime}{`,Март 2022`}
								</h2>
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
						{/* <Waveform
							/> */}
						<div>
							<div ref={wavesurferRef} id="waveform" className={AudioCSS.waveform} />
							<Timings currentTime={currentTime} maxTime={maxTime} className={AudioCSS} />
						</div>

					</div>
					<Photo fullScreen={fullScreen} />
					<Blur />
				</div>
				<div className={AudioCSS.all_controls}>
					<div className={AudioCSS.left_side}>
						<PlayPause wavesurferObj={wavesurferObj} setPlaying={setPlaying} playing={playing} />
						<Skip10sec wavesurferObj={wavesurferObj} direction='backward' />
						<Skip10sec wavesurferObj={wavesurferObj} direction='forward' />
						<section className={AudioCSS.timeline}>
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
						</section>
						<Volume volume={volume} setVolume={setVolume} />
						<Speed wavesurferObj={wavesurferObj} className={AudioCSS.speed} />
					</div>
					<div className={AudioCSS.second_side} >
						<div>
							<img src={ListPhoto} onMouseEnter={handleInDevelopment} />
							<span ref={inDev} className={AudioCSS.in_dev_false}>
								В разработке
							</span>
						</div>
						<div>
							<img src={fullScreenPhoto} onClick={() => handlefullScreen(true)} />
						</div>


					</div>
				</div>
			</section>
	);
}
)
export default AudioWaveform;
