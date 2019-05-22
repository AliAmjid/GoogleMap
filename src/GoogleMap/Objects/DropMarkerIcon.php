<?php
namespace aliamjid\GoogleMap\Objects;

class DropMarkerIcon extends Icon {

	public $src;
	public function __construct($symbol = '%E2%80%A2',$color = 'ff0000') {
		$this->src = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=$symbol|$color";
	}
}