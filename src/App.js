import React from 'react';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import EditPage from './pages/EditPage';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<EditPage />} exact />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
