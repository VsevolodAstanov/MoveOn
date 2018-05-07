;(function(){

	'use strict';

	var platform = require("platform");
	var dialogs = require("ui/dialogs");
	var timer = require("timer");
	var vmModelClass = require("./run-view-model").runModel;
	var vmModule = require("./run-view-model").mainRunViewModel;
	var RunService = require("../../services/run-service").RunService;
	var GPSservice = require("../../services/gps-service").GPSservice;
	var MapService = require("../../services/map-service").MapService;
	var TrackService = require("../../services/track-service").TrackService;

	function onRunLoaded(args) {

		vmModelClass.prototype.play = function() {
			if(!this.isRecord) {
                this.isRecord = true;
                if(!TrackService.canCompleted) {
                	this.start_time = +new Date;
                	this.pause_time = null;
                }
                if(!this.start_time) {
					this.start_time = +new Date;
                }
                vmModule.set('showSaveButton', false);
                RunService.start(this.start_time, this.pause_time);
                GPSservice.watch();
            } else {
                this.isRecord = false;
                this.pause_time = +new Date;
                vmModule.set('showSaveButton', true);
                RunService.stop();
                GPSservice.stop();
            }
        };

		vmModelClass.prototype.save = function() {

			if(!TrackService.canCompleted) {
				return dialogs.alert('Track is too small');
			}

			showPrompt();
		};

        if(!vmModule.isRecord) {
        	console.log('start');
        	GPSservice.getFirstPosition();
			GPSservice.watch();
			if(vmModule.time !== '00:00:00') {
				vmModule.set('showSaveButton', true);
			} else {
				vmModule.set('showSaveButton', false);
			}
		}

		var page = args.object;
		page.bindingContext = vmModule;
	}

	function onMapReady(args) {
		MapService.mapReady(args);
	}

	function showPrompt() {
		dialogs.prompt({
			"title" : "Save track",
			"okButtonText" : "Save",
			"message" : "Enter the track name",
			"cancelButtonText" : "Cancel",
			"defaultText" : "Track name",
			"cancelable": true
		}).then(function(answer) {
			if(answer.result) {
				if(!answer.text) {
					dialogs.alert("The track name is not applicable").then(function(){
						return showPrompt();
					})
				} else {
					TrackService.addName(answer.text);
					GPSservice.saveTrack();
					TrackService.save();

					/* Refresh the ViewModel */
					vmModule.set('showSaveButton', false);
					vmModule.set("altitude", "0 m");
					vmModule.set("speed", "0");
					vmModule.set("time", "00:00:00");
					vmModule.set("distance", "0 m");
					vmModule.set("average_speed", "0.0 km/h");
				}	
			}
		})
	}

	//function onMapClick() {}

	exports.onRunLoaded = onRunLoaded;
	exports.onMapReady = onMapReady;
	//exports.onMapClick = onMapClick;
})();