/* Build GeoJSON object of proposed pipeline route lat/long coordinates, and add it to the map. */
$(function() {

  'use strict';

  // Layer style and popup behaviour.
  var routeColor = '#e44735';
  var routeStyle = {
    'className': 'pipeline',
    'weight': 5,
    'opacity': 1,
    'clickable': false
  };

  function onEachFeature(feature, layer) {
    var popup = L.popup();
    popup.setContent(
      '<h2>' + feature.properties.Name + '</h2>' +
      '<ul>' +
      '<li>' + 'Risk of a medium pipeline spill: ' + feature.properties.spill_risk_medium + '%' + '</li>' +
      '<li>' +'Risk of a large pipeline spill: ' + feature.properties.spill_risk_large + '%' + '</li>' +
      '<li>' +'Risk of a medium or large pipeline spill: ' + feature.properties.spill_risk_medium_or_large + '%' + '</li>' +
      '</ul>'
    );
    layer.bindPopup(popup);
  }

  var routeLayer = L.geoJson(null, {
    style: function(feature) {
      return {color: feature.properties.color}
    },
    onEachFeature: onEachFeature
  });

  $.getJSON('js/pipeline_sections_data.json', function(data) {
    routeLayer.addData(data);
  });

  map.addLayer(routeLayer);
});