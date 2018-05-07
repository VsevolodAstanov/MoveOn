;(function(){

	'use strict';

	var geolocation = require("nativescript-geolocation");
	var runViewModel = require("../views/run/run-view-model").mainRunViewModel;
	var MapService = require("./map-service").MapService;
	var RunService = require('./run-service').RunService;
	var TrackService = require('./track-service').TrackService;
	var timer = require("timer");
	var onStart = true;
	var fullDistance = 0;
	var prevTime;
	var prevLocation;
	var pauseTimeout;
	var watcher;

	var GPSservice = (function () {

		function GPSservice() {}

		Object.defineProperty(GPSservice.prototype, "watchOptions", {
			"value": {
				"desiredAccuracy": 0,
				"updateDistance": 0,
				"minimumUpdateTime": 1500
			},
			"writable": true,
			"enumerable": true,
			"configurable": true
		});

		GPSservice.prototype.saveTrack = function() {

			TrackService.addInfo({
				time: runViewModel.time,
				distance: runViewModel.distance,
				speedavg: runViewModel.average_speed,
				speedmax: runViewModel.speedmax,
				altimax: runViewModel.altimax,
				altimin: runViewModel.altimin,
				altiup: runViewModel.altiup
			});

			/* Refresh */
			MapService.refresh();
			fullDistance = 0;
			pauseTimeout = null;
			prevLocation = null;
			prevTime = null;
			watcher = null;
		}

		GPSservice.prototype.onSuccess = function(location) {

			/* Calculate the difference time in sec*/
			var current_time = +new Date;
			var difference_time_start = current_time - runViewModel.start_time;
				difference_time_start = difference_time_start / 1000;
				difference_time_start = Math.floor(difference_time_start);
				difference_time_start = parseInt(difference_time_start);

			if(prevTime) {
				var difference_time_last = ((current_time - prevTime) / 1000);
			}

			if(prevLocation) {

				if(!isNaN(location.altitude) && isFinite(location.altitude)) {

					/* Set min altitude */
					if(runViewModel.altimin > location.altitude) {
						if(location.altitude != 0) {
							runViewModel.set("altimin", Math.floor(location.altitude));	
						}
					}

					/* Set max altitude */
					if(runViewModel.altimax < location.altitude) {
						runViewModel.set("altimax", Math.floor(location.altitude));
					}

					/* Set altitude up */
					var previous_altitude = prevLocation.altitude;
					var current_altitude = location.altitude;
					if(previous_altitude < current_altitude) {
						runViewModel.set("altiup", runViewModel.altiup + (current_altitude - previous_altitude));
					}

					runViewModel.set("altitude", Math.floor(location.altitude) + ' m');
				}

				if (!isNaN(location.latitude) && !isNaN(location.longitude)) {

					/* Clear timeout */
					timer.clearTimeout(pauseTimeout);

					if(onStart){
						/* Move to the latest point through the animation on Start*/
						MapService.moveTo(location, onStart);
						onStart = false;
					}
								
					var dist = geolocation.distance(prevLocation, location);
					if(isNaN(dist) && !isFinite(dist)) {
						return;
					}

					/* Speed */
					var speed = ((dist / difference_time_last) * 3.6).toFixed(1);
					console.log(dist + ': dist');
					console.log(difference_time_last + ': difference');
					console.log(speed + ': speed');
					if(!isNaN(speed) && isFinite(speed)) {
						runViewModel.set("speed", speed);

						/* Set max speed */
						if(runViewModel.speedmax < speed) {
							runViewModel.set("speedmax", speed);
						}
					}				

					if(runViewModel.isRecord) {
						/* Distance */
						fullDistance += dist;

						if(!isNaN(fullDistance) && isFinite(fullDistance)) {
							if(fullDistance > 999) {
								runViewModel.set("distance",  (fullDistance / 1000).toFixed(1) + ' km');
							} else {
								runViewModel.set("distance",  Math.floor(fullDistance) + ' m');
							}
						}

						/* Average Speed */
						var average_speed = ((fullDistance / 1000 ) / (difference_time_start / 3600)).toFixed(1);
						if(!isNaN(average_speed) && isFinite(average_speed)) {
							runViewModel.set("average_speed", average_speed + ' km/h');
						}

						/* Add line */
						var loc = {
							"latitude": location.latitude,
							"longitude": location.longitude
						};

						MapService.addLine(loc);
						MapService.moveTo(location);
						TrackService.addPoint({
							"latitude" : location.latitude,
							"longitude" : location.longitude,
							"altitude" : location.altitude,
							"time" : current_time,
							"speed" : speed,
							"hrate" : "",
							"power" : "",
							"incline" : ""
						});

						/* Set pause */
						pauseTimeout = timer.setTimeout(function(){
							runViewModel.set("speed", 0);
						}, 5000);	
					}
				}	
			}
			prevTime = +new Date;
			prevLocation = location;
		}

		GPSservice.prototype.onError = function(err) {
			console.log("Error: " + err.message);
		}

		GPSservice.prototype.watch = function() {
			if(geolocation.isEnabled()) {
				if(watcher) {
					return;
				}
			} else {
				this.stop();
			}
			watcher = geolocation.watchLocation(this.onSuccess, this.onError, this.watchOptions); 
		}

		GPSservice.prototype.stop = function() {
			geolocation.clearWatch(watcher);
			watcher = null;
		}

		return GPSservice;
	}());

	exports.GPSservice = new GPSservice();
	exports._GPSservice = GPSservice;
})();