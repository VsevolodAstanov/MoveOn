var dialogs = require("ui/dialogs");
var frameModule = require("ui/frame");
var vmModule = require("./trainings-view-model").TrainingsViewModel;
var MapService = require("../../services/map-service").MapService;
var TrackService = require("../../services/track-service").TrackService;

function onTrainingLoaded(args) {
    var page = args.object;
	page.bindingContext = vmModule;
}

function onTRMapReady(args) {

	/* Enable lite mode */
	var gMap = args.object.gMap;
	var UISettings = gMap.getUiSettings();
	UISettings.setMapToolbarEnabled(false);

	// /* Add track */
	var mapIndex = args.object.id;

	console.log(mapIndex);

	MapService.addTrackOnLiteMap(args, mapIndex);
}

function showDetails(args) {
	console.log(args.object.id);
	//TrackService.deleteTrack(args.object.id);
	//frameModule.topmost().navigate('views/details/details-page');
}

exports.showDetails = showDetails;
exports.onTRMapReady = onTRMapReady;
exports.onTrainingLoaded = onTrainingLoaded;