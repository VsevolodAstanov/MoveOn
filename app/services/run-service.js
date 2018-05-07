;(function(){

	'use strict';

	var runViewModel = require("../views/run/run-view-model").mainRunViewModel;
	var timer = require("timer");

	var RunService = (function() {

		var timer_id;

		function RunService() {}

		RunService.prototype.start = function(start_time, pause_time) {
			var time,
				current_time,
				difference_time,
				sec,
				min,
				hour;

			timer_id = timer.setInterval(function() {

				current_time = +new Date;
				difference_time = current_time - start_time;
				difference_time = difference_time / 1000;
				difference_time = Math.floor(difference_time);
				difference_time = parseInt(difference_time);

				sec = Math.floor(difference_time % 60);
				min = Math.floor((difference_time / 60) % 60);
				hour = Math.floor(difference_time / 3600);
				time = (hour > 9 ? hour : '0' + hour) + ':' + (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
				runViewModel.set("time", time);

			}, 1000);
		};

		RunService.prototype.stop = function() {
			var _this = this;
			timer.clearInterval(timer_id);
		};

		return RunService;
	}());

	exports.RunService = new RunService();
	exports._RunService = RunService;
})();