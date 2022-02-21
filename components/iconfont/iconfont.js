Component({
  properties: {
    // lan-icon-lipin | lan-icon-xichefuwu | lan-icon-jiayoufuwu | lan-icon-xiuchefuwu | lan-icon-feiji | lan-icon-lunchuan | lan-icon-tishi | lan-icon-yue | lan-icon-zhishidian | lan-icon-vip2 | lan-icon-vip | lan-icon-vip1 | lan-icon-play | lan-icon-wechat | lan-icon-wenben | lan-icon-zhengque | lan-icon-cuowu | lan-icon-dianji | lan-icon-shijian | lan-icon-arrow-top-line | lan-icon-plus-sign | lan-icon-arrow-round | lan-icon-arrow-right | lan-icon-arrow-left | lan-icon-daipaidan | lan-icon-daiyuyue | lan-icon-wodeyiban | lan-icon-lifang | lan-icon-jingcha | lan-icon-honglvdeng | lan-icon-tubiaozhizuomoban- | lan-icon-yuyue1 | lan-icon-wubianxing1 | lan-icon-safety-belt | lan-icon-changyongtubiaoguanli | lan-icon-tubiao_dianzan-xuanzhongzhuangtai | lan-icon-huoche | lan-icon-jinggao | lan-icon-motuoche | lan-icon-xiaoche | lan-icon-keche | lan-icon-shoucang | lan-icon-fankui | lan-icon-zuji | lan-icon-xunzhang | lan-icon-huiyuan | lan-icon-yujing | lan-icon-fen | lan-icon-fuwuzhengce | lan-icon-yiquxiao | lan-icon-zantingdan | lan-icon-jiaotongfakuan | lan-icon-kaoshijihua | lan-icon-peixunkaoshi | lan-icon-kaoshi | lan-icon-weizhi-o | lan-icon-weizhi | lan-icon-calculator-ing | lan-icon-study-ing | lan-icon-calculator | lan-icon-guideboard-ing | lan-icon-guideboard | lan-icon-study | lan-icon-mine-ing | lan-icon-mine | lan-icon-car | lan-icon-kehuxiangqing | lan-icon-kuaidijindu | lan-icon-zaixiankaoshi | lan-icon-wuli | lan-icon-hanyuwen | lan-icon-jiafenrenzheng | lan-icon-shenfenrenzheng | lan-icon-zhiwenrenzheng | lan-icon-banghuansanqi-yudingchexian | lan-icon-renzhengbaogaoicon | lan-icon-renzheng2 | lan-icon-chezhufuwu
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function(color) {
        this.setData({
          colors: this.fixColor(),
          isStr: typeof color === 'string',
        });
      }
    },
    size: {
      type: Number,
      value: 18,
      observer: function(size) {
        this.setData({
          svgSize: size / 750 * wx.getSystemInfoSync().windowWidth,
        });
      },
    },
  },
  data: {
    colors: '',
    svgSize: 18 / 750 * wx.getSystemInfoSync().windowWidth,
    quot: '"',
    isStr: true,
  },
  methods: {
    fixColor: function() {
      var color = this.data.color;
      var hex2rgb = this.hex2rgb;

      if (typeof color === 'string') {
        return color.indexOf('#') === 0 ? hex2rgb(color) : color;
      }

      return color.map(function (item) {
        return item.indexOf('#') === 0 ? hex2rgb(item) : item;
      });
    },
    hex2rgb: function(hex) {
      var rgb = [];

      hex = hex.substr(1);

      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function(color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return 'rgb(' + rgb.join(',') + ')';
    }
  }
});
