(function($) {

  $.fn.menumaker = function(options) {
      
      var cssmenu = $(this), settings = $.extend({
        title: "Menu",
        format: "dropdown",
        sticky: false
      }, options);
      
      //for the main
      return this.each(function() {
        cssmenu.prepend('<div id="menu-button">' + settings.title + '</div>'); //set the name [Menu] and use css add the button
        $(this).find("#menu-button").on('click', function(){
          $(this).toggleClass('menu-opened'); //variable for a new class
          var mainmenu = $(this).next('ul'); // find all the main elements[home,admin,logout]etc
          if (mainmenu.hasClass('open')) { 
            mainmenu.hide().removeClass('open');
          }
          else {
             mainmenu.show().addClass('open');
            if (settings.format === "dropdown") {
              mainmenu.find('ul').show();
            }
          }
        });

        cssmenu.find('li ul').parent().addClass('has-sub');
         
        //add a '+' symbol to the main which has a sub
        multiTg = function() {
          cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
          cssmenu.find('.submenu-button').on('click', function() {
            $(this).toggleClass('submenu-opened');
            if ($(this).siblings('ul').hasClass('open')) {
              $(this).siblings('ul').removeClass('open').hide();
            }
            else {
              $(this).siblings('ul').addClass('open').show();
            }
          });
        };

        if (settings.format === 'multitoggle') multiTg();
        else cssmenu.addClass('dropdown');
        
        //Menu bar sticks to the top of the page
        if (settings.sticky === true) cssmenu.css('position', 'fixed');
         
        //Function for detecting the width.
        resizeFix = function() {
          //the original menu bar is shown again ,if> 768
          if ($( window ).width() > 768) {
            cssmenu.find('ul').show();
          }

         //the small one is shown again ,if <= 768
          if ($(window).width() <= 768) {
            cssmenu.find('ul').hide().removeClass('open');
          }
        };
        resizeFix();
        return $(window).on('resize', resizeFix); 

      });
  };
});

(function($){
$(document).ready(function(){

$(document).ready(function() {
  $("#cssmenu").menumaker({
    title: "Menu",
    format: "multitoggle"
  });

//for the menu-line(blue)
  $("#cssmenu").prepend("<div id='menu-line'></div>");

var foundActive = false; 
var activeElement, linePosition = 0;
var menuLine = $("#cssmenu #menu-line"); 
var lineWidth, defaultPosition, defaultWidth;

$("#cssmenu > ul > li").each(function() {
  if ($(this).hasClass('active')) {
    activeElement = $(this);
    foundActive = true;
  }
});

if (foundActive === false) {
  activeElement = $("#cssmenu > ul > li").first();
}

defaultWidth = lineWidth = activeElement.width();

defaultPosition = linePosition = activeElement.position().left;

menuLine.css("width", lineWidth);
menuLine.css("left", linePosition);

$("#cssmenu > ul > li").hover(function() {
  activeElement = $(this);
  lineWidth = activeElement.width();
  linePosition = activeElement.position().left;
  menuLine.css("width", lineWidth);
  menuLine.css("left", linePosition);
}, 
function() {
  menuLine.css("left", defaultPosition);
  menuLine.css("width", defaultWidth); });

 });


  });

});
