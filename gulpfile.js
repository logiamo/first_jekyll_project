const {src, dest, watch, series} = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const prefix = require('autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const cp = require('child_process');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');

const messages = { jekyllBuild: '<span stlye = "color: grey"> Running:</span> $ jekyll build'};

// create basic functions
// pug function pug file to html
function html(){
    return src('_pugfiles/*.pug')
        .pipe(pug())
        .pipe(dest('_includes'));
}

function compilesass(){
    return src('assets/css/main.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(postcss([prefix({ overrideBrowserslist: ['last 2 versions, not dead, > 0.2%']}), cssnano()]))
        .pipe(dest('_site/assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(dest('assets/css'));
}



//create jekyll-gulp connector
//run jekyll build command
function build(done){
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll.bat',['build'],{stdio:'inherit'})
        .on('close',done);
}

// Rebuild Jekyll & do page reload when watched files change
function watchjekyll(){
    browserSync.reload();
}

function server_reload(cb){
    series(build,watchjekyll);
    cb();
}

function serve(){
    browserSync.init({
      server: {
        baseDir:'_site',
      },
      watch: true,
      ghostMode: false,
      logFileChanges: true,
      logLevel: 'info',
      open:true
    });
    //watch('**/*', server_reload);
    watch('assets/css/**', compilesass);
    watch('assets/js/**', watchjekyll)
    watch('_pugfiles/*.pug', html);
    watch(['index.html', '_layouts/*.html', '_includes/*'], watchjekyll);
}



exports.default = series(build,serve);