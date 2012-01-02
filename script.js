    /*
     *Image Resizing - resize images to fill or fit parent element
     *================================================
     *
     */
    
    (function($){
	//function to flex image
        var resizeImage = function(img, parent){

            switch(parent.orientation){
                case 'lanscape' : {
                    var ratio = parent.width / img.width,
                        height = img.height * ratio,
                        width = parent.width,
                        overflow = (height - parent.height ) / 2;
                    //Set height to window width then get ratio multiply height by ratio
                    $(img.ele)
                        .attr({
                            width: width,
                            height : height
                        })
                        .css({
                            marginTop: -overflow ,
                            marginLeft: 0
                        });
                        break;

                }
                case 'portrait' : {
                    var ratio = parent.height / img.height,
                        width = img.width * ratio,
                        height = parent.height,
                        overflow = (width - parent.width ) / 2;
                    //Set height to window width then get ratio multiply height by ratio
                    $(img.ele)
                        .attr({
                            width: width,
                            height : height
                        })
                        .css({
                            marginLeft: -overflow,
                            marginTop: 0
                        });
                        break;
                }
            }
            $(img.ele).removeClass('invisible');
        };
	
	
	$.fn.image = function(type){
	    
	    var ele = this,
		    imgEle = ele.find('img'),
		    parent = {
			height: ele.height(),
			width: ele.width()
		    },
		    img = {
			ele : imgEle,
			width: imgEle.width(),
			height: imgEle.height()
		    }
		    
		    img.ratio = img.height / img.width;
		    img.orientation = (img.height > img.width) ? 'portrait' : 'lanscape';
		    parent.orientation = (parent.height > parent.width || parent.ratio > img.ratio) ? 'portrait' : (parent.height === parent.width && img.orientation === 'lanscape') ? 'portrait' : 'lanscape';
		    
		    resizeImage(img, parent);
		    //console.log(parent);
	    
	};
	    	
    }(jQuery));
    
    /*
     * Larger Slider - Animations are based in CSS3 so IE will fallback to no animations
     * =================================================
     * simple plugin and utility to slide through a list
     *
     */
    (function($){
        
        var ele = null,
            els = null,
            next,
            slider = {
                data : {
                   current : null,
                   size : null,
                   slides : null
                },
                cue : function(dir){
                   //console.log({current : slider.data.current, direction: dir, size : slider.data.size}); 
                },
                transition : function(dir){
                    var prev = (dir === 'plus') ? 'addClass' : 'removeClass';
                    window.setTimeout(function(){
                        $(els[next]).addClass('current animate');
                        $(els[slider.data.current]).removeClass('current')[prev]('previous');
                        
                        slider.data.current = next;
                        
                        slider.callback({current: slider.data.current});
                    }, 100);
                },
                events : {
                    next : function(){
                        
                        next = (slider.data.current + 2 > slider.data.size) ? 0 : slider.data.current + 1;
                        
                        $(els[next]).removeClass('previous animate');
                        
                        slider.transition('plus');
                        
                    },
                    prev : function(){
                        
                        next = (slider.data.current - 1 < 0) ? slider.data.size - 1 : slider.data.current - 1;
                        
                        $(els[next]).removeClass('animate').addClass('previous');
                        
                        slider.transition('minus');
                        
                    },
                    attach : function(){
                        $('.next, .prev').bind('click', function(){                          
                            
                            if($(this).hasClass('next')){
                                
                                slider.events.next();
                                
                            }else{
                                
                                 slider.events.prev();                                       
                                
                            }
                            
                        })
                    }
                },
                start : function(){
                    
                    slider.data.slides = els;
                    slider.data.size = els.length;
                    slider.data.current = 0;
                    
                    $(els[0]).addClass('current');
                    
                    window.setTimeout(function(){
                            $(els[0]).addClass('animate');    
                    })
                    
                    slider.events.attach();
                    
                }
            }
            
            $.fn.slide = function(callback){
                ele = $(this),
                els = ele.find('li');
                slider.callback = callback;
                
                slider.start();
                
                callback({current: 0});
                
                return this;
            
            };
            
            $.slide = {
                kill: function(){
                    $('.next, .prev').unbind('click');
                },
                thumbs : function(i){
                    
                    next  = i;
                    $(els[next]).removeClass('previous animate');
                    
                    slider.transition('plus');
                }
            }
    
    }(jQuery));
    
    /*
     * Small Thumbs - Animations are based in CSS3 so IE will fallback to no animations
     * =================================================
     * simple plugin and utility to slide through a list
     *
     */
    
    (function($){
        
        var ele = null,
            els = null,
            thumbs ={
                data : {
                    els : null,
                    thumbnails : {
                        size: null,
                        width: null
                    },
                    gutter : {
                        ele : null,
                        width: null
                    },
                    width : null,
                    limit: null,
                    current : null
                },
                transition : function(){
                    
                },
                events : {
                    cue : function(){
                        
                        var prev = $('.thumb-prev'),
                            next = $('.thumb-next');
                        
                        //console.log({current : thumbs.data.current, next : thumbs.data.current - thumbs.data.width, prev : thumbs.data.current + thumbs.data.width})                        
                        
                        if(thumbs.data.current + thumbs.data.width > 10 ){
                            prev.hide();
                        }else{
                            prev.show();
                        }
                        
                        if(thumbs.data.current - thumbs.data.width - 10 <= thumbs.data.limit ){
                            next.hide();
                        }else{
                            next.show();
                        }
                        
                        
                    },
                    next : function(){
                        
                        $(thumbs.data.gutter.ele).find('ul').css('left', thumbs.data.current - thumbs.data.width);
                        
                        thumbs.data.current = thumbs.data.current - thumbs.data.width;
                        
                        thumbs.events.cue();
                        
                    },
                    prev : function(){
                        
                        $(thumbs.data.gutter.ele).find('ul').css('left', thumbs.data.current + thumbs.data.width);
                        
                        thumbs.data.current = thumbs.data.current + thumbs.data.width;
                        
                        thumbs.events.cue();
                        
                    },
                    attach : function(){
                        
                        thumbs.events.cue();                                                
                        
                        $('.thumb-next, .thumb-prev').bind('click', function(){
                        
                            if ($(this).hasClass('thumb-next')){
                                thumbs.events.next();
                            }else{
                                thumbs.events.prev();
                            }
                            
                        });
                        
                        $(thumbs.data.els).bind('click', function(){
                            
                            var i = $(this).index();
                            
                            //console.log(i)
                            
                            $.slide.thumbs(i);                     
                            
                        })
                    }
                },
            
		build  : function(){
		    
		    
		    
		    ele.find('li').each(function(){
			
			$(this).clone().appendTo('.thumbs ul');
			
		    });
		    
		    thumbs.data.els = thumbs.data.gutter.ele.find('li');
		    thumbs.data.thumbnails.width = thumbs.data.els.width();
		    thumbs.data.thumbnails.width = thumbs.data.thumbnails.width + parseFloat(thumbs.data.els.css('margin-left'));
		    thumbs.data.gutter.width = (thumbs.data.thumbnails.width + 9) * thumbs.data.thumbnails.size;
		    thumbs.data.gutter.width = ( thumbs.data.width > thumbs.data.gutter.width ) ? thumbs.data.width : thumbs.data.gutter.width;
		    
		    console.log(thumbs);
		    var done = true;
		    
		    for(i = 0; done; i+= 1){
			
			if(thumbs.data.width * i === thumbs.data.gutter.width || thumbs.data.width * i > thumbs.data.gutter.width && thumbs.data.width * ( i - 1 ) < thumbs.data.gutter.width){
			    
			    done = false;
			    
			    thumbs.data.limit =  - (thumbs.data.width * i);
			    
			    console.log(thumbs.data.width * i);
			
			}
			
		    }
		    
		    $(thumbs.data.els).each(function(){
			
			var parent = $(this);
		    
			parent.find('img').load(function(){
			
			    $(this).addClass('loaded');
			    
			    parent.image('fill');                    
			    
			})    
			
		    })
		    
		    thumbs.data.current = 10;
		    
		    $(thumbs.data.gutter.ele)
			.height(thumbs.data.thumbnails.width)
			.find('ul')
			.width(thumbs.data.gutter.width);
			
		    thumbs.events.attach();
	
		}
	    }
            
            
            $.fn.thumbs = function(){
                
                ele = $(this);
                els = ele.find('li');
                thumbs.data.thumbnails.size = els.length;
                
                thumbs.data.gutter.ele = $('.thumbs');
                thumbs.data.width = thumbs.data.gutter.ele.width();
                
		console.log('Building thumbnails...');

		thumbs.build();                
            
            }
            
            $.thumbs = {
		
		current : function(i){

		    $(thumbs.data.els).removeClass('current-thumb');
		    $(thumbs.data.els[i]).addClass('current-thumb');                
                
		},
		kill : function(){
		    $('.thumb-next, .thumb-prev').unbind('click');
		}
	    }
            
                
            
    
    }(jQuery));
    
    /* 
     * Gallery Plugin - Dependent on $.fn.slide, $.fn.thumbs, $.fn.gallery and, $.fn.resizeImage
     * ======================================================================================
     * Handles the creation gallery Elements & initiates all other plugin assets
     * 
     */
    
    
    (function($){
	
	    var ele, wrap,
		thumbs,
		init = {
		    slider : function(){
			ele.slide(function(e){
			    //console.log(e);
			    $.thumbs.current(e.current);   
			
			}); 
		    },
		    thumbs : function(){
			
			ele.thumbs();
			
			init.slider();			
			
		    }
		    
		},
		build = {

		    assets : function(){
		
			wrap.append('<div class=thumbs >\
						    <ul></ul>\
						    <div class="clear"></div>\
						    <div class=l ></div>\
						    <div class=r ></div>\
						</div>\
						<a class=next ></a>\
						<a class=prev ></a>\
						<a class=thumb-next ></a>\
						<a class=thumb-prev ></a>');
			
			thumbs = $('.thumbs');			
			
			init.thumbs();
			
		    },
		    
		    wrap : function(){
			
			ele
			    .append('<div class=l ></div><div class=r ></div>')
			    .wrap('<div class="slider-wrap" />"');
		    
			wrap = $('.slider-wrap');
			
			build.assets();
			
		    }  
		    
		};
		
		$.fn.gallery = function(){
		    ele = $(this);
		    
		    build.wrap();
		}
		
		$.gallery = {
		    swap : function(list){
			
			console.log('Swapping media........');
			
			ele.remove();
			
			thumbs
			    .children('ul:first')
			    .css('left', 10)
			    .children('*')
			    .remove();
			
			wrap.prepend(list);
			
			$.slide.kill();
			
			$.thumbs.kill();
			
			ele = wrap.children('ul:first');
			
			init.thumbs();
			
		    }
		}
	
    }(jQuery))