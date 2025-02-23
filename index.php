<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Strict//EN">
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title>Auto Parts</title>

    <script src="js/jquery/jquery.min.js"></script>
    <script src="app.js"></script>

    <style type="text/css">
        body, html, #parent, #container {
            height: 100%;
            margin:0;
            font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
            font-style: normal;
            font-weight: normal;
        }

        #parent {

            min-height:100%;
        }
        #head {
            min-height:5%;
            text-align:right;
            width:100%;
            //margin-left:15%;*/
        }

        #title {
            display:block;
            padding-top:5px;
            padding-right:1%;
            /*width:98%;*/
        }

        .left{
            float:left;
            height: 95%;
            overflow-y:auto;
            top: 0;


        }

        .left, #kwList, #autoList {
            border-style: solid;
            border-width: 1px;
            border-color: #aaa;
            box-sizing:border-box;
        }

        .left div {
            margin: 5px;
        }

        #right{
            width:25%;
            background-image: url(auto/1.png);
            background-repeat: no-repeat;
            position: relative;

        }
        #center{
            width:25%;
            background-repeat: no-repeat;
            background-image: url(auto/2.jpg);
            background-size:110%;
            background-position: 20%;
        }

        #left{
            width:50%;
            background-repeat: no-repeat;
            background-image: url(auto/3.jpg);
            background-size:180%;
            background-position: 20%;
        }

        #keywords {display:none}

        #partImgCntnt{
            position:relative;
            margin:0;

        }

        #partImgNav{
            position:absolute;
            width:100%;
            height: 100%;
            top:0;
            left:0;

            text-align: center;
            display: block;
            margin:0;
        }

        #nextImg{
            float:right;
            height: 100%;
            width: 10%;
            text-align:right;
            vertical-align: middle;
            background-color: #000000;
            opacity:0.2;
            margin:0;
            line-height: 38px;



        }
        #prevImg{
            float:left;
            height: 100%;
            width: 10%;
            background-color: #000000;
            opacity:0.2;
            text-align:left;
            vertical-align: middle;

            margin:0;
            line-height: 38px

        }

        #part_price {
            font-size: 32px;
            text-align:right;
        }
        #partImgUrl {
            margin:0;
            padding:0
        }
        #nextPart{float:right}
        #prevPart{float:left}

        #parts ul, #cars ul{
            list-style-type: none;
            margin: 0;
            padding: 0;
        }



        #parts li a, #cars li a{
            text-decoration: none;
            color: #000;
            -webkit-transition: font-size 0.3s ease, background-color 0.1s ease;
            -moz-transition: font-size 0.3s ease, background-color 0.1s ease;
            -o-transition: font-size 0.3s ease, background-color 0.1s ease;
            -ms-transition: font-size 0.3s ease, background-color 0.1s ease;
            transition: font-size 0.3s ease, background-color 0.1s ease;
        }

        #parts li a:hover, #cars li a:hover{
            font-size: 20px;
            /*background: #f6f6f6;*/
        }
        #kontakti {

            position: absolute;
            bottom: 2px;
            text-align: right;
            width:90%;
        }

        #part_desc1, #part_code {
            font-size: 0.8em;
        }

        #part_title {
            font-size:1.6em;
        }

    </style>
 </head>

<body>

<div id="parent">
    <div id="container">
        <div id="head"><div id="title">DIDŽA GARĀŽA</div></div>
        <div id="right" class="left">
            <div id="carsTitle">AUTO</div>
            <div id="cars"></div>
            <div id="kwTitle">ATSLĒGAS VĀRDI</div>
            <div id="keywords"></div>
            <div id="kontakti">tel: 2 9945987</div>
        </div>
        <div id="center" class="left">
            <div id="partsTitle">VISAS DETAĻAS</div>
            <div id="parts"></div>
        </div>
        <div id="left" class="left">
            <div id="partTitle">DETAĻA</div>
            <div id="partDescription"></div>
        </div>
    </div>
</div>
</body>
