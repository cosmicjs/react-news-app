const path = require('path');
const express = require('express');

const { articles, pages } = require('./data');
const index = path.resolve('./build/index.html');

const app = express();

app
	.set('port', process.env.PORT || 3000)
	.use(express.static('build'))
	.use(express.static('static'))

	.get(['/', '/article/:id', '/page/:id'], (req, res) => res.sendFile(index))
	// data specific endpoints
	.get('/data/article/:id', articles.get)
	.get('/data/articles/:offset', articles.list)
	.get('/data/page/:id', pages.get)
	.get('/data/pages', pages.list)
	.use((req, res) => res.redirect('/')) // redirect all non matches to root
	.listen(app.get('port'), () =>
		console.info('==> 🌎Go to http://localhost:%s', app.get('port')));
