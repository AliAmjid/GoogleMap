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

	/** @var array */
	public $data;

	/** @var string */
	public $address;

	public function __construct($name, $lat, $lng, $icon, $nameRedirect = '',$address,$additonalComment = '') {
		$this->name = $name;
		$this->lat = $lat;
		$this->lng = $lng;
		$this->icon = $icon;
		$this->nameRedirect = $nameRedirect;
		$this->additonalComment = $additonalComment;
		$this->address = $address;
	}

	public function addDataRelation($key,$value) {
		$this->data[$key] = $value;
		return $this;
	}


}