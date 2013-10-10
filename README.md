# Tweet Migration
> A WebGL visualization of global Twitter activity

## Running

1. Create a `config.json` file as described below, then run the following commands:

2. Install dependencies

	```
	npm install
	```

3. Start the server

	```
	node server.js
	```

## Configuration

A `config.json` must be provided in the root of the project.

### Required configuration parameters

#### `consumer_key` (String)

Your Twitter consumer key.

#### `consumer_secret` (String)

Your Twitter consumer secret.

#### `access_token_secret` (String)

Your Twitter access token secret.

### Optional configuration parameters

#### `debug` (Boolean) = false

Show debug information. Logs every tweet to the console.

#### `port` (Number) = 3000

The port to run the server on. Overridden by the `PORT` environment variable.

### Sample `config.json`

```json
{
	"consumer_key": "fsq4YbjfXuQWJRs01XatGR",
	"consumer_secret": "lzXoLOGzxGYeItJ327BGSLcNmZcmPft62x0tHuZYmad",
	"access_token_key": "35870660-0250Io0UYm5NHG6QgM7bq7h9aChvA30FIBYV0j1q,",
	"access_token_secret": "RFabG3sgMgg9DlwoWRZrQRIizQZultYvo2Ek9C0Xp",
	"debug": false,
	"port": 8080
}
```

## Credits

* Concept, globe, and initial code by [Aysegul Yonet](http://aysegulyonet.com/)
* [Earth textures](http://planetpixelemporium.com/earth.html) by James Hastings-Trew
