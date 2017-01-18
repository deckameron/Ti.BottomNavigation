exports.create = function(params){
	
	var activeFontColor = params.activeFontColor || "#FFFFFF";
	
	var buttonsSpecs = params.buttons || [];
	var buttons = [];
	var lastVisibleView = 0;
	var activeIconTop = 2;
	var inactiveIconTop = params.hideInactiveButtonTitle ? 12 : 4;
	var animationDuration = 100;
	var LabelAnimationDuration = 80;
	var InactivelabelOpacity = params.hideInactiveButtonTitle ? 0 : 0.6;
	var lastVisibleView = 0;
	var screenWidth = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.logicalDensityFactor;
	var buttonWidth = screenWidth / buttonsSpecs.length;
	
	Titanium.API.info('screenWidth : ' +  screenWidth);
	Titanium.API.info('buttonWidth : ' + buttonWidth);
	var maior = buttonWidth * ( 1 + ((buttonsSpecs.length - 1) / 10 ));
	Titanium.API.info('maior : ' + maior);
	var difMaiorNormal = maior - buttonWidth;
	Titanium.API.info('difMaiorNormal : ' + difMaiorNormal);
	var difNormalMenor = difMaiorNormal / (buttonsSpecs.length - 1);
	Titanium.API.info('difNormalMenor : ' + difNormalMenor);
	var menor = buttonWidth - difNormalMenor;
	Titanium.API.info('menor : ' + menor);
	var total = ((buttonsSpecs.length - 1) * menor) + maior;
	Titanium.API.info('total : ' + total);
	
	for(var i = 0; i < buttonsSpecs.length; i++){
		
		buttonsSpecs[i]['font'] = {
			fontSize : 12
		};
		
		if(i == 0){
			buttonsSpecs[i]['transform'] = Titanium.UI.create2DMatrix().scale(1, 1, 1.16, 1.16); 
		}
	}
	
	var bottomNavigationWrapper = Titanium.UI.createView({
		height : 56,
		elevation : 12,
		left : 0,
		right : 0,
		bottom : 0,
		backgroundColor : params.backgroundColor,
	});
	
	var bottomNavigation = Titanium.UI.createView({
		height : Titanium.UI.FILL,
		width : Titanium.UI.FILL,
		layout : 'horizontal',
		zIndex : 3
	});
	bottomNavigationWrapper.add(bottomNavigation);
	
	var canChangeTab = true;
	for (var i = 0; i < buttonsSpecs.length; i++) {
	
		var wrapper = Titanium.UI.createView({
			height : Titanium.UI.FILL,
			//left : buttonWidth * i,
			width : params.hideInactiveButtonTitle ? i == 0 ? maior : menor : buttonWidth,
			index : i
		});
		bottomNavigation.add(wrapper);
	
		var rippleView = Titanium.UI.createView({
			height : 110,
			width : 110,
			borderRadius : 55,
			touchEnabled : false,
			index : i,
			zIndex : 1
		});
		wrapper.add(rippleView);
		
		wrapper.addEventListener('click', function(e) {
			if(canChangeTab){
				ChangeTab(e.source.index);
				canChangeTab = false;
				
				setTimeout(function(){
					canChangeTab = true;
				}, 400);
			}else{
				Titanium.API.warn("You can't change the tabs right now!" );
			}
		});
	
		var icon = Titanium.UI.createImageView({
			image : params.activeButtonIndex == i ? buttonsSpecs[i].activeIcon : buttonsSpecs[i].inactiveIcon,
			touchEnabled : false,
			top : i == 0 ? activeIconTop : inactiveIconTop,
			zIndex : 2
		});
		wrapper.add(icon);
	
		var label = Titanium.UI.createLabel({
			text : buttonsSpecs[i].title,
			color : i == 0 ? params.activeFontColor : params.inactiveFontColor || params.activeFontColor,
			font : buttonsSpecs[i].font,
			touchEnabled : false,
			opacity : params.inactiveFontColor ? 1 : i == 0 ? 1 : InactivelabelOpacity,
			bottom : 10,
			zIndex : 2
		});
		wrapper.add(label);
	
		buttons[i] = {
			icon : icon,
			label : label,
			rippleView : rippleView,
			wrapper : wrapper,
			backgroundColor : buttonsSpecs[i].backgroundRippeColor
		};
	}
	
	function ChangeTab(tab) {
	
	if(!params.backgroundRipple){
		Ripple({
			source : buttons[tab].rippleView,
			x : buttons[tab].rippleView.width / 2,
			y : buttons[tab].rippleView.height / 2,
			rippleColor : params.rippleColor,
			dp : true
		});
	}else{
		Ripple({
			backgroundColor : buttons[tab].backgroundColor,
			backgroundRipple : true,
			source : bottomNavigationWrapper,
			x : buttons[tab].wrapper.rect.x + (buttons[tab].wrapper.rect.width / 2),
			y : buttons[tab].wrapper.rect.y + (buttons[tab].wrapper.rect.height / 2),
			dp : true
		});
	}
	
	if (tab == lastVisibleView) {
		return;
	}
	
	if(params.hideInactiveButtonTitle){
		for(var t = 0; t < buttons.length; t++){
			if(t != tab){
				buttons[t].wrapper.animate({
					width : menor,
					duration : 100
				});
			}else{
				buttons[t].wrapper.animate({
					width : maior,
					duration : 100
				});
			}
		}
	}
	
	//DO WHATEVER YOU NEED HERE------
	bottomNavigationWrapper.fireEvent('clicked', {
		index : tab
	});
	//-------------------------------

	//ACTIVE TAB ====================================================================
	//button
	buttons[tab].icon.setImage(buttonsSpecs[tab].activeIcon);
	buttons[tab].icon.animate({
		top : activeIconTop,
		duration : animationDuration
	});

	//title
	var activeLabelAnimationParams = {
		transform : Titanium.UI.create2DMatrix().scale(1, 1, 1.16, 1.16),
		duration : LabelAnimationDuration
	};

	if(params.inactiveFontColor){
		if(Titanium.Platform.osname == 'android'){
			buttons[tab].label.setColor(params.activeFontColor);
		}else{
			activeLabelAnimationParams['color'] = params.activeFontColor;
		}
	}else{
		activeLabelAnimationParams['opacity'] = 1;
	}

	buttons[tab].label.animate(activeLabelAnimationParams);
	//=================================================================================
	//INACTIVE TAB ====================================================================
	//button
	buttons[lastVisibleView].icon.setImage(buttonsSpecs[lastVisibleView].inactiveIcon);
	buttons[lastVisibleView].icon.animate({
		top : inactiveIconTop,
		duration : animationDuration
	});

	//title
	var inactiveLabelAnimationParams = {
		transform : Titanium.UI.create2DMatrix().scale(1.16, 1.16, 1, 1),
		duration : LabelAnimationDuration
	};

	if(params.inactiveFontColor){
		if(Titanium.Platform.osname == 'android'){
			buttons[lastVisibleView].label.setColor(params.inactiveFontColor);
		}else{
			inactiveLabelAnimationParams['color'] = params.inactiveFontColor;
		}
	}else{
		inactiveLabelAnimationParams['opacity'] = InactivelabelOpacity;
	}

	buttons[lastVisibleView].label.animate(inactiveLabelAnimationParams);
	//=================================================================================
	
	lastVisibleView = tab;
}
	
	return bottomNavigationWrapper;
};

function Ripple(e) {

	if(e && e.source){
		e.source.touchEnabled = false;
	}
	
	var OS_IOS = Titanium.Platform.osname != 'android';
	var _x = (OS_IOS || e.dp) ? e.x : (e.x / Ti.Platform.displayCaps.logicalDensityFactor);
	var _y = (OS_IOS || e.dp) ? e.y : (e.y / Ti.Platform.displayCaps.logicalDensityFactor);

	// Max & Min value from Width and Height of our clicked view.
	// This way we can make the circle big enough to fit the view.
	var maxHeightWidth = Math.max(e.source.rect.width, e.source.rect.height);
	var minHeightWidth = Math.min(e.source.rect.width, e.source.rect.height);
	
	var backgroundColor = e.rippleColor || '#FFF';
	var maxOpacity = 0.3;
	var minOpacity = 0.0;
	
	if(e.backgroundColor){
		backgroundColor = e.backgroundColor;
		maxOpacity = 1;
		minOpacity = maxOpacity;
	}
	
	// Our circle that will be scaled up using 2dMartix.
	e.source.ripple = Titanium.UI.createView({
		borderRadius : minHeightWidth / 2,
		height : minHeightWidth,
		width : minHeightWidth,
		center : {
			x : _x,
			y : _y
		},
		backgroundColor : backgroundColor,
		zIndex : 1,
		opacity : minOpacity,
		touchEnabled : false
	});
	// Add the ripple view inside the clicked view
	if(e && e.source){
		e.source.add(e.source.ripple);
	}

	// Use chainAnimate to sequence the animation steps.
	// We'll position the view at the center of the click position, by using the center property).
	e.source.ripple.anim_1 = Titanium.UI.createAnimation({
		center : {
			x : _x,
			y : _y
		},
		duration : 0,
		opacity : maxOpacity,
		transform : Ti.UI.create2DMatrix().scale(20 / maxHeightWidth)
	});

	e.source.ripple.anim_1.addEventListener('complete', function() {
		if(e.source.ripple && e.source.ripple.anim_2){
			Titanium.API.info('Completed - Animation 1');
			e.source.ripple.animate(e.source.ripple.anim_2);
		}
	});

	e.source.ripple.anim_2 = Titanium.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN,
		duration : 250,
		opacity : minOpacity,
		transform : Ti.UI.create2DMatrix().scale((maxHeightWidth * 2) / minHeightWidth)
	});

	e.source.ripple.anim_2.addEventListener('complete', function() {
		if(e.source.ripple && e.source.ripple.anim_3){
			Titanium.API.info('Completed - Animation 2');
			try{
				e.source.ripple.animate(e.source.ripple.anim_3);
			}catch(e){
				Titanium.API.error(e);
			}
		}
	});

	e.source.ripple.anim_3 = Titanium.UI.createAnimation({
		opacity : minOpacity,
		duration : 100,
		curve : Ti.UI.ANIMATION_CURVE_LINEAR
	});

	e.source.ripple.anim_3.addEventListener('complete', function() {
		if(e && e.source){
			Titanium.API.info('Completed - Animation 3');
			
			if(e.backgroundRipple && e.backgroundColor){
				e.source.setBackgroundColor(e.backgroundColor);
			}
			
			e.source.touchEnabled = true;
			e.source.remove(e.source.ripple);
			e.source.ripple = null;
		}
	});
	
	if(e.source.ripple && e.source.ripple.anim_1){
		e.source.ripple.animate(e.source.ripple.anim_1);
	}
};
