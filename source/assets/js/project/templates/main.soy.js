// This file was automatically generated from main.soy.
// Please don't edit this file by hand.

goog.provide('gux.templates.Main');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
gux.templates.Main.FullscreenLoader = function(opt_data, opt_ignored) {
  return '<div id="fullscreen-loader"><div class="masked-content"><div class="dimmed-background"></div><div class="lightbox"><div class="text-container"><div class="masthead"><h6 class="subheading above ' + opt_data.color + '">' + opt_data.genre + '</h6><h3 class="border-heading has-bottom has-left">' + opt_data.heading + '<div class="border bottom ' + opt_data.color + '"></div><div class="border left ' + opt_data.color + '"></div></h3><p class="description">' + opt_data.shortDescription + '</p></div></div></div></div></div>';
};
