var Observable = require("data/observable").Observable;
var frameModule = require("ui/frame");

function onLoginLoaded(args) {
    var page = args.object;
    page.bindingContext = ViewModel();
}

function login(data) {
    
}

function ViewModel() {
    var vm = new Observable();
    vm.username = '';
    vm.passoword = '';

    vm.login = function() {
        frameModule.topmost().navigate('views/main/main-page')
    }

    return vm;
}

exports.ViewModel = ViewModel;
exports.onLoginLoaded = onLoginLoaded;