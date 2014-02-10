/* Build GeoJSON object of proposed pipeline route lat/long coordinates, and add it to the map. */
$(function() {

  'use strict';

  // Layer style.
  var routeStyle = {
    'className': 'pipeline-section bla'
  };

  function cleanName(name) {
    return name.replace(/_/g, '-');
  }

  // De-activate active pipeline sections and info-items.
  function deActivate() {
    $.each($('.pipeline-section'), function(index, value) {
      var sectionClasses = $(value).attr('class');
      if (sectionClasses.indexOf('active') >= 0) {
        sectionClasses = sectionClasses.replace('active', '');
        $(value).attr('class', sectionClasses);
      }
    });
    $.each($('.pipeline-info-item'), function(index, value) {
      var infoItemClasses = $(value).attr('class');
      if (infoItemClasses.indexOf('active') >= 0) {
        infoItemClasses= infoItemClasses.replace('active', '');
        $(value).attr('class', infoItemClasses);
      }
    });
  }

  function setActive(sectionName) {
    deActivate();
    if (sectionName === 'overall') {
      $.each($('.pipeline-section'), function(index, value) {
        var sectionClasses = $(value).attr('class');
        $(value).attr('class', sectionClasses + ' active');
      });
    }
    // Look up matching info item attribute.
    var pipelineSection = $('[data-pipeline-section="' + sectionName + '"]');
    var infoItem = $('[data-section-info="' + sectionName + '"]');
    // For some reason, addClass() doesn't work here, so doing it manually.
    var currentClasses = pipelineSection.attr('class');
    pipelineSection.attr('class', currentClasses + ' active');
    infoItem.addClass('active');
  }

  function onEachFeature(feature, layer) {
    var infoItemContent = '<h2 class="info-item-title">' + feature.properties.title + '</h2>' +
      '<table class="spill-risks">' +
      '<thead><tr>' +
      '<th>Medium:</th>' +
      '<th>Large:</th>' +
      '<th>Medium or Large:</th>' +
      '</tr></thead>' +
      '<tbody><tr>' +
      '<td>' + feature.properties.spill_risk_medium + '%' + '</td>' +
      '<td>' + feature.properties.spill_risk_large + '%' + '</td>' +
      '<td>' + feature.properties.spill_risk_medium_or_large + '%' + '</td>' +
      '</tr></tbody>' +
      '</table>';
    // feature.setAttribute('data', cleanName(feature.properties.name));
    var infoItemClass = 'pipeline-info-section-' + cleanName(feature.properties.name);
    var infoItem = '<div class="pipeline-info-item' + ' ' + infoItemClass + '" data-section-info="' + cleanName(feature.properties.name) + '">' + infoItemContent + '</div>';

    $('#features-info').append(infoItem);
  }

  var routeLayer = L.geoJson(null, {
    style: function(feature) {
      var sectionClass = 'pipeline-section-' + cleanName(feature.properties.name);
      return { className: 'pipeline-section' + ' ' + sectionClass }
    },
    onEachFeature: onEachFeature
  });
  
  $.getJSON('js/pipeline_sections_data.json', function(data) {
    routeLayer.addData(data);
    // Set a data attribute on each SVG path, so we can access it later.
    $.each(routeLayer._layers, function(index, value) {
      value._path.setAttribute('data-pipeline-section', cleanName(value.feature.properties.name));
    });
    var startingSection = 'bruderheim';
    setActive(startingSection);
    $('.pipeline-section').hover(function() {
      setActive($(this).data('pipeline-section'));
    });
    $('.pipeline-info-item').hover(function() {
      setActive($(this).data('section-info'));
    });
  });
  map.addLayer(routeLayer);
});