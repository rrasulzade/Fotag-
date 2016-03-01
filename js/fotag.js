'use strict';

// This should be your main point of entry for your app
var imgCollectionModel;

window.addEventListener('load', function() {
    var modelModule = createModelModule();
    var viewModule = createViewModule();
    var header_div = document.getElementById("header");
    var add_tool = document.getElementById("add_tool");
    var appContainer = document.getElementById("app-container");
    var mainContent = document.getElementById("main_content");
    var addFile = document.getElementById("add_photo");

    imgCollectionModel = modelModule.loadImageCollectionModel();
    var imgCollectionView = new viewModule.ImageCollectionView();
    imgCollectionView.setImageCollectionModel(imgCollectionModel);
    var imgCollection_div = imgCollectionView.getElement();
    mainContent.appendChild(imgCollectionView.getElement());

    var toolBar = new viewModule.Toolbar();
    add_tool.appendChild(toolBar.getElement());

    var toolbar_div = document.getElementById("toolbar_div");
    var grid_icon = document.getElementsByClassName("grid_icon")[0];
    var list_icon = document.getElementsByClassName("list_icon")[0];

    grid_icon.addEventListener('click', function() {
        toolBar.setToView('GRID_VIEW');
        grid_icon.setAttribute("src", "icons/0_grid_black.png");
        list_icon.setAttribute("src", "icons/0_list_blue.png");
    });

    list_icon.addEventListener('click', function() {
        toolBar.setToView('LIST_VIEW');
        grid_icon.setAttribute("src", "icons/0_grid_blue.png");
        list_icon.setAttribute("src", "icons/0_list_black.png");
    });

    // Attach the file chooser to the page. You can choose to put this elsewhere, and style as desired
    var fileChooser = new viewModule.FileChooser();
    addFile.appendChild(fileChooser.getElement());

    // Demo that we can choose files and save to local storage. This can be replaced, later
    fileChooser.addListener(function(fileChooser, files, eventDate) {
       // var imageCollectionModel = new modelModule.ImageCollectionModel();
        _.each(
            files,
            function(file) {
                imgCollectionModel.addImageModel(
                    new modelModule.ImageModel(
                        'images/' + file.name,
                        file.lastModifiedDate,
                        '',
                        0
                    ));
            }
        );
        modelModule.storeImageCollectionModel(imgCollectionModel);
    });

    var selftool = toolBar; 
    toolBar.addListener(function(eventType, eventDate){

        if (eventType == 'GRID_VIEW') {
            imgCollectionView.setToView('GRID_VIEW');

        }else  if (eventType == 'LIST_VIEW') {
            imgCollectionView.setToView('LIST_VIEW');

        }else if(eventType == 'RATE_FILTER'){
            var curRate = selftool.getCurrentRatingFilter();
            var tempImgCollectionMod = new modelModule.ImageCollectionModel();

            for(var l=0; l < imgCollectionModel.getImageModels().length; l++){
                if(imgCollectionModel.getImageModels()[l].rating >= curRate){
                    tempImgCollectionMod.addImageModel(imgCollectionModel.getImageModels()[l]);
                }
            }

            imgCollectionView.setImageCollectionModel(tempImgCollectionMod);
        }

        mainContent.innerHTML = "";
        mainContent.appendChild(imgCollectionView.getElement());

    });

});

// Used for image remove function to store data after deletion
window.addEventListener('beforeunload', function() {
    var modelModule = createModelModule();
    modelModule.storeImageCollectionModel(imgCollectionModel);
   // localStorage.clear();
});


var change_star =  function (eventType, single_star, curRate) {
    var pos = single_star.id[0];
    var general_id = single_star.id.substring(1);
    var star_div = document.getElementById(general_id);
    var rateNum = 1 + (pos/2) >> 0;

    if(eventType == "click"){
        var imgModels = imgCollectionModel.getImageModels();
        var IDnum =  single_star.id.substring(5);
        var index = 0;
        for(var j = 0; j < imgModels.length; j++){
            if (imgModels[j].idNum == IDnum) {
                index = j;
                imgModels[j].setRating(rateNum);
                break;
            }
        }
    } else{
        for(var i = 0; i < star_div.childNodes.length - 2; i++){
            var star = star_div.childNodes[i];
            if(1 == star_div.childNodes[i].nodeType && ((i/2) >> 0) >= curRate){
                if (eventType == "mouseover" ){
                    if (i <= pos ) {
                        star.src = "icons/0_star_full.png";
                    } else {
                        star.src = "icons/0_star_empty.png";
                    }
                }else if(eventType == "mouseout" )  {
                    star.src = "icons/0_star_empty.png";

                }
            }
        }
    }

};

var filter_star =  function (eventType, single_star, curRate, toolbar) {
    var pos = single_star.id[10];
    var star_div = document.getElementById("add_filter");
    var rateNum = 1 + (pos/2) >> 0;

    if(eventType == "click"){
        toolbar.setRatingFilter(parseInt(rateNum));
        checkRating(star_div, rateNum+1);
        return;

    } else{
        for(var i = 1; i < star_div.childNodes.length - 2; i++){
            var star = star_div.childNodes[i];
            if(1 == star_div.childNodes[i].nodeType && ((i/2) >> 0) > curRate){
                if (eventType == "mouseover" ){
                    if (i-1 <= pos ) {
                        star.src = "icons/0_star_full.png";
                    } else {
                        star.src = "icons/0_star_empty.png";
                    }
                }else if(eventType == "mouseout" )  {
                    star.src = "icons/0_star_empty.png";

                }
            }
        }
    }

};

var checkRating = function(star_div, rateNum){
    var index = 1;
    for(var i = 0; i < star_div.childNodes.length - 2; i++){
        var star = star_div.childNodes[i];
        if(1 == star_div.childNodes[i].nodeType){
            if (index <= rateNum) {
                star.src = "icons/0_star_full.png";
                index++;
            } else {
                star.src = "icons/0_star_empty.png";
            }
        }

    }
}

