//BOTTOM NAVIGATION
var BottomNavigation = require('/BottomNavigation');

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

var buttonsSpecs = [
	{
		title : 'First',
		activeIcon : '/images/ic_parceiros_ativo.png',
		inactiveIcon : '/images/ic_parceiros_inativo.png',
		backgroundRippeColor : '#009688',
	},
	{
		title : 'Second',
		activeIcon : '/images/ic_promocoes_ativo.png',
		inactiveIcon : '/images/ic_promocoes_inativo.png',
		backgroundRippeColor : '#3F51B5',
	},
	{
		title : 'Third',
		activeIcon : '/images/ic_meus_cartoes_ativo.png',
		inactiveIcon : '/images/ic_meus_cartoes_inativo.png',
		backgroundRippeColor : '#795548',
	}
]; 

var bottomNavigation = BottomNavigation.create({
	buttons : buttonsSpecs,
	activeButtonIndex : 0,
	activeFontColor : "#FFFFFF",
	//inactiveFontColor : "#A8A8A8",
	//rippleColor : "#4DB6AC",
	backgroundColor : '#00796B',
	backgroundRipple : true,
	hideInactiveButtonTitle : true
});
window.add(bottomNavigation);

bottomNavigation.addEventListener('clicked', function(e){
	scrollableView.scrollToView(e.index);
});

window.open(); 
