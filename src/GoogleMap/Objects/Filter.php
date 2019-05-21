<?php
namespace aliamjid\GoogleMap\Objects;


class Filter {
	public $name;
	public $displayedName;
	public $dataRelation;
	public $trueValue;
	public $underlineColor;

	public function __construct($name, $displayedName, $dataRelation, $trueValue, $underlineColor = 'ffffff') {
		$this->name = $name;
		$this->dataRelation = $dataRelation;
		$this->trueValue = $trueValue;
		$underlineColor = $underlineColor;
	}
}