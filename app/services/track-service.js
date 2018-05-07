;(function(){

	'use strict';


	var storage = require("application-settings");
	var tracks = (function(){
        if(storage.hasKey("tracks")) {
            var trackObject = JSON.parse(storage.getString("tracks"));
            for (var i = 0; i < trackObject.length; i++) {
                trackObject[i].trk.index = i.toString();
            }
            return trackObject;
        } else {
            return [];
        }
	}());

	var TrackService = (function() {

		function TrackService() {}

		Object.defineProperty(TrackService.prototype, 'canCompleted', {
			get: function() {
				if(this.isInitialized) {
					if(this.track.trk.trkseg.trkpt.length >= 1) {
						return true;
					}
					return false;
				}
				return false;
				
			},
			"enumerable": true,
			"configurable": true
		});

		Object.defineProperty(TrackService.prototype, 'isInitialized', {
			"value": false,
			"writable": true,
			"enumerable": true,
			"configurable": true
		});

		TrackService.prototype.initialize = function() {
			this.track = {
				"metadata" : {
					"name" : "",
					"desc" : "",
					"author" : "", //profile name
					"time" : "", //save time
				},
				"trk" : {
					"name" : "",
					"cmt" : "",
					"desc": "",
					"number" : "1",
					"trkseg" : {
						"trkpt" : []
					},
					"info" : {
						"save_time" : "",
						"distance" : "",
						"time" : "",
						"speedmax" : "",
						"speedavg" : "",
						"altimin" : "",
						"altimax" : "",
						"alticlimb" : "",
						"altidown" : "",
						"calories" : "",
						"hratemin" : "",
						"hratemax" : "",
						"hrateavg" : ""
					}
				}
			};
			
			this.isInitialized = true;
		};

		TrackService.prototype.toGXP = function() {

		};

		TrackService.prototype.toJSON = function() {

		};

		TrackService.prototype.getTracks = function() {
			return tracks;
		};

		TrackService.prototype.deleteTrack = function(id) {
			tracks.splice(id, 1);
			storage.setString("tracks", JSON.stringify(tracks));
		};

		TrackService.prototype.getTrackByID = function(id) {

		};

		TrackService.prototype.getPointsByTrackID = function(id) {
			console.log(id);
			//return tracks[id].trk.trkseg.trkpt;
		};

		TrackService.prototype.save = function() {
			tracks.push(this.track);
			storage.setString("tracks", JSON.stringify(tracks));

			/* Reset the track */
			this.initialize();
		};

		TrackService.prototype.addName = function(name) {
			this.track.metadata.name = name;
			this.track.trk.name = name;
		};

		TrackService.prototype.addPoint = function(point) {
			if(!this.isInitialized) {
				this.initialize();
			}

			this.track.trk.trkseg.trkpt.push(point);
		};

		TrackService.prototype.addInfo = function(info) {
			var date = new Date();
			this.track.trk.info.save_time = date.toLocaleDateString('en-GB') + " - " + date.toLocaleTimeString('en-GB');
			this.track.trk.info.distance = info.distance;
			this.track.trk.info.time = info.time;
			this.track.trk.info.speedavg = info.speedavg;
			this.track.trk.info.speedmax = info.speedmax;
			this.track.trk.info.altimin = info.altimin;
			this.track.trk.info.altimax = info.altimax;
			this.track.trk.info.altiup = info.altiup;
			// this.track.trk.info.altidown = info.altidown || "";
			// this.track.trk.info.calories = info.calories || "";
			// this.track.trk.info.hratemin = info.hratemin || "";
			// this.track.trk.info.hratemax = info.hratemax || "";
			// this.track.trk.info.hrateavg = info.hrateavg || "";
		};

		return TrackService;

	}());

	exports.TrackService = new TrackService();
})();