//BOTTOM NAVIGATION
var window = Ti.UI.createWindow({
	backgroundColor : 'white'
});

var view1 = Titanium.UI.createView({backgroundColor : '#FFA000'});
var view2 = Titanium.UI.createView({backgroundColor : '#F57C00'});
var view3 = Titanium.UI.createView({backgroundColor : '#E64A19'});

var scrollableView = Titanium.UI.createScrollableView({
	views : [view1, view2, view3],
	scrollingEnabled : false,
	zIndex : 1
});
window.add(scrollableView);

//NAVIGATION BUTTON ========================================
var inactiveFontColor = "#CCCCCC";
var activeFontColor = "#FFFFFF";
var lastVisibleView = 0;
var activeIconTop = 2;
var inactiveIconTop = 4;
var animationDuration = 150;
var lastVisibleView = 0;

var navigationButton = Titanium.UI.createView({
	height : 56,
	left : 0,
	right : 0,
	bottom : 0,
	backgroundColor : '#00796B',
	zIndex : 10
});
window.add(navigationButton);

var buttonSpecs = [{
	title : 'First',
	icon : '/images/ic_parceiros_ativo.png',
	active : '/images/ic_parceiros_ativo.png',
	inactive : '/images/ic_parceiros_inativo.png',
	color : activeFontColor,
	transform : Titanium.UI.create2DMatrix().scale(1, 1, 1.16, 1.16),
	font : {
		fontSize : 12
	}
}, {
	title : 'Second',
	icon : '/images/ic_promocoes_inativo.png',
	active : '/images/ic_promocoes_ativo.png',
	inactive : '/images/ic_promocoes_inativo.png',
	color : activeFontColor,
	font : {
		fontSize : 12
	}
}, {
	title : 'Third',
	icon : '/images/ic_meus_cartoes_inativo.png',
	active : '/images/ic_meus_cartoes_ativo.png',
	inactive : '/images/ic_meus_cartoes_inativo.png',
	color : activeFontColor,
	font : {
		fontSize : 12
	}
}];

var buttons = [];
var buttonWidth = (Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.logicalDensityFactor) / buttonSpecs.length;

for (var i = 0; i < buttonSpecs.length; i++) {

	var wrapper = Titanium.UI.createView({
		height : Titanium.UI.FILL,
		left : buttonWidth * i,
		width : buttonWidth,
		index : i
	});
	navigationButton.add(wrapper);

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
		ChangeTab(e.source.index);
	});

	var icon = Titanium.UI.createImageView({
		image : buttonSpecs[i].icon,
		touchEnabled : false,
		top : i == 0 ? activeIconTop : inactiveIconTop,
		zIndex : 2
	});
	wrapper.add(icon);

	var label = Titanium.UI.createLabel({
		text : buttonSpecs[i].title,
		color : buttonSpecs[i].color,
		font : buttonSpecs[i].font,
		touchEnabled : false,
		bottom : 10,
		zIndex : 2
	});
	wrapper.add(label);

	buttons[i] = {
		icon : icon,
		label : label,
		rippleView : rippleView
	};
}

function ChangeTab(tab) {

	if (tab == lastVisibleView) {
		return;
	}
	
	//DO WHATEVER YOU NEED HERE---------------------------------
	scrollableView.scrollToView(tab);
	//----------------------------------------------------------

	//ACTIVE TAB
	buttons[tab].icon.setImage(buttonSpecs[tab].active);
	buttons[tab].icon.animate({
		top : activeIconTop,
		duration : animationDuration
	});
	buttons[tab].label.animate({
		transform : Titanium.UI.create2DMatrix().scale(1, 1, 1.16, 1.16),
		opacity : 1,
		duration : animationDuration
	});

	//INACTIVE TAB
	buttons[lastVisibleView].icon.setImage(buttonSpecs[lastVisibleView].inactive);
	buttons[lastVisibleView].icon.animate({
		top : inactiveIconTop,
		duration : animationDuration
	});
	buttons[lastVisibleView].label.animate({
		transform : Titanium.UI.create2DMatrix().scale(1.16, 1.16, 1, 1),
		opacity : 0.6,
		duration : animationDuration
	});

	Ripple({
		source : buttons[tab].rippleView,
		x : buttons[tab].rippleView.width / 2,
		y : buttons[tab].rippleView.height / 2,
		dp : true
	});

	lastVisibleView = tab;
}

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

	// Our circle that will be scaled up using 2dMartix.
	e.source.ripple = Titanium.UI.createView({
		borderRadius : minHeightWidth / 2,
		height : minHeightWidth,
		width : minHeightWidth,
		center : {
			x : _x,
			y : _y
		},
		backgroundColor : "#FFFFFF",
		zIndex : 999,
		opacity : 0,
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
		opacity : 0.3,
		transform : Ti.UI.create2DMatrix().scale(20 / maxHeightWidth)
	});

	e.source.ripple.anim_1.addEventListener('complete', function() {
		if(e.source.ripple && e.source.ripple.anim_2){
			e.source.ripple.animate(e.source.ripple.anim_2);
		}
	});

	e.source.ripple.anim_2 = Titanium.UI.createAnimation({
		curve : Ti.UI.ANIMATION_CURVE_EASE_IN,
		duration : 250,
		opacity : 0.0,
		transform : Ti.UI.create2DMatrix().scale((maxHeightWidth * 2) / minHeightWidth)
	});

	e.source.ripple.anim_2.addEventListener('complete', function() {
		if(e.source.ripple && e.source.ripple.anim_3){
			try{
				e.source.ripple.animate(e.source.ripple.anim_3);
			}catch(e){
				Titanium.API.error(e);
			}
		}
	});

	e.source.ripple.anim_3 = Titanium.UI.createAnimation({
		opacity : 0.0,
		duration : 100,
		curve : Ti.UI.ANIMATION_CURVE_LINEAR
	});

	e.source.ripple.anim_3.addEventListener('complete', function() {
		if(e && e.source){
			e.source.touchEnabled = true;
			e.source.remove(e.source.ripple);
			e.source.ripple = null;
		}
	});
	
	if(e.source.ripple && e.source.ripple.anim_1){
		e.source.ripple.animate(e.source.ripple.anim_1);
	}
};

window.open(); 
