var conf = require('config');
var urlParse = require('url-parse');
conf.originParsed = new urlParse(conf.origin);
conf.originParsed.protocol = conf.originParsed.protocol.replace(':','');
if(!conf.originParsed.port){
	conf.originParsed.port = (conf.originParsed.protocol=='https' ? 443 : 80);
}
conf.px2server.originParsed = new urlParse(conf.px2server.origin);
conf.px2server.originParsed.protocol = conf.px2server.originParsed.protocol.replace(':','');
if(!conf.px2server.originParsed.port){
	conf.px2server.originParsed.port = (conf.originParsed.protocol=='https' ? 443 : 80);
}
console.log(conf);

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var twig = require("gulp-twig");//Twigテンプレートエンジン
var ejs = require("gulp-ejs");//EJSテンプレートエンジン
var browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'.html',
	'.html.twig',
	'.html.ejs',
	'.css',
	'.css.scss',
	'.js',
	'copy',
	'replace-package-dist'
];


// broccoli-client (frontend) , bootstrap などを処理
gulp.task("replace-package-dist", function() {
});

// コピーするだけのファイルを処理
gulp.task('copy', function(){
	gulp.src(["src/**/*.svg","src/**/*.png","src/**/*.jpg","src/**/*.gif","!src/**/*.ignore*","!src/**/*.ignore*/*"])
		.pipe(gulp.dest( './dist/' ))
	;
});

// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	gulp.src(["src/**/*.css.scss","!src/**/*.ignore*","!src/**/*.ignore*/*"])
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest( './dist/' ))
	;
});

// src 中の *.css を処理
gulp.task('.css', function(){
	gulp.src(["src/**/*.css","!src/**/*.ignore*","!src/**/*.ignore*/*"])
		.pipe(plumber())
		.pipe(gulp.dest( './dist/' ))
	;
});

// *.js を処理
gulp.task(".js", function() {
	gulp.src(["src/**/*.js","!src/**/*.html.js","!src/**/*.ignore*","!src/**/*.ignore*/*"])
		.pipe(plumber())
		.pipe(browserify({
		}))
		// .pipe(uglify())
		.pipe(gulp.dest( './dist/' ))
	;
});

// *.html を処理
gulp.task(".html", function() {
	gulp.src(["src/**/*.html", "src/**/*.htm","!src/**/*.html.js","!src/**/*.ignore*","!src/**/*.ignore*/*"])
		.pipe(plumber())
		.pipe(gulp.dest( './dist/' ))
	;
});

// *.html.twig を処理
gulp.task(".html.twig", function() {
	gulp.src(["src/**/*.html.twig","!src/**/*.ignore*","!src/**/*.ignore*/*"])
		.pipe(plumber())
		.pipe(twig({
			data: {
				packageJson: packageJson,
				conf: conf
			}
		}))
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest( './dist/' ))
	;
});

// *.html.ejs を処理
gulp.task(".html.ejs", function() {
	gulp.src(["src/**/*.html.ejs","!src/**/*.ignore*","!src/**/*.ignore*/*"])
		.pipe(plumber())
		.pipe(ejs({
			packageJson: packageJson,
			conf: conf
		}))
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest( './dist/' ))
	;
});


// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*"], _tasks);
});

// 標準ブラウザを立ち上げてプレビューする
gulp.task("preview", function() {
	require('child_process').spawn('node', ['./libs/main.js']);
	require('child_process').exec('open '+conf.origin+'/');
});


// 開発モードをスタートする
gulp.task("dev", ['preview', 'watch']);

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
