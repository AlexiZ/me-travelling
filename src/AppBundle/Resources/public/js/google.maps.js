/**
 * MANAGE GMAPS
 */

var initialize = function(){};
var addMarkers = function(){};
var map = null;
(function($) {
    $(document).ready(function() {
        if ((canvas = document.getElementById('googleMap'))) {
            var data = $('#googleMap').data()
                , vcardsId = '#microformats'
                , bounds = null
                , infoWindows = [];
            var scrollWheel = data.scrollwheel != undefined ? (data.scrollwheel == 'true') : true
                , latitude = data.latitude ? data.latitude : 46.8
                , longitude = data.longitude ? data.longitude : 2.2
                , forceDefaultPosition = (data.forcedefaultposition == true)
                , zoom = data.zoom ? parseInt(data.zoom) : 5
                , zoomControlStyle = data.zoomcontrolstyle ? data.zoomcontrolstyle.toUpperCase() : 'MEDIUM'
                , mapTypeControl = data.maptypecontrol != undefined ? (data.maptypecontrol == 'true') : true
                , streetViewControl = data.streetviewcontrol != undefined ? (data.streetviewcontrol == 'true') : true
                , panControl = data.pancontrol != undefined ? (data.pancontrol == 'true') : true
                , mapTypeId = data.maptypeid ? data.maptypeid.toUpperCase() : 'ROADMAP'
                , icon = data.icon ? data.icon : 'http://chart.apis.google.com/chart?cht=mm&chs=24x32&' +
                'chco=FFFFFF,008CFF,000000&ext=.png'
                , iconClusterer = data.iconclusterer ? data.iconclusterer : icon
                , $vcards = $(vcardsId + ' .vcard')
                , jsonDepartments = data.jsondepartments != undefined ? data.jsondepartments : false
                , coveredDepartments = data.covereddepartments != undefined ? data.covereddepartments : false
                , departmentColor = data.departmentcolor != undefined ? data.departmentcolor : '#072f4a'
                , showMarkers = data.showmarkers != undefined ? data.showmarkers : true
                , zoomControl = data.zoomcontrol != undefined ? data.zoomcontrol : true
                , maxZoom = data.maxzoom != undefined ? data.maxzoom : 16
            ;

            addMarkers = function() {
                $vcards = $(vcardsId + ' .vcard');
                var mapClusterer = new MarkerClusterer(map, [], {
                    gridSize: 30,
                    averageCenter: true,
                    styles: [{
                        url : iconClusterer,
                        height: 49,
                        width: 41,
                        anchor: [8, 11],
                        textColor: '#000',
                        textSize: 12
                    }]
                });
                bounds = new google.maps.LatLngBounds();

                $vcards.each(function(index){
                    var $vcard = $(this)
                        , marker = null;

                    cardLatitude = $vcard.find('.latitude').text();
                    cardLongitude = $vcard.find('.longitude').text();

                    if (cardLatitude === 0 && cardLongitude === 0) {
                        return;
                    }

                    marker = new google.maps.Marker({
                        map: map,
                        icon: new google.maps.MarkerImage(icon,
                            new google.maps.Size(25, 35)),
                        title: $vcard.find('.name').text(),
                        position: new google.maps.LatLng(cardLatitude, cardLongitude)
                    });
                    // ajouter la position du marqueur aux limites de la carte
                    bounds.extend(marker.position);

                    if ($vcard.next('.infoWindow').length > 0) {
                        // Création de la fenêtre
                        var myInfoWindow = new google.maps.InfoWindow({
                            content: '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;">'+ $vcard.next('.infoWindow').html() +'</div>'
                        });

                        infoWindows[index] = myInfoWindow;

                        google.maps.event.addListener(marker, 'click', function() {
                            closeAllInfoWindow();
                            myInfoWindow.open(map, marker);
                        });
                    }

                    google.maps.event.addListener(marker, 'mouseover', function() {
                        $vcard.trigger('mouseenter');
                    });
                    google.maps.event.addListener(marker, 'mouseout', function() {
                        $vcard.trigger('mouseleave');
                    });
                    mapClusterer.addMarker(marker);

                    if ($vcards.length == 1) {
                        google.maps.event.addListenerOnce(map, 'idle', function(){
                            google.maps.event.trigger(marker, 'click');
                        });
                    }
                });

                google.maps.event.addListener(mapClusterer, 'click', function(c){
                    google.maps.event.trigger(mapClusterer, 'mouseout');
                });
                google.maps.event.addListener(mapClusterer, 'mouseover', function(c){
                    $.each(c.getMarkers(), function(){
                        google.maps.event.trigger(this, 'mouseover');
                    });
                });
                google.maps.event.addListener(mapClusterer, 'mouseout', function(c){
                    $vcards.each(function(){
                        google.maps.event.trigger($(this).data('marker'), 'mouseout');
                    });
                });
            };

            initialize = function() {
                if ($vcards.length >= 1 && !forceDefaultPosition) {
                    if ($vcards.length > 1) {
                        var max_lat  = 0, min_lat  = 999,
                            max_lng  = 0, min_lng  = 999,
                            lat_calc = 0, lng_calc = 0,
                            nb_coord = 0;

                        $vcards.each(function(){
                            var $vcard = $(this),
                                lat = $(".geo > .latitude", $vcard).html(),
                                lng = $(".geo > .longitude", $vcard).html();
                            if ( lat >= max_lat ) { max_lat = lat; }
                            if ( lng >= max_lng ) { max_lng = lng; }
                            if ( lat <= min_lat ) { min_lat = lat; }
                            if ( lng <= min_lng ) { min_lng = lng; }
                            lat_calc += parseFloat(lat);
                            lng_calc += parseFloat(lng);
                            nb_coord++;
                        });

                        if      (( ( max_lat - min_lat ) < 0.1 ) && ( ( max_lng - min_lng ) < 0.1 )) { zoom = 12; }
                        else if (( ( max_lat - min_lat ) < 0.5 ) && ( ( max_lng - min_lng ) < 0.5 )) { zoom = 10; }
                        else if (( ( max_lat - min_lat ) < 1   ) && ( ( max_lng - min_lng ) < 1   )) { zoom = 8;  }
                        else if (( ( max_lat - min_lat ) < 1.5 ) && ( ( max_lng - min_lng ) < 1.5 )) { zoom = 7;  }
                        else if (( ( max_lat - min_lat ) < 3   ) && ( ( max_lng - min_lng ) < 3   )) { zoom = 5;  }

                        if(lat_calc && lng_calc){
                            latitude = (lat_calc/nb_coord);
                            longitude = (lng_calc/nb_coord);
                        }
                    } else {
                        latitude = $vcards.first().find('.latitude').text();
                        longitude = $vcards.first().find('.longitude').text();
                    }
                }

                map = new google.maps.Map(canvas, {
                    scrollwheel: scrollWheel,
                    center: new google.maps.LatLng(
                        latitude,
                        longitude
                    ),
                    zoom: zoom,
                    maxZoom: maxZoom,
                    zoomControl: zoomControl,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle[zoomControlStyle]
                    },
                    mapTypeControl: mapTypeControl,
                    streetViewControl: streetViewControl,
                    panControl: panControl,
                    mapTypeId: google.maps.MapTypeId[mapTypeId]
                });

                if (showMarkers) {
                    addMarkers();
                    google.maps.event.addDomListener(document.getElementById('microformats'), 'change', addMarkers);

                    // adapter la vue aux professionnels marqués
                    map.fitBounds(bounds);
                }

                if (jsonDepartments != false) {
                    map.data.loadGeoJson(jsonDepartments, { idPropertyName: 'CODE_DEPT' });
                    map.data.setStyle(displayDepartment);

                    map.data.addListener('mouseover', highlightDepartment);
                    map.data.addListener('click', function (mapEvent) {
                        $('#googleMap').trigger('department.click', mapEvent);
                    });
                }
            };

            function displayDepartment(department) {
                var style = {
                    fillColor: '#fff',
                    fillOpacity: 0.0,
                    strokeWeight: 1,
                    strokeColor: '#000',
                    strokeOpacity: 0.5,
                    cursor: 'grab'
                };

                if (-1 != String(coveredDepartments).indexOf(department.getProperty('CODE_DEPT'))) {
                    // map.data.getFeatureById(coveredDepartments).getGeometry()
                    department.setProperty('isCovered', true);

                    style.fillColor = departmentColor;
                    style.fillOpacity = 0.3;
                    style.cursor = 'pointer';
                    style.clickable = true;
                }

                return style;
            }

            function highlightDepartment(e) {
                map.data.revertStyle();
                if (true === e.feature.getProperty('isCovered')) {
                    map.data.overrideStyle(e.feature, { fillOpacity: 0.6 });
                }
            }

            function closeAllInfoWindow(){
                $(infoWindows).each(function(index) {
                    infoWindows[index].close();
                });
            }

            function loadScript() {
                var script = document.createElement('script');

                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?callback=initialize&language=fr&region=FR&v=3'
                    + ((/^X+$/).test(GOOGLE_API_KEY) ? '' : '&key=' + GOOGLE_API_KEY);
                document.body.appendChild(script);
            }

            window.onload = loadScript();
        }
    });
})(jQuery);
