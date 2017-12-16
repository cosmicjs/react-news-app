import React, { Component } from 'react';
import renderHTML from 'react-render-html';

import request from '../request';
import Loader from '../common/loader';

const SHOW_MODIFIED = true;

class Article extends Component{
	constructor(props){
		super(props)
		this.state = { page: null, error: null};
	}

	componentDidMount(){
		const { pageId, appTitle } = this.props;
		const self = this;

		// fetch the article from the server
		request({ path: `/data/page/${pageId}` }, page => {
			if (page.e){
				document.title = `Error | ${appTitle}`;
				self.setState({ error: true })
			} else {
				document.title = `${page.title} | ${appTitle}`;
				self.setState({ page, error: null });
			}
		});
	}

	renderError(){
		return (
			<div class="error-message">
				<h1>404</h1>
				<h3>This article does not exist</h3>
			</div>
		)
	}

	render(){
		const { page, error } = this.state;
		if (error) return this.renderError();
		if (!page) return <Loader message="Loading page" />;

		return (
			<section className={`page page-${page.slug}`}>
				<header>
					<h2>{page.title}</h2>
				</header>
				<hr />
				{renderHTML(page.content)}
			</section>
		)
	}
}

export default Article;
