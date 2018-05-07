var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");

function onDetailsLoaded(args) {
    var page = args.object;
    page.bindingContext = ViewModel();
}

function ViewModel() {
    var vm = new Observable();

    return vm;
}

exports.ViewModel = ViewModel;
exports.onDetailsLoaded = onDetailsLoaded;