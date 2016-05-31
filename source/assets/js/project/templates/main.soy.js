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
gux.templates.Main.ProjectLoader = function(opt_data, opt_ignored) {
  var output = '<div class="project-loader"><div class="dimmed-background"></div><div class="lightbox"><div class="shapes">';
  var shapeList4 = opt_data.shapes;
  var shapeListLen4 = shapeList4.length;
  for (var shapeIndex4 = 0; shapeIndex4 < shapeListLen4; shapeIndex4++) {
    var shapeData4 = shapeList4[shapeIndex4];
    output += '<div class="icon" style="top:' + shapeData4.y + ';left:' + shapeData4.x + '"></div>';
  }
  output += '</div><div class="text-container"><div class="masthead"><h6 class="subheading above ' + opt_data.project.color + '">' + opt_data.project['genre'] + '</h6><h3 class="border-heading has-bottom has-left">' + opt_data.project['headingHtml'] + '<div class="border bottom ' + opt_data.project.color + '"></div><div class="border left ' + opt_data.project.color + '"></div></h3><p class="description">' + opt_data.project['shortDescription'] + '</p></div></div></div></div>';
  return output;
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
gux.templates.Main.SimpleLoader = function(opt_data, opt_ignored) {
  return '<div class="simple-loader"><div class="spinner"></div></div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @notypecheck
 */
gux.templates.Main.ImageViewer = function(opt_data, opt_ignored) {
  return '<div id="image-viewer"><div class="overlay"></div><div class="image"><div class="image-container"><div class="shadow"></div><img src="' + opt_data.defaultSrc + '" class="default" draggable="false"><img src="' + opt_data.largeSrc + '" class="large" draggable="false"></div></div><div class="controls"><button class="close"></button><div class="slider"><div class="inner"><div class="track"></div><div class="handle"></div></div></div></div></div>';
};
