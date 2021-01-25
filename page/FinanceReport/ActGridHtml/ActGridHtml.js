Page({
  data: {
    url: 'http://115.238.99.170:8888/ZDWeb/print/blank.html',
  },
  onLoad(e) {
    var t = this;
    t.setData({ url: 'http://115.238.99.170:8888/ZDWeb/print/ActGrid' + e.username + '.html' });
  },
});
