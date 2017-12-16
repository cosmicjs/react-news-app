module.exports = {
    cosmicjs: {
        bucket: {
            slug: process.env.COSMIC_BUCKET || 'cosmic-news-app',
            read_key: process.env.COSMIC_READ_KEY,
            write_key: process.env.COSMIC_WRITE_KEY
        }
    },
	title: 'Cosmic JS News App',
	articlePageSize: 6
}
