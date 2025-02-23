<?php
/**
 * Created by PhpStorm.
 * User: didzis.i5
 * Date: 14.27.5
 * Time: 02:59
 */

ini_set('display_errors', '0');

$dataObject= isset($_POST['jsonString']) ? json_decode($_POST['jsonString']) : die;
$cat=(int)$dataObject->cat;

include_once "auto.class.php";
$auto=Factory::new_car_obj();

//$auto->updatePhotosInDB();



switch ($cat){
    case 1:
        if (isset($dataObject->subcat)){

            $auto->listUnlistedPhotos();
        }
        else{
            $auto->listAllPhotos();
        }
        break;

    case 2:
            $auto->insertPart($dataObject);
            echo json_encode("part inserted");
        break;
    case 3:
        $auto->listAllKeywords();
        break;
    case 4:
        $auto->listCars();
        break;
    case 5:
        $auto->listPartsByCarID($dataObject->subcat);
        break;

}

?>