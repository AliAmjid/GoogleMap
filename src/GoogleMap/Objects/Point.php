<?php

namespace aliamjid\GoogleMap\Objects;


class Point {
	/** @var string */
	public $name;

	/** @var string */
	public $additonalComment;

	/** @var float */
	public $lat;

	/** @var float */
	public $lng;

	/** @var Icon */
	public $icon;

	/** @var string */
	public $nameRedirect;

	/** @var \stdClass */
	public $data;

	public function __construct($name, $lat, $lng, $icon, $nameRedirect, $data,$additonalComment) {
		$this->name = $name;
		$this->lat = $lat;
		$this->lng = $lng;
		$this->icon = $icon;
		$this->nameRedirect = $nameRedirect;
		$this->data = $data;
		$this->additonalComment = $additonalComment;
	}
}