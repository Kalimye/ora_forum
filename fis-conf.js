// 加 md5
fis.match('*.{js,css}', {
  useHash: true
});

// 压缩资源
// fis.match('*.js', {
  // optimizer: fis.plugin('uglify-js')
// });
// fis.match('*.css', {
  // optimizer: fis.plugin('clean-css')
// });
// fis.match('*.png', {
// optimizer: fis.plugin('png-compressor')
// });

// 资源定位
fis.match('index.html', {
  release: 'index.html'
});
fis.match('**.js', {
  release: 'forum/$0'
});
fis.match('**.css', {
  release: 'forum/$0'
});
fis.match('**.{png,jpg,jpeg}', {
  release: 'forum/$0'
});

// fis.match('::packager', {
//   spriter: fis.plugin('csssprites')
// });

// fis.match('*', {
//   useHash: false
// });

// fis.match('*.js', {
//   optimizer: fis.plugin('uglify-js')
// });

// fis.match('*.css', {
//   useSprite: true,
//   optimizer: fis.plugin('clean-css')
// });

// fis.match('*.png', {
//   optimizer: fis.plugin('png-compressor')
// });
