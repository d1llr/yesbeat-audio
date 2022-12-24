import React, { memo } from 'react';
import logotype from './logo.png'
import warningIcon from '../../imgs/warning.png'
import TelegramIcon from '../../imgs/telegram.png';
import downloadIcon from '../../imgs/download.png';
import HeaderCSS from './Header.module.scss'
import Warning from './Components/Warning';
import Download from './Components/Download';
import Telegram from './Components/Telegram';
import Logotype from './Components/Logotype';
export default memo(function Header(props) {
	return (
		<header>
			<div className={HeaderCSS.first}>
				<Logotype/>
				<Warning className = {HeaderCSS.warning}/>
			</div>
			<div className={HeaderCSS.second}>
				<Telegram className = {HeaderCSS.telegram}/>
				<Download src = {props.src} className = {HeaderCSS.download}/>
			</div>

		</header>
	);
})