var derby = require('derby')
  , app = derby.createApp(module)
  , get = app.get
  , view = app.view
  , ready = app.ready
  , start = +new Date()
derby.use(require('../../ui'))

// ROUTES //
get('/', function(page, model, params) {
  model.subscribe('movies', function(err, movie) {
    model.ref('_movies', movie)

	movie.setNull('list', [
		{ id: 'http://api.netflix.com/catalog/titles/movies/70252784',
		  title: { regular: '1313: Frankenqueen', short: '1313: Frankenqueen' },
		  release_year: '2012',
		  average_rating: '1.6',
		  updated: '1346954119',
		  box_art: { '197': 'http://cdn-0.nflximg.com/images/9869/1649869.jpg' },
		  instant: 
		   { runtime: '4610',
		     available_from: '1346742000',
		     available_until: '4102444800' },
		 },

		{ id: 'http://api.netflix.com/catalog/titles/movies/70243514',
		  title: 
		   { regular: '1313: Hercules Unbound',
		     short: '1313: Hercules Unbound' },
		  release_year: '2012',
		  average_rating: '1.5',
		  updated: '1342553256',
		  box_art: { '197': 'http://cdn-0.nflximg.com/images/9774/1329774.jpg' },
		  instant: 
		   { runtime: '4340',
		     available_from: '1341298800',
		     available_until: '4102444800' },
		 }
	])

    page.render({});
  })
})

// CONTROLLER FUNCTIONS //
ready(function(model) {
})
