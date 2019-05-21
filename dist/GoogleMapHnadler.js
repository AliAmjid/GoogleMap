var GoogleMapHandler = function () {
	$.nette.init();
	var data;
	var map;
	var markers = [];
	this.initMap = function () {
		this.handleSubmitButton();

		var center = {lat: 50.083433, lng: 14.420596};
		map = new google.maps.Map(document.getElementById('map'), {
			center: center,
			zoom: 7.4,
			maxZoom: 15
		});

		$('.google-map-form').submit();

		$.nette.ext('.google-map-form', {
			success: function (data) {
				console.log(data);
			}
		});
	};

	this.handleSubmitButton = function () {
		$('.map-submit').click(function (e) {
			e.preventDefault();
		});
	};
	this.createPoints = function (map, data) {
		try {
			var data = JSON.parse(data);
		} catch (e) {
			var data = data;
		}

		var contentString = [];
		var bounds = new google.maps.LatLngBounds();
		var infowindow = new google.maps.InfoWindow();
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			console.log(item);
			var icon = {
				url: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + item['letter'] + '|' + item['color']
			};
			var specialHtml;
			if (typeof item['additionalComment'] !== 'undefined') {
				specialHtml = item['additionalComment']
			}
			contentString[i] = '<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h2 id="firstHeading" class="firstHeading">' + item['name'] + '</h2>' +
				'<div id="bodyContent">' +
				'<p>Adresa: ' + item['address'] + '</p>' +
				'<a href="' + "https://www.google.com/maps/dir/?api=1&destination=" + item['lat'] + "," + item['lng'] + "&travelmode=driving" + '" target="_blank" >Zobrazit cestu k zákazníkovi</a></div>' + specialHtml;
			var marker = new google.maps.Marker({
				map: map,
				position: {lat: parseFloat(item['lat']), lng: parseFloat(item['lng'])},
				icon: icon
			});
			markers.push(marker);
			var loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
			bounds.extend(loc);
			google.maps.event.addListener(marker, 'click', (function (marker, i) {
				return function () {
					infowindow.setContent(contentString[i]);
					infowindow.open(map, marker);
				}
			})(marker, i));
		}
		this.showMap();
		if (markers.length != 0) {
			map.fitBounds(bounds);
			map.panToBounds(bounds);
		}

	};
	this.deletePoints = function () {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	};
	this.showMap = function () {
		var map = document.getElementById("map");
		map.style.height = "600px";
		map.style.width = "100%";
		if (document.getElementById("loader")) {
			document.getElementById("loader").style.display = "none";
		}
	};

	this.handleBasicBehaviorOfFilters = function () {
		$('.checkbox-controler').click(function () {
			console.log('changeed');
			if($(this).is(':checked')) {
				$(this).parent().next().find('input').prop("checked", true);
			} else {
				$(this).parent().next().find('input').prop("checked", false);

			}
		});
	};
};

$(document).ready(function () {
	console.log(filtersConfig);
	var GHP = new GoogleMapHandler();
	GHP.initMap();
	GHP.showMap();
	GHP.handleBasicBehaviorOfFilters();
});