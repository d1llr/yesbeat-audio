import React from 'react';
import logotype from './logo.png'
import WarningIcon from '@mui/icons-material/Warning';
import TelegramIcon from '@mui/icons-material/Telegram';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HeaderCSS from './Header.module.scss'



const Header = () => {
	return (
		<header>
			<div className={HeaderCSS.first}>
				<div className={HeaderCSS.brand}>
					<img src={logotype} />
				</div>
				<div className={HeaderCSS.warning}>
					<WarningIcon />
					<span>
						<b>Запрещено</b> распространять музыку и выкладывать в соц. сети
					</span>
				</div>
			</div>
			<div className={HeaderCSS.second}>
				<button className={HeaderCSS.telegram}>
					<TelegramIcon/>
					<span>
						Отправить в Telegram
					</span>
				</button>
				<button className={HeaderCSS.download}>
					<FileDownloadIcon sx={{ color: 'black' }}/>
					<span>
						Скачать
					</span>
				</button>
			</div>

		</header>
	);
};

export default Header;
