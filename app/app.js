
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import request from './request';
import moment from 'moment';

import Home from './home';
import Article from './article';
import Page from './page';

import Header from './common/header';
import Sidebar from './common/sidebar';
import Loader from './common/loader';

import './styles/base.less';

const TITLE = document.title; // get title from config/html title

class App extends Component{
	constructor(props){
		super(props);
		let pathname = window.location.pathname;

		const currentPage = window.localStorage.getItem('currentPage') || 0;
		this.state = { articles: [], pathname, currentPage};

		this.next = () => this.nextPage();
		this.clearCache = () => this.clearStorage();
	}

	componentDidMount(){
		// check how old the cache is, and clear ie before fetching if it's old
		let preserveCache = window.localStorage.getItem('lastCached') || false;
		if (preserveCache){
			// compare to cache to see how old it is
			preserveCache = moment(preserveCache);
			const now = moment();
			const diff = now.diff(preserveCache);

			preserveCache = !((diff / (1000 * 60)) > 5);
			console.log('isPreserved', preserveCache);
		}
		if (!preserveCache) window.localStorage.setItem('lastCached', moment().format());

		this.getList('articles', undefined, preserveCache); // get a listing of articles and basic metadata
		this.getList('pages', null, preserveCache); // get a listing of articles and basic metadata
	}

	clearStorage(){
		// clear localStorage of articles for next refresh
		window.localStorage.setItem('lastCached', '');
		window.localStorage.setItem('currentPage', '');
		window.localStorage.setItem('articles', '');
		window.localStorage.setItem('pages', '');
	}

	updateListState(name = 'articles', items, skipConcat = false){
		switch(name){
			case 'articles':
				let articles = (skipConcat) ? items : this.state.articles.concat(items);
				this.setState({ articles })
				window.localStorage.setItem(name, JSON.stringify(articles));
				break;
			case 'pages':
				this.setState({ pages: items });
				window.localStorage.setItem(name, JSON.stringify(items));
				break;
		}
	}

	fetchList(name = 'articles', page = 0){
		const self = this;
		// fetch and update the cache
		request({ path: `/data/${name}/${ page !== null ? page : ''}` }, items => {
			if (!Array.isArray(items)){
				console.error('could not fetch articles from CosmicJS');
				return
			}
			// setting cache
			this.updateListState(name, items);
		});
	}

	getList(name = 'articles', page, preserveCache = true){
		let cache = window.localStorage.getItem(name);
		// let cachePage = window.localStorage.getItem('currentPage');

		if (preserveCache && cache){
			console.log('getting from cache...');
			// attempt to parse from cache
			let items = null;
			try{
				items = JSON.parse(cache);
			} catch(e){ console.warn('cannot read cache', e)}

			if (items && items.length > 0) {
				// set from parsed metadata (skip adding)
				this.updateListState(name, items, true);
			} else {
				this.fetchList(name, page); // fetch from remote
			}
		} else {
			this.fetchList(name, page);
		}
	}

	nextPage(){
		let { currentPage } = this.state;
		this.fetchList('articles', ++currentPage);
		window.localStorage.setItem('currentPage', currentPage);
		this.setState({ currentPage })
	}

	route(){
		const { pathname, articles } = this.state;
		const [ base, id ] = pathname.split('/').slice(1);

		if (articles.length > 0){
			switch (base){
				case '': // home route
					return <Home appTitle={TITLE} articles={articles} next={this.next}/>; break;
				case 'article': // article route
					return <Article appTitle={TITLE} articleId={id} />; break
				case 'page': // page route
					return <Page appTitle={TITLE} pageId={id} />; break
			}
		}

		return <Loader msg="Loading articles..." />;
	}

	render(){
		const { articles, pages, pathname } = this.state;
		return (
			<div className="app-container">
				<Header title={TITLE} pathname={pathname} pages={pages} clearCache={this.clearCache} />
				<Sidebar articles={articles} pathname={pathname} next={this.next} />
				<main>{ this.route() }</main>
			</div>
		);
	}
}

const AppContainer = document.getElementById('app');

if (AppContainer) {
	ReactDOM.render(<App />, AppContainer);
} else {
	console.error('There is no active element');
}
