'use strict';

angular.module('blackjack.game.services', ['ngRoute'])
    .service('BlackjackClient', ['$rootScope', function ($rootScope) {
        var conn = new WebSocket('ws://blackjack.nemanjamiljkovic.me:8001');

        this.query = function () {
            send(JSON.stringify({
                alias: 'query'
            }));
        };

        this.subscribe = function (tableId) {
            send(JSON.stringify({
                "alias": "subscribe",
                "table_id": tableId
            }));
        };

        this.unsubscribe = function () {
            send(JSON.stringify({
                "alias": "unsubscribe"
            }));
        };

        conn.onopen = function () {
            console.log("Connection established!");
        };

        conn.onmessage = function (e) {
            var message = JSON.parse(e.data);
            console.log(JSON.parse(JSON.stringify((message))));

            $rootScope.$broadcast(message.alias, message.data);

            if (!$rootScope.$$phase) {
                $rootScope.$apply();
            }
        };

        var send = function (message, callback) {
            waitForConnection(function () {
                conn.send(message);
                if (typeof callback !== 'undefined') {
                    callback();
                }
            }, 1000);
        };

        var waitForConnection = function (callback, interval) {
            if (conn.readyState === 1) {
                callback();
            } else {
                setTimeout(function () {
                    waitForConnection(callback, interval);
                }, interval);
            }
        };
    }]);
