# Ti.BottomNavigation
Material Design Bottom Navigation Controller for Appcelerator Titanium

### Usage
```javascript
var buttonsSpecs = [
	{
		title : 'First',
		activeIcon : '/images/ic_first_active.png',
		inactiveIcon : '/images/ic_first_inactive.png',
		backgroundRippeColor : '#009688',
	},
	{
		title : 'Second',
		activeIcon : '/images/ic_second_active.png',
		inactiveIcon : '/images/ic_second_inactive.png',
		backgroundRippeColor : '#3F51B5',
	},
	{
		title : 'Third',
		activeIcon : '/images/ic_third_active.png',
		inactiveIcon : '/images/ic_third_inactive.png',
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
	//TODO
});
```

![alt tag](https://github.com/deckameron/Ti.BottomNavigation/blob/master/components_bottomnavigation_spec_fixedbottomnav.gif)
