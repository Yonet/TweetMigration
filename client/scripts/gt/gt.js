var gt = {
	config: {
		earthRadius: 200,
		markerRadius: 200,
		cloudRadius: 205,
		cloudSpeed: 0.000003,
		cameraDistance: 500,

		debug: true,
		pauseOnBlur: false,

		itemName: 'tweet',
		itemNamePlural: 'tweets',

		heatmapStyle: 'clouds',

		heatmapStyles: {
			clouds: { // Real time cumillative (clouds)
				fps: 32,
				size: 9,
				intensity: 0.33,
				doBlur: true,
				decayFactor: 1/100000000,
			},
			lightning: { // Real time (flashes)
				fps: 32,
				size: 8,
				intensity: 0.85,
				doBlur: false,
				decayFactor: 1/10
			},
			ozone: { // Cumillative decay (repairing holes)
				fps: 32,
				size: 15,
				intensity: 0.15,
				doBlur: false,
				decayFactor: 1/133
			},
			decay: { // Cumillative (holes)
				fps: 32,
				size: 20,
				intensity: 0.03,
				doBlur: false,
				decayFactor: 0
			}
		},
	},
	init: function() {
		gt.app = new gt.App(gt.config);
	}
};
