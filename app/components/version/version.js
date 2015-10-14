'use strict';

angular.module('blackjack.version', [
  'blackjack.version.interpolate-filter',
  'blackjack.version.version-directive'
])

.value('version', '0.1');
