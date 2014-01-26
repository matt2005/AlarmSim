var SlideList = new Class({
	initialize: function(menu, options) {
		this.setOptions(this.getOptions(), options);
		
		this.menu = $(menu), this.current = this.menu.getElement('li.current');
		
		this.menu.getElements('li').each(function(item){
			item.addEvent('mouseover', function(){ this.moveBg(item); }.bind(this));
			item.addEvent('mouseout', function(){ this.moveBg(this.current); }.bind(this));
			item.addEvent('click', function(event){ this.clickItem(event, item); }.bind(this));
		}.bind(this));
				
		this.back = new Element('li').addClass('background').adopt(new Element('div').addClass('left')).injectInside(this.menu);
		this.back.fx = this.back.effects(this.options);
		if(this.current) this.setCurrent(this.current);
	},
	
	setCurrent: function(el, effect){
		this.back.setStyles({left: (el.offsetLeft)+'px', width: (el.offsetWidth)+'px'});
		(effect) ? this.back.effect('opacity').set(0).start(1) : this.back.setOpacity(1);
		this.current = el;
	},
	
	getOptions: function(){
		return {
			transition: Fx.Transitions.sineInOut,
			duration: 500, wait: false,
			onClick: Class.empty
		};
	},

	clickItem: function(event, item) {
		if(!this.current) this.setCurrent(item, true);
		this.current = item;
		this.options.onClick(new Event(event), item);
	},

	moveBg: function(to) {
		if(!this.current) return;
		this.back.fx.custom({
			left: [this.back.offsetLeft, to.offsetLeft],
			width: [this.back.offsetWidth, to.offsetWidth]
		});
	}
});

SlideList.implement(new Options);