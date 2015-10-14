'use strict';

angular.module('blackjack', [
    'ngRoute',
    'blackjack.game',
    'blackjack.game.directives',
    'blackjack.game.services',
    'blackjack.version'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/welcome'});
    }])
    .run(function() {
        // Preload card images
        var suit = ['clubs', 'spades', 'hearts', 'diamonds'];

        function rankStr(rank) {
            switch (rank) {
                case 12:
                    return 'jack';
                case 13:
                    return 'queen';
                case 14:
                    return 'king';
                default:
                    return rank;
            }
        }

		for (var i = 1; i < 15; i++) {
            if (i === 11) {
                // Skip ace
                continue;
            }

            suit.forEach(function(suit) {
                var image = new Image();
                image.src = 'res/img/cards/' + rankStr(i) + '_of_' + suit + '.png';
            });
		}
    });

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}
