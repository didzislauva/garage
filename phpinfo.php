<?php

if (!defined('PDO::ATTR_DRIVER_NAME')) {
    echo 'PDO unavailable';
}
phpinfo();

include_once "auto.class.php";
$auto=new auto;

$auto->listPartsByCarID(1);
?>