<?php
namespace aliamjid\GoogleMap\Objects;

class DropMarkerIcon extends Icon {

	public $src;
	public function __construct($color,$symbol) {
		$this->src = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=$symbol|$color";
	}
}