# laravel-elixir-styles-with-url-replace

An extension for laravel elixir styles task to replace relative url path with absolute path.

# Install:

```shell
$ npm install laravel-elixir-styles-with-url-replace --save-dev
```

# Params:

### styles
Type: `Array`

### outputDir
Type: `String`

The value must relative with your static root path

### staticRoot
Type: `String`
Default value: `public`

## Example:

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-styles-with-url-replace');

elixir(function(mix) {
    mix.styles_with_url_replace([
      'styles/application.css',
      'styles/home.css'
    ], 'build/application.css', 'public');
});
```

# License:

MIT