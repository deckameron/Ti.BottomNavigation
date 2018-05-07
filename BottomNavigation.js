exports.create = function(params) {

    var activeFontColor = params.activeFontColor || "#FFFFFF";
    
    var activeTab = params.activeTab || 0;
    var lastVisibleView = activeTab;
    var buttonsSpecs = params.buttons || [];
    
    var hideInactiveButtonTitle = params.hideInactiveButtonTitle;

    if(buttonsSpecs.length > 4){
        hideInactiveButtonTitle = true;
        Titanium.API.warn("Bottom Navigation cannot show inactive button titles with more then 4 buttons");
    }else if(buttonsSpecs.length < 4){
        hideInactiveButtonTitle = false;
        Titanium.API.warn("Bottom Navigation cannot hide inactive button titles with less then 4 buttons");
    } 
    
    var buttons = [];
    var activeIconTop = 2;
    var inactiveIconTop = params.hideInactiveButtonTitle ? 12 : 4;
    var animationDuration = 100;
    var LabelAnimationDuration = 80;
    var InactivelabelOpacity = params.hideInactiveButtonTitle ? 0 : 0.6;
    var screenWidth = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.logicalDensityFactor;
    var buttonWidth = screenWidth / buttonsSpecs.length;
    var inactiveFontColor = params.hideInactiveButtonTitle ? null : params.inactiveFontColor;

    Titanium.API.info('screenWidth : ' + screenWidth);
    Titanium.API.info('buttonWidth : ' + buttonWidth);
    var maior = buttonWidth * (1 + ((buttonsSpecs.length - 1) / 10 ));
    Titanium.API.info('maior : ' + maior);
    var difMaiorNormal = maior - buttonWidth;
    Titanium.API.info('difMaiorNormal : ' + difMaiorNormal);
    var difNormalMenor = difMaiorNormal / (buttonsSpecs.length - 1);
    Titanium.API.info('difNormalMenor : ' + difNormalMenor);
    var menor = buttonWidth - difNormalMenor;
    Titanium.API.info('menor : ' + menor);
    var total = ((buttonsSpecs.length - 1) * menor) + maior;
    Titanium.API.info('total : ' + total);

    for (var i = 0; i < buttonsSpecs.length; i++) {

        buttonsSpecs[i]['font'] = {
            fontSize : 12
        };

        if (i == activeTab) {
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
            width : params.hideInactiveButtonTitle ? i == activeTab ? maior : menor : buttonWidth,
            index : i
        });
        bottomNavigation.add(wrapper);

        var rippleView = Titanium.UI.createView({
            height : buttonsSpecs.length > 3 ? 105 : 110,
            width : buttonsSpecs.length > 3 ? 105 : 110,
            borderRadius : buttonsSpecs.length > 3 ? 52 :  55,
            index : i,
            backgroundColor : params.backgroundColor,
            bubbleParent : true,
            touchFeedback : true,
            touchFeedbackColor : "#75FFFFFF",
            zIndex : 1
        });
        wrapper.add(rippleView);

        rippleView.addEventListener('click', function(e) {
            if (canChangeTab) {
                
                ChangeTab(e.source.index);
                canChangeTab = false;

                setTimeout(function() {
                    canChangeTab = true;
                }, 400);
                
            } else {
                Titanium.API.warn("You can't change the tabs right now!");
            }
        });

        var icon = Titanium.UI.createImageView({
            image : params.activeTab == i ? buttonsSpecs[i].activeIcon : buttonsSpecs[i].inactiveIcon,
            touchEnabled : false,
            top : i == activeTab ? activeIconTop : inactiveIconTop,
            zIndex : 2
        });
        wrapper.add(icon);

        var label = Titanium.UI.createLabel({
            text : buttonsSpecs[i].title,
            color : i == activeTab ? params.activeFontColor : inactiveFontColor || params.activeFontColor,
            font : buttonsSpecs[i].font,
            touchEnabled : false,
            opacity : inactiveFontColor ? 1 : i == activeTab ? 1 : InactivelabelOpacity,
            bottom : 10,
            zIndex : 2
        });
        wrapper.add(label);

        buttons[i] = {
            icon : icon,
            label : label,
            wrapper : wrapper,
            backgroundColor : buttonsSpecs[i].backgroundRippeColor
        };
    }

    function ChangeTab(tab) {

        if (tab == lastVisibleView) {
            return;
        }
        
        if(buttonsSpecs[tab].backgroundColor){
            bottomNavigationWrapper.animate({
                duration : 150,
                backgroundColor : buttons[tab].backgroundColor
            });
        }

        if (params.canExpandTabOnSelect) {
            for (var t = 0; t < buttons.length; t++) {
                if (t != tab) {
                    buttons[t].wrapper.animate({
                        width : menor,
                        duration : 100
                    });
                } else {
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

        if (inactiveFontColor) {
            if (Titanium.Platform.osname == 'android') {
                buttons[tab].label.setColor(params.activeFontColor);
            } else {
                activeLabelAnimationParams['color'] = params.activeFontColor;
            }
        } else {
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

        if (inactiveFontColor) {
            if (Titanium.Platform.osname == 'android') {
                buttons[lastVisibleView].label.setColor(inactiveFontColor);
            } else {
                inactiveLabelAnimationParams['color'] = inactiveFontColor;
            }
        } else {
            inactiveLabelAnimationParams['opacity'] = InactivelabelOpacity;
        }

        buttons[lastVisibleView].label.animate(inactiveLabelAnimationParams);
        //=================================================================================

        lastVisibleView = tab;
    }

    return bottomNavigationWrapper;
};
