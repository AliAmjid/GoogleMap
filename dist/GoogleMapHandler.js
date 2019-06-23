var GoogleMapHandler = function () {
	var data;
	var map;
	var markers = [];
	var lastClickedTime = 10000;

	this.init = function () {
		try {
			$.nette.init();
		} catch (e) {
		}
		var _this = this;
		this.handleSubmitButton();
		this.handleBasicBehaviorOfFilters();
		var center = {lat: 50.083433, lng: 14.420596};
		map = new google.maps.Map(document.getElementById('aa-map'), {
			center: center,
			zoom: 7.4,
			maxZoom: 15
		});
		$('.google-map-form').submit();
		$.nette.ext('.google-map-form', {
			success: function (data) {
				_this.data = data;
				_this.createPoints(map, data);
				$('.google-map-wrapper').trigger('aa-GoogleMap.loaded');
			}
		});
	};
	this.handleSubmitButton = function () {
		var _this = this;
		$('.map-submit').click(function (e) {
			e.preventDefault();
			_this.fireFilterProcess();
		});

		$('.google-map-form').find('label').click(function () {
			if($('#aa-map-autofilter').is(':checked')) {
				lastClickedTime = 0;
			}
		});

		setInterval(function () {
			lastClickedTime += 100;
			if(lastClickedTime == 600 ) {
				_this.fireFilterProcess();
			}
		},100);
	};

	this.fireFilterProcess = function () {
		var _this = this;

		var dataForRender = [];
		var applyedFilters = _this.getApplyedFilterParams();
		_this.data.forEach(function (point) {
			var votesForAdding = 0;
			Object.keys(applyedFilters).forEach(function (key) {
				var pointShoudBeAddedByInnerGroupFilter = false;
				applyedFilters[key].forEach(function (filter) {
					if (_this.isPointValidWithFilter(filter, point)) {
						pointShoudBeAddedByInnerGroupFilter = true;
					}
				});
				if (pointShoudBeAddedByInnerGroupFilter) {
					votesForAdding++;
				}
			});
			if (votesForAdding >= Object.keys(applyedFilters).length) {
				dataForRender.push(point);
			}
		});
		_this.deletePoints();
		_this.createPoints(map, dataForRender);
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
			var icon = {
				url: item.icon.src
			};
			var specialHtml = item.additonalComment;
			contentString[i] = '<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<a href="' + item.nameRedirect + '"><h2 id="firstHeading" class="firstHeading">' + item.name + '</h2></a>' +
				'<div id="bodyContent">' +
				'<p>Adresa: ' + item.address + '</p>' +
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
		var map = document.getElementById("aa-map");
		map.style.height = "600px";
		map.style.width = "100%";
		if (document.getElementById("loader")) {
			document.getElementById("loader").style.display = "none";
		}
	};
	this.handleBasicBehaviorOfFilters = function () {
		$('.checkbox-controler').click(function () {
			if ($(this).is(':checked')) {
				$(this).parent().next().find('input').prop("checked", true);
			} else {
				$(this).parent().next().find('input').prop("checked", false);
			}
		});
	};
	this.getApplyedFilterParams = function () {
		var applyedFilters = [];
		filtersConfig.forEach(function (group) {
			group.filters.forEach(function (filter) {
				if ($('.google-map-form').find('input[name='+filter.name+']').is(':checked')) {
					try {
						applyedFilters[filter.dataRelation].push(filter);
					} catch (e) {
						applyedFilters[filter.dataRelation] = [];
						applyedFilters[filter.dataRelation].push(filter);
					}
				}
			})
		});
		return applyedFilters;
	};
	this.isPointValidWithFilter = function (filter, point) {
		var pointParamValue = point.data[filter.dataRelation];
		if (pointParamValue == null) {
			return false;
		}
		if (pointParamValue == filter.trueValue) {
			return true;
		}
		return false;
	}
};
$(document).ready(function () {
	if ($('.google-map-wrapper').length) {
		var GHP = new GoogleMapHandler();
		GHP.init();
	}
});