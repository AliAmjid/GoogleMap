
# aliamjid\google-map


How to install
---------------------
Add this to composer.json file

    aliamjid/google-map": "dev-master
You also need to add JavaScript file to your website. you will find it in

    /vendor/aliamjid/google-map/dist/GoogleMapHandler.js

How it can look like? 
------------------------
![enter image description here](https://i.imgur.com/cOU2vUf.jpg)

Example of full nette Component
-------------------------------------------

```php
use aliamjid\GoogleMap\GoogleMap;  
use aliamjid\GoogleMap\Objects\Config;  
use aliamjid\GoogleMap\Objects\DropMarkerIcon;  
use aliamjid\GoogleMap\Objects\Point;
.... use .... 
class CustomerMap extends GoogleMap {  
  private $idCustomer;  
  private $addressMapper;  
  
  public function __construct(  
  $name,  
 Container $container,  
 AddressMapper $addressMapper) {  
  $params = $container->getParameters();  
  //You need to construct parent with you Google Api Key
  parent::__construct($params['googleApiKey']); 
  //Inject your other deps. 
  $this->addressMapper = $addressMapper;  
 }  
  public function defineConfig() {  
  //You can also define config of, or can leave it empty
  $config = new Config();  
  $config->showFilters = false;  
  $this->setConfig($config);  
 }  
  public function defineFilters() {  
  //Here you can define filters
  //1st you need to create aliamjid\GoogleMap\Objects\Group
  $typeFilter = new Group('Address type');  
  //Than you can add filter to group
	$typeFilter->addFilter(  
	  'type_delivery_filter',  
	  'Delivery addresses',  
	  'address_type',  
	  'delivery'  
	);  
	//in finel step you need to register Group 
	$this->addFilterGroup($typeFilter);
 }  
 //In this method you need to define Points
 //This method is called by ajax from javascript, so its async cause of improovement of map performence
  public function definePoints() {  
 //Get your data from database
  $defaultAddress = $this->addressMapper->loadOneByCond(array('id_customer' => $this->idCustomer, 'type' => AddressType::DEFAULT_ADDRESS));  
  $deliveryAddress = $this->addressMapper->loadOneByCond(array('id_customer' => $this->idCustomer, 'type' => AddressType::DELIVERY_ADDRESS));  
  try {  
  
 //we call our custome method
  $this->addPointForAddress($defaultAddress);  
  
  $this->addPointForAddress($deliveryAddress);  
 } catch (Exception $e) {  
 } }  
 
//We create a custome method for adding address 
  private function addPointForAddress(Address $address) {
  //You need to define point 
  //Look to aliamjid\objects\Point class for more   
  $point = new Point(  
  $address->name,  
  //Cords, of point
  $address->lat,  
  $address->lng,  
  //DropMarkericon si clasic Google Map icon, you can define its color, and latter laso

  //Color is in Hex withou # symbol
  //DropMarkerIcon($symbol,$color)
  new DropMarkerIcon(),  
  '#',  
  $address->street . " " . $address->city . " " . $address->zip,  
  'This is' . AddressType::translate($address->type)  
 );  
 //Now you can data relation to point, for filtering the point
 //1st param os Key thats the "address_type" which we define in filter
 //2nd is Value if key in our case it can be delivery or default
 
 //Now if the user will turn on "delivery" filter, just point with value of delivery will show up.
 
  $point->addDataRelation('address_type','delivery');
  //In end you need to register point

  $this->addPoint($point);  
 }  
  public function setCustomer($idCustomer) {  
  $this->idCustomer = $idCustomer;  
 }}
```

Now we can create Component in presenter
```php
public function createComponentCustomerMap() {  
  return $this->customerMap;  
}
```
And than you just render it template
```php
{control customerMap}
```
And your map is ready.

Description of methods & classes
=================================

After you extend you class by **aliamjid\GoogleMap\GoogleMap** you need to define 3 compulsory methods

 - DefineConfig()
 - DefinePoints()
 - DefineFilters()

Define config
-----------------
This method isnt that important you can leave it empty. But its for defining of basic map configuration. You can **set map height,** or you can **hide filters**, if you dont need them. 

Example:
```php
public function defineConfig() {  
  $config = new Config();  
  $config->showFilters = false;  
  $config->mapHeight = 600;
  //You need to set config
  $this->setConfig($config);  
}
```
Define points
-------------------------
This is important one. 
You are defining points on map here. You need to give an lat & lng to point, give a icon and define description of point

So you start by creating an Point. You will do it like this

   ```php
   $point = new vendor/aliamjid/google-
  map/src/GoogleMap/Objects/Point(
$name, $lat, $lng, $icon, $nameRedirect = '',$address,$additonalComment = ''
);
 ```
 $lat & $lng are Cords of point
 
 ![enter image description here](https://i.ibb.co/TvMM68M/describe-map.png)

**How to set icons color and symbol ?**
You can use pre-created class

    GoogleMap/Objects/DropMarkerIcon
    
    $icon = new DropMarkerIcon($symbol,$color);
   If you would like to create own icon you can do it like this: 

   ```php
   class MyCustomeIcon extends aliamjid\GoogleMap\Objects\Icon {  
  
  public $src;  
  public function __construct() {  
  $this->src = "link/to/icon.png";  
 }}
 ```
 
 
