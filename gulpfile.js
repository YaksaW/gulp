const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const browserSync = require("browser-sync").create();
// 路径常量定义
const basePath = {
    src: {
        base: "./src/",
        less:"./src/less/**/*.less",
        css: "./src/css/**/*.css",
        js: "./src/js/**/*.js",
        html: "./src/**/*.html",
        img: "./src/imgs/**/*"
    },
    dist: {
        base: "./dist/",
        css: "css/",
        js: "js/",
        img: "imgs/",
        html: ""
    }
}
// 整合文件名定义
const fileName = {
    css: "all.css",
    js: "all.js",
    less:"less.css",
}
// css文件操作
gulp.task("css", function () {
    gulp.src(basePath.src.css)
        .pipe($.concat(fileName.css))
        .pipe($.autoprefixer({
            browsers: ['last 20 versions'],
        }))
        .pipe(gulp.dest(basePath.dist.base + basePath.dist.css))
        .pipe($.cssmin())
        .pipe($.rename(function (path) {
            path.basename += ".min"
        }))
        .pipe(gulp.dest(basePath.dist.base + basePath.dist.css));
       
})
// less操作
gulp.task("less",function(){
    gulp.src(basePath.src.less)
    .pipe($.less())
    .pipe($.autoprefixer({
        browsers:['last 20 versions'],
        cascade:true
    }))
    .pipe($.concat(fileName.less))
    .pipe(gulp.dest(basePath.dist.base+basePath.dist.css))
    .pipe($.cssmin())
    .pipe($.rename(function(path){
        path.basename+=".min";
    }))
    .pipe(gulp.dest(basePath.dist.base+basePath.dist.css))
})
// js文件操作
gulp.task("js", function () {
    gulp.src(basePath.src.js)
        .pipe($.concat(fileName.js))
        .pipe($.babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest(basePath.dist.base + basePath.dist.js))
        .pipe($.uglify())
        .pipe($.rename(function (path) {
            path.basename += ".min"
        }))
        .pipe(gulp.dest(basePath.dist.base + basePath.dist.js))
})
// html文件操作
gulp.task("html", function () {
    gulp.src(basePath.src.html)
        .pipe($.htmlReplace({
            css: basePath.dist.css + fileName.css,
            js: basePath.dist.js + fileName.js,
            less:basePath.dist.css + fileName.less,
        }))
        .pipe(gulp.dest(basePath.dist.base))
        .pipe($.htmlmin({
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            removeComments: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeAttributeQuotes: false
        }))
        .pipe($.rename(function (path) {
            path.basename += ".min"
        }))
        .pipe(gulp.dest(basePath.dist.base))
})
// 图片压缩
gulp.task("image", function () {
    gulp.src(basePath.src.img)
        .pipe($.imagemin())
        .pipe(gulp.dest(basePath.dist.base + basePath.dist.img))
})
// 文件监视
gulp.task("watch", ["css", "html", "js"], function () {

    $.watch(basePath.src.css, function (){
        gulp.start("css");
    })
    $.watch(basePath.src.js, function () {
        gulp.start("js");
    })
    $.watch(basePath.src.html, function () {
        gulp.start("html");
    })
})
// 默认任务，服务器初始化
gulp.task("default", ["watch"], function () {
    browserSync.init({
        server: {
            baseDir: basePath.dist.base,
        },
        files: "**"
    })
})
gulp.task("clean", function () {
    gulp.src(basePath.dist.base)
        .pipe($.clean())
})