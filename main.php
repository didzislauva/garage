
<?php
//ini_set('display_errors', '0');

include_once "auto.class.php";
$auto=new auto;
$auto->listCars();

$dataObject= isset($_POST['jsonString']) ? json_decode($_POST['jsonString']) : die;
$cat=(int)$dataObject->cat;

//$cat=3;
//$dataObject->subcat=1;

switch ($cat){
    case 1:
        if (isset($dataObject->subcat))     //if car is specified, all parts returned
        {
            $id=(int)$dataObject->subcat;
            $auto->listPartsByCarID($id);
        }
        else {                              //else all cars are returned
            $auto->listCars();
        }

        break;


    case 2:
        if (isset($dataObject->subcat)){    // show parts for specified keword id
            $id=(int)$dataObject->subcat;
            $auto->listPartsByKeyword($id);
        }
        else {                              // else show list with all keywords
            $auto->listAllKeywords();
        }
        break;

    case 3:
        if (isset($dataObject->subcat)){
            $id=(int) $dataObject->subcat;
            $auto->listPartImgUrls($id);
        }
        break;


}


?>