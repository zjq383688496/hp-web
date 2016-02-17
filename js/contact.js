/**
 *   联系我们相关处理
 *   modify  2016-01-12   author eric
**/
var modHeaderFull=angular.module('mod-header-full', ['modHeaderFull']);

if (ArtJS.server.language == 'US') {
    $('#headerH2').html('');
    $('.copyright>a').html('');
}