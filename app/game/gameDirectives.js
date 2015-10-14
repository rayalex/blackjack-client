'use strict';

angular.module('blackjack.game.directives', ['ngRoute'])
    .directive('card', [function () {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {

                var getRank = function (rank) {
                    var map = {
                        12: 'jack',
                        13: 'queen',
                        14: 'king'
                    };

                    return map[rank] || rank;
                };

                var getSuit = function (suit) {
                    var map = {
                        C: 'clubs',
                        H: 'hearts',
                        D: 'diamonds',
                        S: 'spades'
                    };

                    return map[suit];
                };

                element.addClass('card');

                scope.$watch(attrs.stackindex, function (index) {
                    var height = element[0].clientHeight;
                    var xOffset = height * 0.05;
                    var yOffset = height * 0.15;

                    element.css('left', index * xOffset + 'px');
                    element.css('top', index * -(height - yOffset) + 'px');
                    element.css('z-index', index);
                });

                scope.$watch(attrs.card, function (card) {
                    element.css('background-image', 'url(res/img/cards/{0}_of_{1}.png)'.format(getRank(card.rank), getSuit(card.suit)));
                });
            }
        }
    }]);