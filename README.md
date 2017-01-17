# Ti.BottomNavigation
Material Design Bottom Navigation Controller for Appcelerator Titanium

### Usage
```javascript
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
	backgroundRipple : true,
	hideInactiveButtonTitle : true
});
window.add(bottomNavigation);

bottomNavigation.addEventListener('click', function(e){
	scrollableView.scrollToView(e.index);
});
```

![alt tag](https://github.com/deckameron/Ti.BottomNavigation/blob/master/components_bottomnavigation_spec_fixedbottomnav.gif)
