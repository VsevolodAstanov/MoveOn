var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");

function onMainLoaded(args) {
    var page = args.object;
    page.bindingContext = ViewModel();
}

function ViewModel() {
    var vm = new Observable();

    vm.sex = false;

    vm.start = function() {
        frameModule.topmost().navigate('views/run/run-page');
    };

    vm.follow = function() {
    	frameModule.topmost().navigate('views/follow/follow-page');
    }

    vm.trainings = function() {
    	frameModule.topmost().navigate('views/trainings/trainings-page');
    };

    vm.statistic = function() {
    	frameModule.topmost().navigate('views/statistic/statistic-page');
    }

    vm.profile = function() {
    	frameModule.topmost().navigate('views/profile/profile-page');
    }

    vm.about = function() {
    	frameModule.topmost().navigate('views/about/about-page');
    }

    return vm;
}

exports.ViewModel = ViewModel;
exports.onMainLoaded = onMainLoaded;