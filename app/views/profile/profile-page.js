var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");

function onProfileLoaded(args) {
    var page = args.object;
    page.bindingContext = ViewModel();
}

function ViewModel() {
    var vm = new Observable();

    return vm;
}


exports.ViewModel = ViewModel;
exports.onProfileLoaded = onProfileLoaded;