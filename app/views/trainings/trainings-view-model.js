var storage = require("application-settings");
var observable = require("data/observable");
var TrainingsViewModel = (function (_super) {
    __extends(TrainingsViewModel, _super);
    function TrainingsViewModel() {
        _super.call(this);
    }

    Object.defineProperty(TrainingsViewModel.prototype, 'trainings', {
        get: function () {
            return (function(){
                if(storage.hasKey("tracks")) {
                    var tracks = JSON.parse(storage.getString("tracks"));
                    for (var i = 0; i < tracks.length; i++) {
                        tracks[i].trk.index = i.toString();
                    }
                    return tracks;
                } else {
                    return [];
                }
            }());
        },
        enumerable: true,
        configurable: true
    });

    return TrainingsViewModel;
})(observable.Observable);
exports.TrainingsViewModel = new TrainingsViewModel();
exports._TrainingsViewModel = TrainingsViewModel;