/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(
['aloha/jquery','aloha/plugin', 'aloha/floatingmenu', 'i18n!numerated-headers/nls/i18n', 'i18n!aloha/nls/i18n'],
function(jQuery, Plugin, FloatingMenu, i18n, i18nCore) {
	"use strict";

	var
		$ = jQuery,
		GENTICS = window.GENTICS,
		Aloha = window.Aloha;
	
   return Plugin.create('numerated-headers', {
     
     /**
      * Initialize the plugin
      */
     init: function () {
       var that = this;

       // add button to toggle format-less pasting
       this.numeratedHeadersButton = new Aloha.ui.Button({
         'iconClass' : 'aloha-button aloha-button-numerated-headers',
         'size' : 'small',
         'onclick' : function () { 
           that.createNumeratedHeaders();
         },
         'tooltip' : i18n.t('button.numeratedHeaders.tooltip'),
         'toggle' : false 
       });
       FloatingMenu.addButton(
         'Aloha.continuoustext',
         this.numeratedHeadersButton,
         i18nCore.t('floatingmenu.tab.format'),
         2
       );
     },

     createNumeratedHeaders: function(){
      var active_editable_obj = Aloha.activeEditable.obj
      var headers = active_editable_obj.find('h1, h2, h3, h4, h5, h6');

      var base_rank = parseInt(headers[0].nodeName.substr(1));
      var prev_rank = null;
      var current_annotation = [];
      var annotation_pos = 0;

      // initialize the base annotations
      for(var i=0; i < (6 - base_rank) + 1; i++){
          current_annotation[i] = 0; 
      }
      
      headers.each(function(){
        var current_rank = parseInt(this.nodeName.substr(1));
        if(prev_rank == null){
          //increment the main annotation 
          current_annotation[annotation_pos]++;
        }
        //starts a sub title
        else if(current_rank > prev_rank) {
          current_annotation[++annotation_pos]++; 
        }
        //continues subtitles
        else if(current_rank == prev_rank){
          current_annotation[annotation_pos]++; 
        }
        //goes back to a main title
        else if(current_rank < prev_rank){
          var current_pos = current_rank - base_rank;
          for(var j=annotation_pos; j > (current_pos); j--){
            current_annotation[j] = 0; //reset current sub-annotation
          }
          annotation_pos = current_pos;
          current_annotation[annotation_pos]++; 
        }

        prev_rank = current_rank;

        var annotation_result = current_annotation[0];
        for(var i = 1; i < current_annotation.length; i++){
          if(current_annotation[i] != 0){
             annotation_result += ("." + current_annotation[i]); 
          } 
        }

        jQuery(this).prepend("<span role='annotation'>" + annotation_result + "</span> ");

      })
     }
     
   });
});
