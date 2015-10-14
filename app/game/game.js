'use strict';

angular.module('blackjack.game', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/game/:id', {
            templateUrl: 'game/game.html',
            controller: 'GameCtrl'
        });

        $routeProvider.when('/welcome', {
            templateUrl: 'game/welcome.html',
            controller: 'WelcomeCtrl'
        });
    }])
    .controller('GameCtrl', ['$scope', '$routeParams', '$timeout', '$location', 'BlackjackClient', function ($scope, $routeParams, $timeout, $location, BlackjackClient) {
        $scope.seats = [];
        $scope.dealerHand = {};

        $scope.$on('table_state', function (e, state) {
            $scope.seats = state.seats;
            $scope.dealerHand = state.dealerHand;

            $scope.seats.forEach(function (seat) {
                seat.player.bet = seat.hands.reduce(function (acc, obj) {
                    return acc + obj.bet;
                }, 0);
            });
        });

        $scope.$on('card_dealt', function (e, data) {
            $scope.seats[data.seatIndex].hands[data.handIndex].hand.cards.push(data.card);
        });

        $scope.$on('split_hand', function (e, split) {
            $scope.seats[split.seatIndex].hands = split.hands;
            $scope.seats[split.seatIndex].player.money -= split.hands[0].bet;
            $scope.seats[split.seatIndex].player.bet += split.hands[0].bet;
        });

        $scope.$on('card_dealt_to_dealer', function (e, data) {
            $scope.dealerHand.cards.push(data.card);
        });

        $scope.$on('player_bet', function (e, bet) {
            $scope.seats[bet.seatIndex].player.money = bet.money;
            if (!$scope.seats[bet.seatIndex].player.bet) {
                $scope.seats[bet.seatIndex].player.bet = bet.betAmount;
            } else {
                $scope.seats[bet.seatIndex].player.bet += bet.betAmount;
            }
        });

        $scope.$on('hand_result', function (e, data) {
            $scope.seats[data.seatIndex].hands[data.handIndex].result = data.result.status;
        });

        $scope.$on('name_change', function (e, data) {
            $scope.seats[data.seatIndex].player.name = data.name;
        });

        $scope.$on('table_closed', function(){
            $location.path('/welcome');
        });

        $scope.$on('$locationChangeStart', function () {
            BlackjackClient.unsubscribe();
        });

        BlackjackClient.subscribe($routeParams.id);

    }])
    .controller('WelcomeCtrl', ['$scope', '$location', '$interval', 'BlackjackClient', function ($scope, $location, $interval, BlackjackClient) {
        $scope.loading = true;
        $scope.tables = [];
        $scope.data = {
            selectedTable: null
        };

        $scope.spectate = function () {
            var table = $scope.data.selectedTable;
            if (table != null)
                $location.path('/game/' + table);
        };

        $scope.$on('tables', function (e, data) {
            $scope.loading = false;
            $scope.tables = data.tables;
            $scope.data.selectedTable = data.tables[0].id;
        });

        $scope.$on('$locationChangeStart', function () {
            $interval.cancel(repeater);
        });

        var repeater = $interval(function () {
            BlackjackClient.query();
        }, 1000);
    }]);