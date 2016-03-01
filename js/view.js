'use strict';

/**
 * A function that creates and returns all of the model classes and constants.
  */
function createViewModule() {

    var LIST_VIEW = 'LIST_VIEW';
    var GRID_VIEW = 'GRID_VIEW';
    var RATING_CHANGE = 'RATING_CHANGE';

    /**
     * An object representing a DOM element that will render the given ImageModel object.
     */
    var ImageRenderer = function(imageModel) {
        // TODO
        this.imageModelData = {
             imageModel: imageModel,
             imageModel_div: null,
             imageModel_id: imageModel.idNum
        };
        this.viewType = GRID_VIEW;
    };

    _.extend(ImageRenderer.prototype, {

        /**
         * Returns an element representing the ImageModel, which can be attached to the DOM
         * to display the ImageModel.
         */
        getElement: function() {
            // TODO
            var self = this;
            var imageModel_div = document.createElement("DIV");
            imageModel_div.setAttribute("class", "imageModel_div");

            var img_div = document.createElement("DIV");
            img_div.setAttribute("class", "img_div");

            var img_temp_content = document.querySelector('#img').content;
            var img_clone = document.importNode(img_temp_content, true);

            var img_orig = img_clone.querySelector('.image');
            img_orig.setAttribute("id", "img"+this.imageModelData.imageModel_id);
            img_orig.setAttribute("src", this.imageModelData.imageModel.getPath());
            img_orig.setAttribute("alt", "IMAGE");

            img_orig.addEventListener('mouseover', add_close_icon); 
            img_orig.addEventListener('mouseout', remove_close_icon); 

            var img_close = img_clone.querySelector('.close');
            img_close.setAttribute("id", self.imageModelData.imageModel_id);
            
            img_close.style.display = 'none';
            
            function add_close_icon(){
                img_close.style.display = 'initial';
                img_close.addEventListener('click', removeImage);
                img_close.addEventListener('mouseover', function(){
                    img_close.style.display = 'initial';
                });
            }

            function removeImage() {
                self.imageModelData.imageModel.deleteImage();
                self.imageModelData.imageModel.removeListener();
             };

            function remove_close_icon(){
                img_close.style.display = 'none';
                img_close.addEventListener('mouseout', function(){
                    img_close.style.display = 'none';
                });
            } 
            
            img_div.appendChild(img_close);
            img_div.appendChild(img_orig);

            img_orig.addEventListener('click', enlarge_image);           
            function enlarge_image(){
                var enlarge_div = document.getElementById("enlarged");
                var enlarge_temp_content = document.querySelector('#img-larger').content;
                var enlarge_clone = document.importNode(enlarge_temp_content, true);

                var imageEnlarge = enlarge_clone.querySelector('#img_enlarge');
                imageEnlarge.src = img_orig.src;
                imageEnlarge.alt = "ENLARGED";

                var txt = enlarge_clone.querySelector('#text-large');

                //Close enlarged image: Click once again
                imageEnlarge.addEventListener('click', function(){
                    var enlarge_div = document.getElementById("enlarged");
                    enlarge_div.innerHTML = "";
                });

                enlarge_div.innerHTML = "";
                enlarge_div.appendChild(txt);
                enlarge_div.appendChild(imageEnlarge);

            }

            var img_meta_div = document.createElement("DIV");
            img_meta_div.setAttribute("class", "img_meta_div");

            var img_name = document.createElement('p');
            img_name.setAttribute("class", "img_name");
            var name = this.imageModelData.imageModel.getPath().substring(7);
            img_name.innerText = name.substr(0, name.length-4);

            var img_date = document.createElement('p');
            var d = this.imageModelData.imageModel.getModificationDate();
            img_date.innerText = d.toDateString();

            var star_div = document.createElement("DIV");
            star_div.setAttribute("class", "star_div");
            star_div.setAttribute("id", "star"+self.imageModelData.imageModel_id);

            var star_temp_content = document.querySelector('#stars').content;
             var star_clone = document.importNode(star_temp_content, true);
             star_div.appendChild(star_clone);

            // Assign ID for each star in each imageModel
            
              var i = 0;
            _.each(
                star_div.childNodes,
                function(single_star){
                    if(1 == single_star.nodeType && i < star_div.childNodes.length -2){
                        var self2 = star_div.childNodes[i];
                        single_star.id = i + "star" + self.imageModelData.imageModel_id;

                        single_star.addEventListener('mouseover', function(){ 
                            //self2.src = "icons/0_star_full.png";
                            change_star("mouseover", single_star, self.imageModelData.imageModel.getRating());
                        });

                        single_star.addEventListener('mouseout', function(){
                            //self2.src = "icons/0_star_empty.png";
                            change_star("mouseout", single_star, self.imageModelData.imageModel.getRating());
                        });

                        single_star.addEventListener('click', function(){
                            //self2.src = "icons/0_star_empty.png";
                            change_star("click", single_star, self.imageModelData.imageModel.getRating());
                        });
                    }
                    i++;
                });

            star_div.childNodes[11].id = "clear" + self.imageModelData.imageModel_id;
            star_div.childNodes[11].addEventListener('click', function(){   
                change_star("click", star_div.childNodes[11], 0);
            });

           checkRating(star_div, this.imageModelData.imageModel.getRating());

            img_meta_div.appendChild(img_name);
            img_meta_div.appendChild(img_date);
            img_meta_div.appendChild(star_div);

            if (this.viewType == LIST_VIEW) {
                img_div.style.float = 'left';
                img_div.style.clear = ' none';
                img_div.style.paddingRight = '20px';
                img_meta_div.style.float = 'left';
                img_meta_div.style.clear = 'none';
                imageModel_div.style.float = 'none';
                imageModel_div.style.clear = 'both';
            }else if (this.viewType == GRID_VIEW) {
                img_div.style.float = 'none';
                img_div.style.clear = 'both';
                img_meta_div.style.float = 'none';
                img_meta_div.style.clear = 'both';
                imageModel_div.style.float = 'left';
                imageModel_div.style.clear = 'none';
                   
            }

            imageModel_div.appendChild(img_div);
            imageModel_div.appendChild(img_meta_div);

            this.imageModelData.imageModel_div = imageModel_div;
            return imageModel_div;
        },

        /**
         * Returns the ImageModel represented by this ImageRenderer.
         */
        getImageModel: function() {
            // TODO
            return this.imageModelData.imageModel;
        },

        /**
         * Sets the ImageModel represented by this ImageRenderer, changing the element and its
         * contents as necessary.
         */
        setImageModel: function(imageModel) {
            // TODO
            this.imageModelData.imageModel = imageModel;
        },

        /**
         * Changes the rendering of the ImageModel to either list or grid view.
         * @param viewType A string, either LIST_VIEW or GRID_VIEW
         */
        setToView: function(viewType) {
            this.viewType = viewType;

        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type it is
         * currently rendering.
         */
        getCurrentView: function() {
            return this.viewType;
        }
    });

    /**
     * A factory is an object that creates other objects. In this case, this object will create
     * objects that fulfill the ImageRenderer class's contract defined above.
     */
    var ImageRendererFactory = function() {
    };

    _.extend(ImageRendererFactory.prototype, {

        /**
         * Creates a new ImageRenderer object for the given ImageModel
         */
        createImageRenderer: function(imageModel) {
            // TODO
            return new ImageRenderer(imageModel);
        }
    });

    /**
     * An object representing a DOM element that will render an ImageCollectionModel.
     * Multiple such objects can be created and added to the DOM (i.e., you shouldn't
     * assume there is only one ImageCollectionView that will ever be created).
     */
    var ImageCollectionView = function() {
        // TODO
        this.viewType = GRID_VIEW;
        this.imageCollectionModel;
        this.imageRendererFactory = new ImageRendererFactory();
        this.imageRendererArr = [];
    };

    _.extend(ImageCollectionView.prototype, {
        /**
         * Returns an element that can be attached to the DOM to display the ImageCollectionModel
         * this object represents.
         */
        getElement: function() {
            // TODO
            var imgCollection_div = document.createElement("DIV");
            imgCollection_div.setAttribute("class", "imgCollection_div");

            if (this.imageRendererArr != null){
                for(var i=0; i < this.imageRendererArr.length; i++){
                    this.imageRendererArr[i].setToView(this.viewType);
                    var imgEl = this.imageRendererArr[i].getElement();
                    imgCollection_div.appendChild(imgEl);
                }
            }
            return imgCollection_div;

        },

        /**
         * Gets the current ImageRendererFactory being used to create new ImageRenderer objects.
         */
        getImageRendererFactory: function() {
            // TODO
            return this.imageRendererFactory;
        },

        /**
         * Sets the ImageRendererFactory to use to render ImageModels. When a *new* factory is provided,
         * the ImageCollectionView should redo its entire presentation, replacing all of the old
         * ImageRenderer objects with new ImageRenderer objects produced by the factory.
         */
        setImageRendererFactory: function(imageRendererFactory) {
            // TODO
            this.imageRendererFactory = imageRendererFactory;
            var tempRendererArr = [];

            if (this.imageRendererArr != null){
                for (var i = 0; i < this.imageRendererArr.length; i++) {
                    var tempModel = imageRendererArr[i].getImageModel();
                    var tempFactory = this.getImageRendererFactory();
                    tempRendererArr.push(tempFactory.createImageRenderer(tempModel));
                }
            }
            this.imageRendererArr = tempRendererArr;
        },

        /**
         * Returns the ImageCollectionModel represented by this view.
         */
        getImageCollectionModel: function() {
            // TODO
            return this.imageCollectionModel;
        },

        /**
         * Sets the ImageCollectionModel to be represented by this view. When setting the ImageCollectionModel,
         * you should properly register/unregister listeners with the model, so you will be notified of
         * any changes to the given model.
         */
        setImageCollectionModel: function(imageCollectionModel) {
            // TODO
            this.imageRendererArr = [];
            this.imageCollectionModel = imageCollectionModel;
            var self = this;

            imageCollectionModel.addListener(function(eventType, imageModelCollection, imageModel, eventDate){
                    if (eventType == 'IMAGE_REMOVED_FROM_COLLECTION_EVENT') {
                        var index = 0;
                        var splice_ind = -1;
                        for(; index < self.imageRendererArr.length; index++){
                            if(self.imageRendererArr[index].imageModelData.imageModel == imageModel){
                                splice_ind = index;
                                break;
                            }
                        }
                        
                        self.imageRendererArr[index].imageModelData.imageModel_div.style.display = 'none';
                        if (splice_ind !== -1) {
                            self.imageRendererArr.splice(splice_ind, 1);
                            imageCollectionModel.imageModels.splice(splice_ind,1);
                        }


                    }else if (eventType == 'IMAGE_ADDED_TO_COLLECTION_EVENT') {
                        var renderer = self.imageRendererFactory.createImageRenderer(imageModel);
                        renderer.setToView(self.viewType);
                        (document.getElementsByClassName("imgCollection_div"))[0].appendChild(renderer.getElement());
                        self.imageRendererArr.push(renderer);

                    }else if (eventType == 'IMAGE_META_DATA_CHANGED_EVENT'){
                        var renderer = self.imageRendererFactory.createImageRenderer(imageModel);
                        renderer.setToView(self.viewType);
                        for(var i=0; i < self.imageRendererArr.length; i++){
                            if(self.imageRendererArr[i].imageModelData.imageModel == imageModel){
                                var model_div = self.imageRendererArr[i].imageModelData.imageModel_div;
                                var general_id = self.imageRendererArr[i].imageModelData.imageModel_id;
                                var rating = imageModel.getRating();
                                var star_div = document.getElementById("star" + general_id);
                                checkRating(star_div, rating);
                                break;
                            }
                            
                        }

                    }
            });

            _.each(
                this.getImageCollectionModel().getImageModels(),
                function(imageModel) {
                    var imgRenderer = self.imageRendererFactory.createImageRenderer(imageModel);
                    self.imageRendererArr.push(imgRenderer);
                }
            );

        },

        /**
         * Changes the presentation of the images to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW.
         */
        setToView: function(viewType) {
            // TODO
            this.viewType = viewType;

            _.each(
                this.imageRendererArr,
                function(imageRenderer) {
                    imageRenderer.setToView(viewType);
                }
            );
        },

        /**
         * Returns a string of either LIST_VIEW or GRID_VIEW indicating which view type is currently
         * being rendered.
         */
        getCurrentView: function() {
            // TODO
            return this.viewType;
        }
    });

    /**
     * An object representing a DOM element that will render the toolbar to the screen.
     */
    var Toolbar = function() {
        this.listeners = [];
        this.viewType = GRID_VIEW;
        this.ratingFilter = 0;

    };

    _.extend(Toolbar.prototype, {
        /**
         * Returns an element representing the toolbar, which can be attached to the DOM.
         */
        getElement: function() {
            // TODO
            var self = this;
            var toolbar_div = document.createElement("DIV");
            toolbar_div.setAttribute("id", "toolbar_div");

            var star_temp_content = document.querySelector('#stars').content;
            var star_clone = document.importNode(star_temp_content, true);

            var p = document.createElement('span');
            p.setAttribute("id", "FilterBy");
            p.innerText = "Filter by: ";

            var star_div = document.getElementById("add_filter");
            star_div.appendChild(p);
            star_div.appendChild(star_clone);

              var i = 0;
            _.each(
                star_div.childNodes,
                function(single_star){
                    if(1 == single_star.nodeType && i < star_div.childNodes.length -2 && i > 0){
                        var self2 = star_div.childNodes[i];
                        single_star.id = "filterstar" + (i-1);

                        single_star.addEventListener('mouseover', function(){ 
                            filter_star("mouseover", single_star, self.ratingFilter, self);
                        });

                        single_star.addEventListener('mouseout', function(){
                            filter_star("mouseout", single_star, self.ratingFilter, self);
                        });

                        single_star.addEventListener('click', function(){
                            filter_star("click", single_star, self.ratingFilter, self);
                        });
                    }
                    i++;
                });

            star_div.childNodes[12].id = "filter-clear";
            star_div.childNodes[12].addEventListener('click', function(){   
                filter_star("click", star_div.childNodes[12], 0, self);
            });

            var view_temp_content = document.querySelector('#view_type_temp').content;
            var view_clone = document.importNode(view_temp_content, true);
            var view_div = document.createElement("DIV");
            view_div.appendChild(view_clone);
            toolbar_div.appendChild(view_div);

            return toolbar_div;
        },

        /**
         * Registers the given listener to be notified when the toolbar changes from one
         * view type to another.
         * @param listener_fn A function with signature (toolbar, eventType, eventDate), where
         *                    toolbar is a reference to this object, eventType is a string of
         *                    either, LIST_VIEW, GRID_VIEW, or RATING_CHANGE representing how
         *                    the toolbar has changed (specifically, the user has switched to
         *                    a list view, grid view, or changed the star rating filter).
         *                    eventDate is a Date object representing when the event occurred.
         */
        addListener: function(listener_fn) {
            // TODO
            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from the toolbar.
         */
        removeListener: function(listener_fn) {
            // TODO
            this.listeners = _.without(this.listeners, listener_fn);
        },

        /**
         * Sets the toolbar to either grid view or list view.
         * @param viewType A string of either LIST_VIEW or GRID_VIEW representing the desired view.
         */
        setToView: function(viewType) {
            this.viewType = viewType;
            
            var self = this;
            _.each(
                this.listeners,
                function(listener_fn) {
                    listener_fn(viewType, new Date());
                }
            );
            
        },

        /**
         * Returns the current view selected in the toolbar, a string that is
         * either LIST_VIEW or GRID_VIEW.
         */
        getCurrentView: function() {
            return this.viewType;
        },

        /**
         * Returns the current rating filter. A number in the range [0,5], where 0 indicates no
         * filtering should take place.
         */
        getCurrentRatingFilter: function() {
            return this.ratingFilter;
        },

        /**
         * Sets the rating filter.
         * @param rating An integer in the range [0,5], where 0 indicates no filtering should take place.
         */
        setRatingFilter: function(rating) {
            // TODO
            this.ratingFilter = rating;
            var self = this;
            _.each(
                this.listeners,
                function(listener_fn) {
                    listener_fn('RATE_FILTER', new Date());
                }
            );
        }
    });

    /**
     * An object that will allow the user to choose images to display.
     * @constructor
     */
    var FileChooser = function() {
        this.listeners = [];
        this._init();
    };

    _.extend(FileChooser.prototype, {
        // This code partially derived from: http://www.html5rocks.com/en/tutorials/file/dndfiles/
        _init: function() {
            var self = this;
            this.fileChooserDiv = document.createElement('div');
            var fileChooserTemplate = document.getElementById('file-chooser');
            this.fileChooserDiv.appendChild(document.importNode(fileChooserTemplate.content, true));
            var fileChooserInput = this.fileChooserDiv.querySelector('.files-input');
            fileChooserInput.addEventListener('change', function(evt) {
                var files = evt.target.files;
                var eventDate = new Date();
                _.each(
                    self.listeners,
                    function(listener_fn) {
                        listener_fn(self, files, eventDate);
                    }
                );
            });
        },

        /**
         * Returns an element that can be added to the DOM to display the file chooser.
         */
        getElement: function() {
            return this.fileChooserDiv;
        },

        /**
         * Adds a listener to be notified when a new set of files have been chosen.
         * @param listener_fn A function with signature (fileChooser, fileList, eventDate), where
         *                    fileChooser is a reference to this object, fileList is a list of files
         *                    as returned by the File API, and eventDate is when the files were chosen.
         */
        addListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.addListener: " + JSON.stringify(arguments));
            }

            this.listeners.push(listener_fn);
        },

        /**
         * Removes the given listener from this object.
         * @param listener_fn
         */
        removeListener: function(listener_fn) {
            if (!_.isFunction(listener_fn)) {
                throw new Error("Invalid arguments to FileChooser.removeListener: " + JSON.stringify(arguments));
            }
            this.listeners = _.without(this.listeners, listener_fn);
        }
    });

    // Return an object containing all of our classes and constants
    return {
        ImageRenderer: ImageRenderer,
        ImageRendererFactory: ImageRendererFactory,
        ImageCollectionView: ImageCollectionView,
        Toolbar: Toolbar,
        FileChooser: FileChooser,

        LIST_VIEW: LIST_VIEW,
        GRID_VIEW: GRID_VIEW,
        RATING_CHANGE: RATING_CHANGE
    };
}