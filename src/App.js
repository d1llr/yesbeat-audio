import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EditPage from './pages/EditPage';
import Header from './components/Header/Header';

const App = () => {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path='/' component={HomePage} exact />
				<Route path='/edit' component={EditPage} exact />
			</Switch>
		</Router>
	);
};

export default App;
