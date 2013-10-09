var gt = {
	config: {
		earthRadius: 200,
		markerRadius: 200,
		cloudRadius: 205,
		cloudSpeed: 0.000005,
		cameraDistance: 600,
		debug: true,
		pauseOnBlur: true,

		heatmapStyle: 'clouds',

		heatmap: {
			clouds: { // Real time cumillative (clouds)
				fps: 20,
				size: 8.50,
				intensity: 0.33,
				doBlur: true,
				decayFactor: 1/25000,
			},
			lightning: { // Real time (lightning) 
				fps: 32,
				size: 8,
				intensity: 0.55,
				doBlur: true,
				decayFactor: 1/100
			},
			holes: { // Cumillative (holes)
				fps: 24,
				size: 20,
				intensity: 0.15,
				doBlur: false,
				decayFactor: 0,
			},
			holes_repair: { // Cumillative decay (repairing holes)
				fps: 24,
				size: 20,
				intensity: 0.15,
				doBlur: false,
				decayFactor: 1/100
			}
		},
	},
	init: function() {
		gt.app = new gt.App({
			el: document.body
		});
	}
};
