/**
 * Created by didzis.i5 on 14.27.5.
 */
window.DLA = window.DLA || {  cars: {} };

(function(DLA){

    function con(text){
        console.log(text);
    }

    function returnInfo(dataObject, callback, args) {
        var jsonString=JSON.stringify(dataObject);

        $.post( "helper.php",
            {
                jsonString: jsonString //auto or part or keyword
            },

            function( data ) {
                //con(data);
                var cat=dataObject["cat"];
                var subcat=dataObject["subcat"];
                switch (cat){
                    case 1:
                        DLA.imageList=data;     // subcat present - return only unlisted images
                        break;
                    case 2:                     //send object to php
                        console.log("updated");
                        break;
                    case 3:
                        DLA.keyWords = data;
                        break;
                    case 4:
                        DLA.cars = data;
                        break;
                    case 5:
                        DLA.parts=data;
                        break;
                }
                if (callback) callback(args);
            },
            "json"
        ).fail(function(){
                con("failed");
            })
    }

    function listPhotos(){
        con(1);
        var items =[];
        $("#photoInfo").empty();
        $("#photolist").empty();
        $(DLA.imageList).each(function(index, element){
            items.push('<li class="dataLI" data-cid="'+index+'" >' +DLA.imageList[index]["img_url"].split("/")[2] + '</li>');
        })
        $("#photolist").append(items);
        //con(items);


        $(".dataLI").off().on("click",function(){
            var cid=$(this).data("cid");
            showNewPartForm(cid)
        })


    }

    function showKeywords(){
        var dObject={cat:3}   //3- list keywords
        returnInfo(dObject,listKeywords);
    }

    function listKeywords(){
        var items =[];
        $(DLA.keyWords).each(function(index, element){
            items.push('<input type="checkbox" class="dataChck" data-cid="'+index+'" >' +DLA.keyWords[index]["keyword"] + '</input>');
        })
        var $cntn=$("<div>",{id:"keyw_cntn"}).append(items);
        $("#photoInfo").append($cntn);

    }

    function listCars(showParts){
        var items =[];
        $(DLA.cars).each(function(index, element){
            items.push('<input type="radio" class="car_radio" name="cars" data-cid="'+index+'" >' +DLA.cars[index]["Marka"] + '</input>');
        })

        $("#carList_cntn").remove();

        var $cntn=$("<div>",{id:"carList_cntn"}).append(items);
        $("#photoInfo").append($cntn);

        if (showParts==true){
            $(".car_radio").on("change", function(){
                var cid=$(this).data("cid");
                var id=DLA.cars[cid]["ID"];
                con(id);

                var dObject={
                    cat:5,
                    subcat:id
                }
                returnInfo(dObject, listPartsForCar);
            })
        }
    }

    function listPartsForCar(){
        var items=[];
        $(DLA.parts).each(function(index, element){
            items.push('<input type="radio" class="part_radio" name="parts" data-cid="'+index+'" >' +DLA.parts[index]["part_name"] + '</input>');
        })

        $("#partList").remove();
        var $cntn=$("<div>",{id:"partList"}).append(items);
        $("#photoInfo").append($cntn);

        $(".part_radio").off().on("click", function(){
            var id=$(this).data("cid");
            con(DLA.parts[id]);
            //todo list part in separate view
        })

    }

    function showNewPartForm(cid) {
        showKeywords();
        var $toggle=$("<div>", {id:"new_existing_toggle"});


        var $photoImg=$("<div>", {id:"photoImg"});
        var $title=$("<div>", {id:"title"});
        var $desc1=$("<div>", {id:"desc1"});
        var $code=$("<div>", {id:"code"});
        var $price=$("<div>", {id:"price"});
        var $submit=$("<div>", {id:"submit"});



        $("#photoInfo").empty();


        $new=$("<div>", {id:"new"}).append("Create new").appendTo($toggle).hide();
        $existing=$("<div>", {id:"existing"}).append("Choose from existing").appendTo($toggle);

        var $container=$("<div>", {id:"form_cnt"}).appendTo("#photoInfo");

        $photoImg.append("<img width='80%' src='"+DLA.imageList[cid].img_url+"'</img>").appendTo($container);
        $toggle.appendTo($container);

        $title.append("<input value='title' id='title_input'>").appendTo($container);
        $desc1.append("<textarea id='desc_text'>").appendTo($container);

        $("#desc_text").append("description");

        $code.append("<input value='code' id='code_input'>").appendTo($container);
        $price.append("<input value='price' id='price_input'>").appendTo($container);
        $submit.append("<input type='button' value='Save' id='save_new'>").appendTo($container);

        var dObject={cat:4}
        returnInfo(dObject, listCars, false);


        $("#new").on("click",function(){
            $new.toggle();
            showNewPartForm(cid);
        })

        $("#existing").on("click",function(){
            $submit.empty();
            $("#keyw_cntn").remove();
            $submit.append("<input type='button' value='Save' id='save_existed'>").appendTo($container);
            $title.remove();
            $desc1.remove();
            $code.remove();
            $price.remove();
            $new.toggle();
            $existing.toggle();
            var dObject={
                cat:4
            };
            returnInfo(dObject,listCars, true);

            $("#save_existed").off().on("click", function(){
                update(cid);
            })
        })

        $("#save_new").on("click", function(){
            var dObject={
                cat: 2,     //new part in db
                subcat: "",
                url:DLA.imageList[cid].img_url,
                title:$("#title_input").val(),
                desc1:$("#desc_text").val(),
                code:$("#code_input").val(),
                price:$("#price_input").val(),
                auto_id:1
            }
            dObject.subcat= 1;  //TODO insert or update if existing part view


            var keywordIDs=[];
            $(".dataChck:checked").each(function(){
                con($(this).data("cid"));
                keywordIDs.push(DLA.keyWords[$(this).data("cid")].id);
                //keywordIDs.push($(this).data("cid"));
            });

            var autoIDs=[]
            $(".car_radio:checked").each(function(){
                con($(this).data("cid"));
                autoIDs.push($(this).data("cid"));
            });

            dObject.auto_id=DLA.cars[autoIDs[0]].ID/1;
            dObject.keyWords=keywordIDs;
            con (dObject);
            returnInfo(dObject,showPhotos,false)
        })
    }

    function update(cid){
        var carID=DLA.cars[$(".car_radio:checked").data("cid")].ID;
        var partID=DLA.parts[$(".part_radio:checked").data("cid")].ID;

        var url = DLA.imageList[cid].img_url;
        con(carID);
        con(partID);
        con(url);
    }

    function showPhotos(listed){
        $("#photolist").empty();
        con (listed);

        if (listed===false){
            var dObject={cat:1, subcat:1};
        }
        else
        {
            var dObject={cat:1};
        }
        con(dObject);

        returnInfo(dObject,listPhotos)
    }

    //function
    $(document).ready(function() {
        showPhotos(false);   //show all photos if true, show unlisted if false
        //showCarList();
        //showPhotos();

        $("#all_imgs").click( function(){
            con("allImgs");
            $("#photolist").empty();
            showPhotos(true)     //show all photos if true, show unlisted if false
        })

        $("#unlisted_imgs").click( function(){
            con("unlisted");
            $("#photolist").empty();
            showPhotos(false)    //show all photos if true, show unlisted if false
        })

    });

}
)(window.DLA);