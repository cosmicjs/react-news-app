import React, { Component } from 'react';

import renderHTML from 'react-render-html';
import moment from 'moment';

import Loader from '../common/loader';

class Home extends Component{
	constructor(props){
		super(props);
	}

	renderRemainingTiles(articles = []){
		return articles.map(article => (
			<div key={`home-${article.slug}`} className="tile">
				<a href={`/article/${article.slug}`}></a>
				<div className="thumb" style={{backgroundImage: `url(${article.thumbnail.url})`}}></div>
				<div className="content">
					<h3>{article.title}</h3>
					<span className="author">By {article.author}</span> | {moment(article.created).format('L')}
				</div>
			</div>
		))
	}

	renderFirstTile(article){
		const thumbStyle = { backgroundImage: `url(${article.thumbnail.url})` };

		return(
			<div className="tile large">
				<a href={`/article/${article.slug}`}></a>
				<div className="thumb" style={thumbStyle}></div>
				<h3>{article.title}</h3>
				<p>{renderHTML(article.preview)}</p>
				<span className="author">By {article.author}</span>
			</div>
		)
	}

	render(){
		const { articles, next, appTitle } = this.props;
		if (!articles) return <Loader />;

		document.title = `Home | ${appTitle}`;
		const remaining = articles.slice(0);
		const first = remaining.shift(); // get the first article

		return <div className="tiles">
			{this.renderFirstTile(first)}
			{this.renderRemainingTiles(remaining)}
			<hr />
			<a className="more" onClick={next}>Load More Articles</a>
		</div>;
	}
}

export default Home;
