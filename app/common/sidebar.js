import React, { Component } from 'react';

class Sidebar extends Component{
	constructor(props){
		super(props)
	}

	renderArticles(){
		const { articles, pathname } = this.props;
		const [ base, id ] = pathname.split('/').slice(1);

		const isArticle = (base == 'article');

		return articles.map(article =>
			<li key={`nav-${article.slug}`}>
				<a className={(isArticle && id == article.slug) ? 'active' : ''} href={`/article/${article.slug}`}>{article.title}</a>
			</li>
		);
	}

	render(){
		return (
			<div className="sidebar">
				<nav>
					<ul>{this.renderArticles()}</ul>
				</nav>
				<a className="more" onClick={this.props.next}>Load More Articles</a>
			</div>
		);
	}
}

export default Sidebar;
