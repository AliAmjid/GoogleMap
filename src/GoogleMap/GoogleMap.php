<?php
namespace aliamjid\GoogleMap;

use aliamjid\GoogleMap\Objects\Config;
use aliamjid\GoogleMap\Objects\Group;
use aliamjid\GoogleMap\Objects\Point;
use Nette\Application\UI\Control;
use Nette\Application\UI\Form;

abstract class GoogleMap  extends Control implements IGoogleMap {
	/** @var string */
	protected $apiKey;
	/** @var \stdClass */
	protected $config;
	/** @var Point[] */
	protected $points;
	/** @var Group[] */
	protected $filterGroups;

	public function __construct($apiKey) {
		$this->apiKey = $apiKey;
		$this->config = new Config();
		$this->filterGroups = array();
	}

	public function render() {
		$this->template->apiKey = $this->apiKey;
		$this->defineFilters();
		$this->defineConfig();
		$this->template->config = $this->config;
		$this->template->filters = $this->filterGroups;
		$this->template->render(__DIR__ . '/template/default.latte');
	}

	protected function addFilterGroup(Group  $group) {
		$this->filterGroups[] = $group;
		return $this;
	}

	protected function addPoint(Point $point) {
		$this->points[] = $point;
	}

	protected function setConfig(Config $config) {
		$this->config =  $config;
	}

	public function createComponentFilterForm() {
		$form = new Form();
		foreach ($this->filterGroups as $group) {
			foreach ($group->filters as $filter) {
				$form->addCheckbox($filter->name);
			}
		}
		$form->onValidate[] = array($this, 'filterFormSubmitted');
		return $form;
	}

	public function filterFormSubmitted($form) {
		$this->definePoints();
		$this->presenter->sendJson((array)$this->points);
	}
}