'use strict';

var expect = chai.expect;

describe('Student Unit Tests', function() {

    var modelModuleTest;
    var viewModuleTest;

    beforeEach(function() {
      modelModuleTest = createModelModule();
      viewModuleTest = createViewModule();
        
    });

    afterEach(function() {
      modelModuleTest = null;
      viewModuleTest = null;
    });

	describe('TEST#1: imageModel', function() {

		it('Listener tests for ImageModel used in setCaption and setRating' , function(){
        	var imageModel = new modelModuleTest.ImageModel(
        							"images/GOPR0042-small.jpg", 
        							new Date(), 
        							"", 
        							0);

        	var listener_fn = sinon.spy();
        	imageModel.addListener(listener_fn);

        	imageModel.setRating(4);
        	expect(imageModel.getRating()).to.eql(4);
        	expect(listener_fn.calledOnce, 'listener_fn called only once for rating change').to.be.true;
        
        	imageModel.setCaption("new image");
        	expect(imageModel.getCaption()).to.eql("new image");
        	expect(listener_fn.called, 'listener_fn called again for caption change').to.be.true;
        	expect(listener_fn.calledOnce, 'removeListener should have been called more than once.').to.be.false;        
		});

		it('Listener add/remove tests for ImageModel', function(){
        	var imageModel = new modelModuleTest.ImageModel(
        							"images/GOPR0051-small.jpg", 
        							new Date(), 
        							"", 
        							0);

        	var initialSpy = sinon.spy();
       		var addListenerSpy = sinon.spy(imageModel, "addListener");
        	var removeListenerSpy = sinon.spy(imageModel, "removeListener");

        	imageModel.addListener(initialSpy);
        	imageModel.removeListener(initialSpy);

        	expect(removeListenerSpy.calledWith(initialSpy), 'removeListener should have been called with initialSpy.').to.be.true;
        	expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
        	expect(imageModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

       		imageModel.removeListener(initialSpy);

        	expect(imageModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);

        	var nextSpy = sinon.spy();
        	imageModel.addListener(nextSpy);

        	expect(imageModel.listeners.length, 'listeners.length should be one now.').to.be.equal(1);

        	imageModel.removeListener(nextSpy);
        	expect(removeListenerSpy.calledWith(initialSpy), 'removeListener should have been called with initialSpy.').to.be.true;
        	expect(removeListenerSpy.calledOnce, 'removeListener should have been called more than once.').to.be.false;
        	expect(imageModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);
		});
	});
	
	describe('TEST#2: imageCollectionModel', function() {

		it('Listener add/remove tests for ImageCollectionModel' , function(){
        	var imageCollectionModel = new modelModuleTest.ImageCollectionModel();
        	var imageModel = new modelModuleTest.ImageModel("images/GOPR0069-small.jpg", new Date(), "", 2);

        	var listener_fn1 = sinon.spy();
        	var removeListenerSpy = sinon.spy(imageCollectionModel, "removeListener");

        	imageCollectionModel.addListener(listener_fn1);

        	imageCollectionModel.removeListener(listener_fn1);

        	expect(removeListenerSpy.calledWith(listener_fn1), 'removeListener should have been called with listener_fn1.').to.be.true;
        	expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
        	expect(imageCollectionModel.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

       		imageCollectionModel.removeListener(listener_fn1);

        	expect(imageCollectionModel.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);

        	var listener_fn2 = sinon.spy();
        	imageCollectionModel.addListener(listener_fn2);

        	expect(imageCollectionModel.listeners.length, 'listeners.length should be one.').to.be.equal(1);
        });

		it('Listener tests for ImageCollectionModel used in addImageModel and removeImageModel' , function(){
        	var imageCollectionModel = new modelModuleTest.ImageCollectionModel();
        	var imageModel = new modelModuleTest.ImageModel("images/GOPR0044-small.jpg", new Date(), "", 2);

        	var listener_fn = sinon.spy();
        	imageCollectionModel.addListener(listener_fn);

        	imageCollectionModel.addImageModel(imageModel);

        	expect(listener_fn.calledOnce, 'listener_fn called once').to.be.true;

        	imageCollectionModel.removeImageModel(imageModel);

        	expect(listener_fn.callCount, 'listener_fn called more than once').to.be.equal(2);
        	expect(imageModel.listeners.length, 'listeners.length should be 1.').to.be.equal(1);       	
    	});
	});
	
	describe('TEST#3: Toolbar', function() {

		it('Listener tests for Toolbar used in setToView and setRatingFilter' , function(){
			var toolbar = new viewModuleTest.Toolbar();

			var listener_fn = sinon.spy();
       		toolbar.addListener(listener_fn);

       		toolbar.setToView('GRID_VIEW');
       		expect(listener_fn.calledOnce, 'listener_fn called once').to.be.true;
       		expect(toolbar.getCurrentView()).to.eql("GRID_VIEW");

        	toolbar.setToView('LIST_VIEW');
        	expect(listener_fn.calledOnce, 'listener_fn called more than once').to.be.false;
        	expect(toolbar.getCurrentView()).to.eql("LIST_VIEW");
        	expect(listener_fn.called, 'listener_fn called again for view change').to.be.true;
		});

		it('Listener add/remove tests for Toolbar' , function(){
			var toolbar = new viewModuleTest.Toolbar();
			var removeListenerSpy = sinon.spy(toolbar, "removeListener");

			var listener_fn = sinon.spy();
       		toolbar.addListener(listener_fn);
			toolbar.removeListener(listener_fn);
        	
        	expect(removeListenerSpy.calledWith(listener_fn), 'removeListener should have been called with listener_fn.').to.be.true;
        	expect(removeListenerSpy.calledOnce, 'removeListener should have been called once.').to.be.true;
        	expect(toolbar.listeners.length, 'listeners.length should be zero.').to.be.equal(0);

        	toolbar.removeListener(listener_fn);
       		
        	expect(toolbar.listeners.length, 'listeners.length should still be zero.').to.be.equal(0);

        	var listener_fn2 = sinon.spy();
        	toolbar.addListener(listener_fn2);

        	expect(toolbar.listeners.length, 'listeners.length should be one.').to.be.equal(1);

        	toolbar.addListener(listener_fn);
        	expect(toolbar.listeners.length, 'listeners.length should be one.').to.be.equal(2);
		});
	});
});
