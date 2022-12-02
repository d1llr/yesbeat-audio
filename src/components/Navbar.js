import React from 'react';
import logo from './logo.jpg'
import WarningIcon from '@mui/icons-material/Warning';
import TelegramIcon from '@mui/icons-material/Telegram';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Navbar = () => {
	return (
		<nav>
			<div className='first'>
				<div className='brand'>
					<img src={logo} />
				</div>
				<div className='warning'>
					<WarningIcon />
					<span>
						<b>Запрещено</b> распространять музыку и выкладывать в соц. сети
					</span>
				</div>
			</div>
			<div className='second'>
				<button className='telegram'>
					<TelegramIcon/>
					<span>
						Отправить в Telegram
					</span>
				</button>
				<button className='download'>
					<FileDownloadIcon sx={{ color: 'black' }}/>
					<span>
						Скачать
					</span>
				</button>
			</div>

		</nav>
	);
};

export default Navbar;
