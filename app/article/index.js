import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import moment from 'moment';

import request from '../request';
import Loader from '../common/loader';

const SHOW_MODIFIED = true;

class Article extends Component{
	constructor(props){
		super(props)
		this.state = { article: null, error: null};
	}

	componentDidMount(){
		const { articleId, appTitle } = this.props;
		const self = this;

		document.title = `Loading article... | ${appTitle}`;

		// fetch the article from the server
		request({ path: `/data/article/${articleId}` }, article => {
			if (article.e){
				document.title = `Error | ${appTitle}`;
				self.setState({ error: true })
			} else {
				document.title = `${article.title} | ${appTitle}`;
				self.setState({ article, error: null });
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
		const { article, error } = this.state;
		if (error) return this.renderError();
		if (!article) return <Loader message="Loading article" />;

		const created = moment(article.created_at).format('LL');
		const modifed = moment(article.modifed_at).format('LL');

		const metadata = article.metadata || {};
		const author = metadata.author ||  'Anonymous';
		const pic = metadata.profile_picture || { url: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' }; // blank gif if not present

		return (
			<article>
				<header>
					<time className="created" dateTime={article.created_at}><i>Created On</i> {created}</time>
					{ SHOW_MODIFIED ? <time className="updated" dateTime={article.modified_at}><i>Last Modifed</i> {modifed}</time> : '' }
					<h2>{article.title}</h2>
					<div className="author">
						<div className="profile-pic"><img src={pic.url} /></div>
						<span>By <b>{author}</b></span>
					</div>
				</header>
				<hr />
				{renderHTML(article.content)}
			</article>
		)
	}
}

export default Article;
