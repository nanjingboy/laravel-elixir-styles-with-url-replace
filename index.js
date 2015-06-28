var fs = require('fs'),
    path = require('path'),
    mkdir = require('mkdir-p'),
    elixir = require('laravel-elixir'),
    combine = require('laravel-elixir/ingredients/commands/MergeFiles.js'),
    MergeRequest = require('laravel-elixir/ingredients/commands/MergeRequest');

function mergeRequest(styles, outputDir, baseDir)
{
    var request = new MergeRequest(styles, baseDir, outputDir, 'css');
    request.taskName = 'styles';
    request.minifier = require('laravel-elixir/node_modules/gulp-minify-css');
    return request;
};

function replaceUrl(fileData, fileDirectory, staticRoot)
{
    return fileData.replace(/url\s*\(\s*(['"]?)([^"'\)]*)\1\s*\)/gi, function(match, location) {
        var url,
            urlPath;

        match = match.replace(/\s/g, '');
        url = match.slice(4, -1).replace(/"|'/g, '').replace(/\\/g, '/');
        if (/^\/|https:|http:|data:/i.test(url) === false && fileDirectory.indexOf(staticRoot) > -1) {
            urlPath = path.resolve(fileDirectory + '/' + url);
            if (urlPath.indexOf(staticRoot) > -1) {
                url = urlPath.substr(
                  urlPath.indexOf(staticRoot) + staticRoot.length
                ).replace(/\\/g, '/');
            }
        }

        return 'url("' + url + '")';
    });
}

elixir.extend('styles_with_url_replace', function(styles, outputDir, staticRoot) {
    var tmpDir;

    if (typeof staticRoot === 'undefined') {
        staticRoot = path.join(process.cwd(), 'public');
    } else if (staticRoot.indexOf(process.cwd()) === -1) {
        staticRoot = path.join(process.cwd(), staticRoot);
    }

    outputDir = path.join(staticRoot, outputDir);
    tmpDir = path.join(staticRoot, 'build', 'tmp', outputDir.replace(/\//g, '_'));

    if (!fs.existsSync(tmpDir)) {
        mkdir.sync(tmpDir);
    }

    styles.forEach(function(style) {
        var stylePath = path.join(staticRoot, style);

        fs.writeFileSync(
            path.join(tmpDir, style.replace(/\//g, '_')),
            replaceUrl(
                fs.readFileSync(stylePath).toString(),
                path.dirname(stylePath),
                staticRoot
            )
        );
    });

    return combine(mergeRequest('**/*.css', outputDir, tmpDir));
});
