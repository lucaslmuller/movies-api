# To Start

In order to start the API, execute the command bellow:

```sh
npm start
```

The API will be running on `http://localhost:3000`

# To Test

In order to run the integration tests, execute the command bellow:

```sh
npm test
```

# Documentation

There's a file called `movies.postman_collection.json`, that's a Postman collection, you can import it and verify every possible request and their responses.

# Input File

The input file is in `src/data/Movielist.csv`, to test using different data, update the file contents, or update the file path at `.env/test.env.json`

# Main API

The main API endpoint is `http://localhost:3000/movies/stats`
