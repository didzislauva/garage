<?php

//class Factory
//{
//    static function new_car_obj($id=NULL) {
//        return new auto(Conn::get_conn(),$id);
//    }
//}

//class Conn {
//    private static $conn = NULL;
//
//    private function __construct() {}
//
//    private static function config() {
//        $conf = array();
//        $conf['dsn']     = 'sqlite:auto.sql';
//        return $conf;
//    }
//
//
//    private static function init() {
//        $conf = self::config();
//        try {
//            self::$conn = new PDO($conf['dsn']);
//        }
//        catch (PDOException $e) {
//                echo $e->getMessage();
//        }
//    }
//
//    public static function get_conn() {
//        if (!self::$conn) { self::init(); }
//        return self::$conn;
//    }
//}

class Core {
    public $dbh; // handle of the db connexion
    private static $instance;
    private function __construct()
    {
        $dsn ='sqlite:autos';
        $this->dbh = new PDO ($dsn);
    }

    public static function getInstance()
    {
        if (!isset(self::$instance))
        {
            $object = __CLASS__;
            self::$instance = new $object;
        }
        return self::$instance;
    }
}

class auto{
    private $db;
//    function auto(&$db){
//        $this->db=&$db;
//    }



//    function __construct()
//    {
//        //
//    }
    //query builder///////////////////////////////////////////////////////
    private function listIt($query,$paramArray=NULL){



        $this->db=Core::getInstance()->dbh;

        if (count($paramArray)==0){

            $stmt=$this->db->query($query);

            //$stmt=$this->db->query($query);
            $rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->returnJson($rows);
        }
        else {
            $stmt=$this->db->prepare($query);
            $i=1;
            foreach ($paramArray as $value) {
                $stmt->bindValue($i,$paramArray[$i-1],PDO::PARAM_STR);
                $i++;
            }
            $stmt->execute();
            $rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
            $this->returnJson($rows);
        }

    }
    /////////////////////////////////////////////////////////////////////

    //prepared queries//
    function listCars() {
        $query="SELECT * FROM Auto";
        $this->listIt($query);
    }
    function listAllKeywords() {
        $query="SELECT * FROM keywords";
        $this->listIt($query);
    }
    function listPartsByCarID($id){
        $query="SELECT * FROM AutoParts WHERE auto_id=?";
        $this->listIt($query,array((int)$id));
    }
    function listComments($id){
        $query="SELECT * FROM AutoParts_Comments WHERE AutoPart_id=?";
        $this->listIt($query,array((int)$id));
    }
    function listPartImgUrls($id){
        $query="SELECT * FROM AutoParts_imgs WHERE AutoPart_id=?";
        $this->listIt($query,array((int)$id));
    }
    function listPartsByKeyword($id){
        $query="SELECT * FROM AutoParts
                JOIN Autoparts_Keywords ON Autoparts.ID=Autoparts_Keywords.autopartID
                JOIN keywords ON Autoparts_keywords.keywordID=keywords.id
                where keywordID=?";
        $this->listIt($query,array((int)$id));
    }
    function listAllPhotos() {
        $query="SELECT * FROM AutoParts_imgs";
        $this->listIt($query);
    }

    function listUnlistedPhotos() {
        $query="SELECT * FROM AutoParts_imgs where added=0";
        $this->listIt($query);
    }


    function insertPart($dObj) {
        // insert part
        $queryStrings=" INSERT INTO AutoParts
                                ('auto_id',
                                'part_price',
                                'part_name',
                                'part_desc1',
                                'part_desc2'
                                )
                        VALUES
                                (
                                $dObj->auto_id,
                                $dObj->price,
                                '$dObj->title',
                                '$dObj->desc1',
                                '$dObj->code'
                                )";
        $this->db->query($queryStrings);
        $part_id = $this->db->lastInsertId();

        // update image
        $queryStrings="UPDATE AutoParts_imgs SET
                            'added'=1,
                            'AutoPart_id' = $part_id
                      WHERE
                             img_url = '$dObj->url'";

        $this->db->query($queryStrings);

        // update keywords
        $sql = "INSERT INTO AutoParts_keywords (autopartID, keywordID) VALUES (:partID, :keywordID)";
        $sth=$this->db->prepare($sql);
        foreach ($dObj->keyWords as $keywordID){
            $sth->bindParam(':partID',$part_id, PDO::PARAM_INT);
            $sth->bindParam(':keywordID',$keywordID,PDO::PARAM_INT);
            $sth->execute();
        }
    }

    private function returnJson($array) {
        echo  json_encode($array);
    }

    function updatePhotosInDB() {
        // get file list from directory
        $faili_no_dir=array();
        $path="auto/parts";
        if ($handle = opendir($path)) {
            while (false !== ($entry = readdir($handle))) {
                if ($entry != "." && $entry != "..") {
                    array_push($faili_no_dir,"auto/parts/".$entry);
                }
            }
            closedir($handle);
        }

        // get file list from db
        $query="select * from AutoParts_imgs";
        $stmt=$this->db->query($query);
        $fetch=$stmt->fetchAll();
        $faili_no_db=array();
        foreach ($fetch as $result) {
            array_push($faili_no_db,$result["img_url"]);
        }

        // do search for each file in dir. if unlisted, insert in db.
        foreach ($faili_no_dir as $fails){
            $querystring="INSERT INTO AutoParts_imgs ('added', 'AutoPart_id', 'img_url') VALUES (0, null, '$fails')";
            $this->db->prepare($querystring);
            if (array_search($fails,$faili_no_db)===false){
                $this->db->query($querystring);
            }
        }
    }


    private function placeholders($text, $count=0, $separator=","){
        $result = array();
        if($count > 0){
            for($x=0; $x<$count; $x++){
                $result[] = $text;
            }
        }

        return implode($separator, $result);
    }


}
?>