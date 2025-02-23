<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Strict//EN">
<html lang="en-US">
<head>
    <meta charset="UTF-8">
    <title>Auto Parts</title>

    <script src="js/jquery/jquery.min.js"></script>
    <script src="adminDLs.js"></script>

    <style type="text/css">
        .left{
            float:left;
            height: 95%;
            overflow-y:auto;
            top: 0;
        }


        .left {
            border-style: solid;
            border-width: 1px;
            border-color: #aaa;
            box-sizing:border-box;
        }

        #left {
            width: 20%;
        }

        #right {
            width: 80%;
        }

    </style>


</head>
<body>

<div id="container">
    <div id="left" class="left">
        <div>CARS</div>
        <div id="unlisted_imgs">UNLISTED IMAGES</div>
        <div>PARTS</div>
    <div id="photolist">liste</div>
    </div>

    <div id="right" class="left">
        <div id="photoInfo">
        </div>
    </div>
</div>
</body>
</html>