;(function(){

	'use strict';

	var application = require("application");
	var storage = require("application-settings");
	var Color = require("color").Color;
	var mapsModule = require("nativescript-google-maps-sdk");
	var geolocation = require("nativescript-geolocation");
	var TrackService = require("./track-service").TrackService;

	var MapService = (function(){

		var Position = mapsModule.Position;
		var MapView;
		var zoom;

		function MapService() {
			this._GoogleMap = null;
			this.points = [];
			this.polyline = null;
		}

		MapService.prototype.mapReady = function(args) {	

			/* Set Android My Location Marler */
			if(application.android) {
				var _this = this;


				this._GoogleMap = args.object.gMap;
				var UISettings = this._GoogleMap.getUiSettings();

				(function waitForEnaibleGPS(){
					if(geolocation.isEnabled()) {
						UISettings.setZoomControlsEnabled(true);
						return _this._GoogleMap.setMyLocationEnabled(true);
					} else {
						setTimeout(function(){
							waitForEnaibleGPS();
						},5000)
					}
				})();

				MapView = args.object;

				/* Initialize track */
				if(this.points.length > 1) {
					var polyline = new mapsModule.Polyline();
					var p = 0;
					while(p < this.points.length) {
						polyline.addPoint(this.points[p]);
						p++;
					}
					polyline.visible = true;
					polyline.width = 12;
					polyline.color = new Color('#FF4000');
					polyline.geodesic = true;
					MapView.addPolyline(polyline);
				}
			}
		};

		MapService.prototype.moveTo = function(location, onStart) {
			if(application.android) {
				var _this = this;
				var cameraPosition = (function(location){
					var Builder = new com.google.android.gms.maps.model.CameraPosition.Builder();
					if (!isNaN(location.latitude) && !isNaN(location.longitude)) {
						Builder.target(new com.google.android.gms.maps.model.LatLng(location.latitude, location.longitude));
						if(onStart) {
							zoom = 18;
						} else {
							zoom = _this._GoogleMap.getCameraPosition().zoom;
						}
						if(!isNaN(zoom)) {
							Builder.zoom(zoom);
						}
						return Builder.build();
					} else {
						return null;
					}
				}(location));
				var cameraUpdate = com.google.android.gms.maps.CameraUpdateFactory.newCameraPosition(cameraPosition);
				_this._GoogleMap.animateCamera(cameraUpdate);
			}
		};

		MapService.prototype.addLine = function(loc) {
			if(application.android) {
				var	point = Position.positionFromLatLng(loc.latitude, loc.longitude);
				var polyline = new mapsModule.Polyline();
				this.points.push(point);

				if(this.points.length < 2) {
					return;
				}

				var pt = 0;
				while(pt < this.points.length) {
					polyline.addPoint(this.points[pt]);
					pt++;
				}

				polyline.visible = true;
				polyline.width = 12;
				polyline.color = new Color('#FF4000');
				polyline.geodesic = true;

				MapView.clear();
				MapView.addPolyline(polyline);

				pt = null;
				point = null;
				polyline = null;
			}
		};

		MapService.prototype.refresh = function() {
			if(application.android) {
				MapView.clear();
				this.points = [];
			}
		};

		MapService.prototype.addTrackOnLiteMap = function(args,index) {
			if(application.android) {
				var LiteMapView = args.object,
					LitePoints = TrackService.getPointsByTrackID(index),
					LitePolyline = new mapsModule.Polyline(),
					BoundsBuilder = new com.google.android.gms.maps.model.LatLngBounds.Builder();

				var latitude,
					longitude,
					lpt = 0;

				while(lpt < LitePoints.length) {
					latitude = LitePoints[lpt].latitude;
					longitude = LitePoints[lpt].longitude;
					var point = mapsModule.Position.positionFromLatLng(latitude, longitude);
					LitePolyline.addPoint(point);
					BoundsBuilder.include(new com.google.android.gms.maps.model.LatLng(latitude, longitude));
					lpt++;
				}

				var BoundsLatLng = BoundsBuilder.build();
				LiteMapView.zoom = (function() {
					var GLOBE_WIDTH = 256; // a constant in Google's map projection
					var west = BoundsLatLng.northeast.latitude;
					var east = BoundsLatLng.southwest.latitude;

					var angle = east - west;
					if (angle < 0) {
					  angle += 360;
					}

					var zoom = Math.round(Math.log(150 * 360 / angle / GLOBE_WIDTH) / Math.LN2);
					return zoom;
				}());

				var center = BoundsLatLng.getCenter();
				LiteMapView.latitude = center.latitude;
				LiteMapView.longitude = center.longitude;
				LitePolyline.visible = true;
				LitePolyline.width = 5;
				LitePolyline.color = new Color('#FF4000');
				LitePolyline.geodesic = true;
				LiteMapView.addPolyline(LitePolyline);

				LiteMapView = null;
				LitePoints = null;
				LitePolyline = null;
				BoundsBuilder = null;
				latitude = null;
				longitude = null;
				lpt = null;
			}
		};

		return MapService

	}());

	exports.MapService = new MapService();
})();