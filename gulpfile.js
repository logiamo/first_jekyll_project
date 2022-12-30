const {src, dest, watch, series} = require('gulp');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const prefix = require('autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const cp = require('child_process');
const postcss = require('gulp-postcss');


const messages = { jekyllBuild: '<span stlye = "color: grey"> Running:</span> $ jekyll build'};

// create basic functions
// pug function pug file to html
function html(){
    return src('_pugfiles/*.pug')
        .pipe(pug())
        .pipe(dest('_includes'));
        //.pipe(browserSync.reload({stream:true}));
}

exports.html = html;

function compilesass(){
    return src('assets/css/main.scss')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(postcss([prefix({ overrideBrowserslist: ['last 2 versions, not dead, > 0.2%']})]))
        .pipe(dest('_site/assets/css'))
        .pipe(browserSync.stream());
        //.pipe(dest('assets/css'));
}

function returnsass(){
    return src('assets/css/main.scss')
    .pipe(sass())
    .pipe(dest('assets/css'));
}

exports.returnsass = returnsass;

//create jekyll-gulp connector
//run jekyll build command
function build(done){
    returnsass()
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll.bat',['build'],{stdio:'inherit'})
        .on('close',done);
}

// Rebuild Jekyll & do page reload when watched files change
function watchjekyll(cb){
    browserSync.reload();
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
    watch('assets/img/**', watchjekyll);
    watch('assets/js/**', watchjekyll);
    watch('_pugfiles/*.pug', html);
    watch(['index.html','_layouts/*.html', '_includes/*'], series(build,watchjekyll));
}



exports.default = series(returnsass,compilesass, html, build, serve);