var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var jsmin = require('gulp-jsmin');
var csso = require('gulp-csso');
var exec = require('child_process').exec;

var root = "./public";
var buildDir = root;
var datas = {
	html: [root + "/**/*.html"],
	js: [root + "/**/*.js","!" + root + "/**/*.min.js"],
	css: [root + "/**/*.css"],
}

gulp.task("htmlmin", ["build"], function() {
	return gulp.src(datas.html)
	.pipe(htmlmin({collapseWhitespace:true,minifyJS:true,minifyCSS:true,removeComments:true}))
	.pipe(gulp.dest(buildDir));
});

gulp.task("jsmin", ["build"],function(){
	return gulp.src(datas.js)
	.pipe(jsmin())
	.pipe(gulp.dest(buildDir));
});

// css压缩
gulp.task("cssmin", ["build"],function(){
	return gulp.src(datas.css)
	.pipe(csso())
	.pipe(gulp.dest(buildDir));
});

gulp.task("clean", function(cb) {
	exec("hexo clean", function(err) {
		if (err) return cb(err);
		cb();
	});
})

gulp.task("build", ["clean"], function(cb) {
	exec("hexo g", function(err) {
		if (err) return cb(err);
		cb();
	});
});

gulp.task("release", ["build","htmlmin","jsmin","cssmin"],function(cb) {
	exec("hexo d", function(err) {
		if (err) return cb(err);
		cb();
	});
});

gulp.task('minify', ["htmlmin","jsmin","cssmin"]);

gulp.task("default",["minify"]);
gulp.task("release",["build"]);
