var gt = {
  config: {
    earthRadius: 200,
    markerRadius: 200,
    cloudRadius: 205,
    cloudSpeed: 0.000005
  },
  init: function() {
    gt.app = new gt.App({
      el: document.body
    });
  }
};
