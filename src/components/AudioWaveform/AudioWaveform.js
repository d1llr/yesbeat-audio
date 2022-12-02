import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { FileContext } from '../../contexts/fileContext';
import wavesurfer from 'wavesurfer.js';
import Forward10Icon from '@mui/icons-material/Forward10';
import Replay10Icon from '@mui/icons-material/Replay10';
import Photo from '../Photo/Photo';
import Blur from '../Blur/Blur';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import AudioCSS from '../AudioWaveform/AudioWaveform.module.css'
import { Slider } from '@mui/material';


const AudioWaveform = React.memo(() => {
	let props = {}
	const wavesurferRef = useRef(null);
	const fill = useRef(null);

	const slider = useRef(null)
	const sliderWrapper = useRef(null)

	const [rate, setRate] = useState(1)
	const forwardTimeLine = useRef(null);
	const [currentTime, setCurrentTime] = useState()
	const [maxTime, setMaxTime] = useState()
	// fetch file url from the context
	const { fileURL, setFileURL } = useContext(FileContext);

	// crate an instance of the wavesurfer
	const [wavesurferObj, setWavesurferObj] = useState();

	const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
	const [volume, setVolume] = useState(0); // to control volume level of the audio. 0-mute, 1-max
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
					cursorColor: 'violet',
					height: 600,
					loopSelection: true,
					barWidth: 2,
					waveColor: '#7e898e ',
					progressColor: '#dbe0e3',
					hideScrollbar: true,
					responsive: false,
					barMinHeight: 10,
					cursorColor: 'transparent',
					fillParent: true,
					rate: rate,
				})
			)
		}
	}, [wavesurferRef, wavesurferObj]);

	// once the file URL is ready, load the file to produce the waveform
	useEffect(() => {
		if (fileURL && wavesurferObj) {
			wavesurferObj.load(fileURL);
		}
	}, [fileURL, wavesurferObj]);

	//timing functions

	useEffect(() => {
		if (wavesurferObj) {
			// once the waveform is ready, play the audio
			wavesurferObj.on('ready', () => {
				wavesurferObj.play();
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


	useEffect(() => {
		slider.current.addEventListener('mouseenter', () => {
			sliderWrapper.current.className = 'slider-wrapper visible'
		})
		slider.current.addEventListener('mouseleave', () => {
			sliderWrapper.current.className = 'slider-wrapper'
		})
	}, [slider])

	const innerFunc = useCallback(() => {
		if (wavesurferObj) {
			let timer
			let width
			wavesurferObj.on('play', () => {
				timer = setInterval(() => {
					if (wavesurferObj) {
						setCurrentTime(Math.floor(wavesurferObj.getCurrentTime() / 60) + ':' + Math.floor(wavesurferObj.getCurrentTime() % 60))
						width = Math.floor(wavesurferObj.getCurrentTime() / wavesurferObj.getDuration() * 100)
						fill.current.style.width = width + '%'
					}
				}, 200);
			});
			wavesurferObj.on('pause', () => {
				clearInterval(timer)
			})
			wavesurferObj.on('seek', (e) => {
				let t = Math.floor(wavesurferObj.getDuration() * e.toFixed(2))
				setCurrentTime(Math.floor(t / 60) + ':' + Math.floor(t % 60))
				console.log(e.toFixed(2))
				fill.current.style.width = e.toFixed(2) * 100 + '%'
			})
		}
	})

	useEffect(useCallback(() => {
		innerFunc()
	}), [innerFunc]);


	// set volume of the wavesurfer object, whenever volume variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.setVolume(volume);
	}, [volume, wavesurferObj]);

	// set zoom level of the wavesurfer object, whenever the zoom variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.zoom(zoom);
	}, [zoom, wavesurferObj]);

	// when the duration of the audio is available, set the length of the region depending on it, so as to not exceed the total lenght of the audio
	useEffect(() => {
		if (duration && wavesurferObj) {
			// add a region with default length
			wavesurferObj.addRegion({
				start: Math.floor(duration / 2) - Math.floor(duration) / 5, // time in seconds
				end: Math.floor(duration / 2), // time in seconds
				color: 'hsla(215, 100%, 86%, 0.4)', // color of the selected region, light hue of purple
			});
		}
	}, [duration, wavesurferObj]);

	// useEffect(()=>{
	// 	setCurrentTime(()=>wavesurferObj.getCurrentTime())
	// },[wavesurferObj])

	const handlePlayPause = (e) => {
		wavesurferObj.playPause();
		setPlaying(!playing);
	};

	const handleReload = (e) => {
		// stop will return the audio to 0s, then play it again
		wavesurferObj.stop();
		wavesurferObj.play();
		setPlaying(true); // to toggle the play/pause button icon
	};

	const handleVolumeSlider = (e) => {
		setVolume(e.target.value / 100);
	};


	const handleSpeed = () => {
		if (wavesurferObj) {
			setRate(prev => prev + 0.5)
			if (rate < 2) {
				wavesurferObj.setPlaybackRate(rate)
				console.log(rate); 
			}
			else {
				setRate(1)
				wavesurferObj.setPlaybackRate(rate)
			}
		}
	}

	const handleCurrentTime = () => {
		console.log(wavesurferObj.getDuration())
	}

	const handleZoomSlider = (e) => {
		setZoom(e.target.value);
	};



	const handleSkip = (value, e) => {
		if (wavesurferObj) {
			wavesurferObj.skip(value)
			console.log(e.target.className)
		}

	}



	return (
		<section className='waveform-container'>
			<div className='waveform-wrapper'>
				<div className='waveform-inner-wrapper'>
					<div className='text'>
						<div className='first-text'>
							<h1>
								{props.name ? props.name : 'Наименование трека'}
							</h1>
							<h1>
								{props.info ? props.info : `999 BPM, `}{maxTime}{`,Март 2022`}
							</h1>
						</div>
						<div className='second-text'>
							<span className='date'>
								{props.date ? props.date : '5 дней назад'}
							</span>
							<span className='hashtag'>
								{props.hashtag ? props.hashtag : '#Музыкадляфитнеса'}
							</span>
						</div>
					</div>
					<div ref={wavesurferRef} id='waveform' />
					<div className='timings'>
						<span className='currentTime'>
							{currentTime}
						</span>
						<span className='duration'>
							{maxTime}
						</span>
					</div>
				</div>
				<Photo />
				<Blur />
			</div>
			<div className='all-controls'>
				<button
					title='play/pause'
					className='controls'
					onClick={handlePlayPause}>
					{playing ? (
						<i className='material-icons'>pause</i>
					) : (
						<i className='material-icons'>play_arrow</i>
					)}
				</button>
				<div className='10sec'>
					<button onClick={(e) => handleSkip(-10, e)} >
						<i
							className='material-icons'>
							<Replay10Icon />
						</i>
					</button>
					<button onClick={(e) => handleSkip(10, e)} >
						<i
							className='material-icons'>
							<Forward10Icon />
						</i>
					</button>
				</div>

				<div className='timeline'>
					<span>
						{currentTime}
					</span>
					<div className='values'>
						<div className='fill' ref={fill}>

						</div>
					</div>
					<span>
						{maxTime}
					</span>
				</div>

				<div className='volume-slide-container' ref={slider}>
					<VolumeUpIcon sx={{ color: 'white' }} />
					<div className='slider-wrapper' ref={sliderWrapper}>
						<Slider orientation="vertical" aria-label="Volume" defaultvalue={volume} onChange={handleVolumeSlider} />
					</div>

				</div>

				<div className='speed' onClick={handleSpeed}>
					<SpeedIcon sx={{ color: 'white' }} />
					<span>{rate}x</span>
				</div>
			</div>
		</section>
	);
}
)
export default AudioWaveform;
