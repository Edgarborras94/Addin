(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], function () {
			return factory(root);
		});
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.Addin = factory(root);
	}
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

	'use strict';

	//
	// Variables
	//

	var defaults = {

        // Values
        initialValue : 0,   // Initial items on webpage 
        defaultValue: '',   // Default value for inputs
        isRequired: true,   // If true, inputs will be required
        object: null,

		// Classes & IDs
        superSuperParentID: 'addedjs',              //<-- Removed with selector passed by
        superParentDivClass: 'addobjects',
        parentDivClass: 'added', 
        parentDivExtraClasses: 'col-sm-12',
        fieldName: 'addobject',                     //<-- This will add a number after the classname ie: added0
		fieldClasses: ['form-control','lol'],
        addButtonClasses: ['btn','btn-success'],
        removeButtonClasses: ['btn','btn-danger'],
        emptyClasses : ['mb-3'],

		// Strings -> Translatable??

        strings: {
			buttons: {
				add: 'Add',
				remove: 'Remove',
			},
            empty: 'No objects added',
            itemName: 'Item',
            itemPlaceholder: 'Item name'
		}

	};
    var Constructor = function (selector, options) {
        
        var publicAPIs = {};
		var settings;

        var superParentDiv;
        var noAdded;
        var addButton;
        var removeButton;
        var adds = 0;

        /**
        *   Update the values from/to the settings
        */
        var updateValues = function(){
            adds = settings.initialValue;
            settings.superSuperParentID = selector;
        }
        /**
        *   Check if the master ID element exists
        *   @return {Boolean}       true if exists, false if not
        */
        var checkMasterParent = function(){
            console.log(document.getElementById(settings.superSuperParentID) === null);
            if(document.getElementById(settings.superSuperParentID) === null)
            {
                console.error("Missing the actual DOM with id: "+settings.superSuperParentID+" you must create it beforehand.");
                return false;

            }
            else{
                return true;
            }
        }
        /**
        *   Check if object exists
        *   @return {Boolean}       true if exists, false if not
        */
        var checkObject = function(){
            if(settings.object !== null){
                return true;
            }
            else{
                return false;
            }
        }
        /**
        *   Update object string to change variables to actual values
        *   @return {String}       return final Object's string
        */
        var updateObject = function(){
            var newObject = settings.object;
            newObject = newObject.replace(/{loop}/g,adds);
            return newObject;
        }
        /**
        *   Add Empty text's div
        */
        var addEmptyString = function(){
            superParentDiv = document.createElement("div");
            superParentDiv.classList.add(settings.superParentDivClass);
            document.getElementById(settings.superSuperParentID).appendChild(superParentDiv);
            noAdded = document.createElement("div");
            noAdded.id = "noadded";
            noAdded.classList.add(...settings.emptyClasses);
            noAdded.innerHTML =  settings.strings.empty;
            document.getElementById(settings.superSuperParentID).appendChild(noAdded);
        }
        /**
        *   Create the buttons to Add/Remove the Items from the list
        */
        var createButtons = function(){
            addButton = document.createElement("button");
            addButton.classList.add(...settings.addButtonClasses);
            addButton.setAttribute('type', 'button')
            addButton.innerHTML = settings.strings.buttons.add;
            addButton.addEventListener('click',adderHandler,false);
            document.getElementById(settings.superSuperParentID).appendChild(addButton);
            removeButton = document.createElement("button");
            removeButton.classList.add(...settings.removeButtonClasses);
            removeButton.setAttribute('type', 'button')
            removeButton.innerHTML = settings.strings.buttons.remove;
            removeButton.addEventListener('click',removerHandler,false);
	    if(settings.initialValue == 0){
                removeButton.disabled = true;
            }
            document.getElementById(settings.superSuperParentID).appendChild(removeButton);
        }
        /**
        *   Handler for the Click event from the Add button
        */
        var adderHandler = function (event) {
            var pregunta = document.createElement('div');
            pregunta.classList.add('row' ,settings.parentDivClass+(adds));
            if(checkObject()){
                pregunta.innerHTML = updateObject();
            }
            else{
            pregunta.innerHTML = `<div class="form-group col-sm-12">
                    <label class="form-control-label" for="input-`+(settings.fieldName+adds)+`">`+settings.strings.itemName+` `+(adds+1)+`</label>
                    <input type="text" name="`+(settings.fieldName + adds)+`" id="input-`+(settings.fieldName+adds)+`" class="`+(settings.fieldClasses.join(' '))+`" placeholder="`+settings.strings.itemPlaceholder+`" value="`+settings.defaultValue+`"  `+(settings.isRequired ? 'required' : '')+`>
                </div>`;
            }
            adds++;
            if(!noAdded.classList.contains('d-none')){
                noAdded.classList.add('d-none');
            }
            removeButton.disabled = false;
            superParentDiv.appendChild(pregunta);
        }
        /**
        *   Handler for the Click event from the Remove button
        */
        var removerHandler = function(event){
            if(superParentDiv.childElementCount > 0){
                var last = document.getElementsByClassName(settings.parentDivClass+(adds-1))[0];
                last.parentNode.removeChild(last);
                adds--;
                if(adds == 0){
                    removeButton.disabled = true;
                    if(noAdded.classList.contains('d-none')){
                        noAdded.classList.remove('d-none');
                    }
                }
            }
        }
        /**
        * A wrapper for Array.prototype.forEach() for non-arrays
        * @param  {Array-like} arr      The array-like object
        * @param  {Function}   callback The callback to run
        */
        var forEach = function (arr, callback) {
            Array.prototype.forEach.call(arr, callback);
        };
        /**
        * Merge two or more objects together.
        * @param   {Object}   objects  The objects to merge together
        * @returns {Object}            Merged values of defaults and options
        */
        var extend = function () {
            var merged = {};
            forEach(arguments, (function (obj) {
                for (var key in obj) {
                    if (!obj.hasOwnProperty(key)) return;
                    if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
                        merged[key] = extend(merged[key], obj[key]);
                    } else {
                        merged[key] = obj[key];
                    }
                    // merged[key] = obj[key];
                }
            }));
            return merged;
        };

        var init = function () {

            // Create settings
            settings = extend(defaults, options || {});
            
            // Call Methods
            updateValues();
            if(!checkMasterParent()){
                return false;
            }
            addEmptyString();
            createButtons();
            // Event Listeners
            addButton.addEventListener('click',adderHandler,false);
            removeButton.addEventListener('click',removerHandler,false);
        };

        publicAPIs.length = function(){
            return superParentDiv.childElementCount;
        }

        publicAPIs.items = function(){
            return superParentDiv.childNodes;
        }

        init();
		return publicAPIs;
    }

    //
	// Return the constructor
	//

	return Constructor;

});
