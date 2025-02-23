window.DL = window.DL || {  cars: {} };

(function(DL) {

    function con(info){
        console.log(info)
    }


    // helper function, returns info from php file.
    function returnInfo(dataObject,callback) {
        var jsonString=JSON.stringify(dataObject);

        $.post( "main.php",
            {
                jsonString: jsonString //auto or part or keyword
            },

            function( data ) {
                //con(data);
                var cat=dataObject["cat"];
                var subcat=dataObject["subcat"];
                switch (cat){
                    case 1:
                        subcat ? DL.parts=data : DL.autos=data;     // subcat present -> return part, otherwise return autolist
                        break;
                    case 2:
                        subcat ? DL.parts=data : DL.allKeywords=data;   //subcat present -> return parts, otherwise return all keywords
                        break;
                    case 3:
                        DL.imgList=data;
                }
                callback();
            },
            "json"
        ).fail(function(){
                con("failed");
            })
    }

    //control function.
    function showParts(keywordID){
        $("#parts").empty();

        if (keywordID){
            var dObject={"cat":2,"subcat":DL.keyWordID}

        }
        else
        {
            var dObject={"cat":1,"subcat":DL.autoID}
        }
        returnInfo(dObject,listParts);
    }

    //view cars
    function listCars(){

        var autoList=$("<div>",{id:"autoList"});
        var autoUL=$("<ul>",{id:"autoUL"});

        var items = [];
        $(DL.autos).each(function(index, element){
            items.push('<li class="dataLI" data-id="'+DL.autos[index]["ID"]+'">' + element["Marka"] + '</li>');
        })

        autoUL.append(items.join(''));
        autoList.append(autoUL);
        $("#cars").append(autoList);

        $(".dataLI").off().on("click",function(){
            $("#partDescription").empty();
            var id=$(this).attr("data-id");
            DL.autoID=Math.abs(id); //dirty hack to convert text to positive integer.
            showParts(false);
        });
    }

    //view parts
    function listParts(){

        var partList=$("<div>",{id:"partList"});
        var partUL=$("<ul>",{id:"partUL"});
        var items = [];
        $(DL.parts).each(function(index, element){
            items.push('<li class="partLI" data-cid="'+index+'" data-id="'+element["ID"]+'"><a href="#">' + element["part_name"] + '</a></li>');
        })
        partUL.append(items.join(''));
        partList.append(partUL);

        $("#parts").append(partList);

        $(".partLI").off().on("click",function(){
            var cid=$(this).attr("data-cid");
            DL.activePart=cid;
            showOnePart()
        })
    }

    //view keywords
    function listKeywords() {
        var kwList=$("<div>",{id:"kwList"});
        var kwUL=$("<ul>",{id:"kwUl"});

        var items = [];
        $(DL.allKeywords).each(function(index, element){
            items.push('<li class="kwLI" data-id="'+element["id"]+'">' + element["keyword"] + '</li>');
        })
        kwUL.append(items.join(''));
        kwList.append(kwUL);

        $("#keywords").append(kwList);

        $(".kwLI").off().on("click",function(){
            var id=$(this).attr("data-id");
            $("#partDescription").empty();
            DL.keyWordID=Math.abs(id); //dirty hack to convert text to positive integer.
            showParts(id);
        })

    }


    function listPart() {
        var partImgCntnt=$("<div>",{id:"partImgCntnt"});
        var partImgNav=$("<div>",{id:"partImgNav"});
        var partImgUrl=$("<div>",{id:"partImgUrl"});


        var partDesc=$("<div>",{id:"partDesc"});

        var partTitle=$("<div>",{id:"part_title"});
        var partDesc1=$("<div>",{id:"part_desc1"});
        var partDesc2=$("<div>",{id:"part_code"});
        var partPrice=$("<div>",{id:"part_price"});


        partTitle.append(DL.parts[DL.activePart].part_name);
        partDesc1.append(DL.parts[DL.activePart].part_desc1);
        partDesc2.append("kods: "+DL.parts[DL.activePart].part_desc2);
        partPrice.append(DL.parts[DL.activePart].part_price+" eur");

        partDesc.append(partTitle);
        partDesc.append(partDesc1);
        partDesc.append(partDesc2);
        partDesc.append(partPrice);



        var partNext=$("<div>", {id:"nextPart", class:"partNav"}).hide();
        partNext.append(">>");

        var partPrev=$("<div>", {id:"prevPart", class:"partNav"}).hide();
        partPrev.append("<<");

        //adding image container with image and nav

        var imgNext=$("<div>", {id:"nextImg"});
        var imgPrev=$("<div>", {id:"prevImg"});
        imgNext.append("");
        imgPrev.append("");


        $(partImgNav).hide().append(imgNext);
        $(partImgNav).append(imgPrev);

        $(partImgCntnt).append(partImgUrl);
        ///////////////////////////////////////////

        //adding subdivs to main div
        $("#partDescription").append(partImgCntnt);
        $("#partDescription").append(partDesc);
        $("#partDescription").append(partNext);
        $("#partDescription").append(partPrev);



        $("#partImgCntnt").append(partImgNav);




        $("#nextPart").off().on("click", function() {
            DL.activePart++;
            if (DL.activePart>=DL.parts.length){
                DL.activePart=0;
            }
            showOnePart()
        })

        $("#prevPart").off().on("click", function() {
            con("prev");
            DL.activePart--;
            if(DL.activePart<0){
                DL.activePart=DL.parts.length-1;
            }
            showOnePart();
        })



        $("#nextImg").off().on("click", function() {
            DL.activeImg++;
            if (DL.activeImg>=(DL.imgList.length)) {
                DL.activeImg=0;
            }
            urls = encodeURI(DL.imgList[DL.activeImg].img_url);
            console.log(urls);
            var imgTag=$("<img>", {src:urls, width:$("#partImgCntnt").width(), id:"partImg"})
            $("#partImgUrl").empty().append(imgTag);
        })

        $("#prevImg").off().on("click", function() {
            DL.activeImg--;
            if(DL.activeImg<0){
                DL.activeImg=DL.imgList.length-1;
            }
            urls = encodeURI(DL.imgList[DL.activeImg].img_url);
            console.log(urls);
            var imgTag=$("<img>", {src:urls, width:$("#partImgCntnt").width(), id:"partImg"})
            $("#partImgUrl").empty().append(imgTag);
        })

        $("#nextImg").mouseover(function(){
            $(this).css("opacity", 0.5);
        }).mouseout(function(){
                $(this).css("opacity",0.2)
            });

        $("#prevImg").mouseover(function(){
            $(this).css("opacity", 0.5);
        }).mouseout(function(){
                $(this).css("opacity",0.2)
            });

    }



    function updateImages(){

        if (DL.imgList.length>0){       //if there is no image for particular part
            urls = encodeURI(DL.imgList[0].img_url);
            console.log(urls);
            var imgTag=$("<img>", {src:urls, width:$("#partImgCntnt").width(), id:"partImg"})
            $("#partImgUrl").append(imgTag);
        }


        if (DL.imgList.length>1){       // hide nav arrows, if only one img in list
            $("#partImgNav").show();
        }

        if (DL.parts.length>1){
            $(".partNav").show();
        }
        DL.activeImg=0;

        $(window).on("resize", function(){

            $("#partImg").css("width", $("#partImgCntnt").width()+"px");
        })

    }

    function showOnePart(){
            $("#partDescription").empty();
            listPart();

            var dObject={"cat":3, subcat:Math.abs(DL.parts[DL.activePart].ID)};
            returnInfo(dObject,updateImages)
    }

    function showAllKeywords() {
        var dObject={"cat":2};
        returnInfo(dObject, listKeywords);
    }

    function showAutos(){
        var dObject={"cat":1};
        returnInfo(dObject,listCars);
    }


    $(document).ready(function() {
        showAutos();
        showAllKeywords();

        $("#carsTitle").click(function() {
            $("#cars").toggle();
            $("#partDescription").empty();
        })

        $("#kwTitle").click(function() {
            $("#keywords").toggle();
            $("#partDescription").empty();
        })
    })

})(window.DL)