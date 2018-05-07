var observable = require("data/observable");
var runModel = (function (_super) {
    __extends(runModel, _super);
    function runModel() {
        _super.call(this);
    }

    Object.defineProperty(runModel.prototype, 'latitude', {
        "value": 0,
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'longitude', {
        "value": 0,
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'isRecord', {
        "value": false,
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'altitude', {
        "value": '0 m',
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'speed', {
        "value": '0',
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'time', {
        "value": '00:00:00',
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'distance', {
        "value": '0 m',
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'average_speed', {
        "value": '0.0 km/h',
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'speedmax', {
        "value": 0,
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'altimin', {
        "value": 999999,
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'altimax', {
        "value": 0,
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    Object.defineProperty(runModel.prototype, 'altiup', {
        "value": 0,
        "writable": true,
        "enumerable": true,
        "configurable": true
    });

    return runModel;
})(observable.Observable);
exports.runModel = runModel;
exports.mainRunViewModel = new runModel();