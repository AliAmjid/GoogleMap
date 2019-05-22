<?php


namespace aliamjid\GoogleMap\Objects;


class Group {

	/** @var string */
	public $name;
	/** @var Filter[] */
	public $filters;

	public function __construct($name) {
		$this->name = $name;
	}

	public function addFilter($name, $displayedName, $dataRelation, $trueValue, $underlineColor = 'ffffff') {
		$this->filters[] = new Filter($name, $displayedName, $dataRelation, $trueValue, $underlineColor);
		return $this;
	}

}