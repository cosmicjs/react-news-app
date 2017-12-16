
const config = require('./config');
const cosmicjs = require('cosmicjs');
const striptags = require('striptags');

const makePreview = string => striptags(string.replace(/<br>/g, ' ')).substring(0, 96) + '...';

function endpoint(type_slug, { listReducer, listSize }){
	if (!listSize) listSize = null;

	return {
		get: function(request, response){
			const slug = request.params.id;
			cosmicjs.getObject(config.cosmicjs, { type_slug, slug }, (e, data = {}) => {
				response.json(e ? {e} : data.object);
			});
		},
		list: (request, response) => {
			const page = request.params.offset || 0;

			const params = {
				type_slug,
				sort: 'created'
			}

			if (listSize && listSize > 0){
				params.limit = listSize;
				params.skip = listSize * page;
			}

			cosmicjs.getObjectsByType(config.cosmicjs, params, (e, data) => {
				const items = data.objects.all || [];
				response.json(items.map(listReducer));
			});
		}
	}
}

const articleList = article => {
	const { slug, created, content, title, metadata } = article;

	return {
		slug,
		created,
		title,
		author: metadata.author,
		thumbnail: metadata.thumbnail,
		preview: makePreview(article.content)
	}
}

const pageList = page => {
	const { slug, title } = page;
	return {
		slug,
		title
	}
}

module.exports = {
	articles: endpoint('articles', {
		listReducer: articleList,
		listSize: config.articlePageSize || 10
	}),
	pages: endpoint('pages', {
		listReducer: pageList,
		listSize: null // infinite
	})
}
