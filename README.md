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

* Concept, globe, and initial code by [Aysegul Yonet]
* Heatmap and streaming server by [Larry Davis]
* [Earth textures] by James Hastings-Trew

[Larry Davis]: http://github.com/lazd
[Aysegul Yonet]: hhttp://github.com/yonet
[Earth textures]: http://planetpixelemporium.com/earth.html


## Technology

* [three.js]: 3D library
* [Socket.IO]: Client and server for WebSockets
* [webgl-heatmap]: Heatmap drawn with WebGL shaders
* [Node.js]: Server
* [node-twitter]: Twitter library for Node.js
* [HTML & CSS]: Menuing

[three.js]: https://github.com/mrdoob/three.js/
[Socket.IO]: http://socket.io/
[webgl-heatmap]: https://github.com/pyalot/webgl-heatmap
[Node.js]: http://nodejs.org/
[node-twitter]: https://github.com/desmondmorris/node-twitter
[HTML & CSS]: https://developer.mozilla.org/en-US/


# License

[BSD license], Copyright &copy; 2013 Aysegul Yonet

[BSD license]: https://github.com/lazd/TweetMigration/blob/master/LICENSE