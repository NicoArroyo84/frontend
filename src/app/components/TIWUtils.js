/* eslint-disable */
/* ==============================================================================================================
   Author:		Nicolas Arroyo
   Create date: 03-03-2014
   Description:	create an div layer placed either an object or an element supplied, with a loading animation
   ============================================================================================================== */


(function () {

  "use strict";
    angular.element.loadingLayerTIW = function (opts) {
        var options = angular.element.extend({}, angular.element.loadingLayerTIW.defaults, opts);
        angular.element("body").css("overflow", "auto")
                 .unbind("touchmove");
        if (angular.element("#loadingLayerTIW").length) {
            angular.element("#loadingLayerTIW").remove();
            return false;
        }
        if (options.close) {
            return false;
        }

        angular.element("body").css("overflow", "hidden");
        angular.element('body').bind('touchmove', false);

        var $container = angular.element(document),
            $div = angular.element("<div id='loadingLayerTIW'><span><img src='app/images/ajax-loader.gif'></span></div>"),
            $img = $div.find("img"),
            scrollBarWidth = 12;
        if (options.container == null) {
            $div.css({
                position: "absolute",
                width: $container.width() + 2 + scrollBarWidth,
                height: $container.height(),
                opacity: 0.4,
                top: 0,
                backgroundColor: "black",
                zIndex: 1040
            }).find("span").css({
                position: "fixed",
                top:0
            }).end().appendTo(angular.element("body"));
            $div.find("span").css({
                marginLeft: angular.element(window).width() / 2 - ($img.width() / 2),
                marginTop: angular.element(window).height() / 2 - ($img.height() / 2)
            });
        } else {
            $container = options.container;
            $div.css({
                position: "absolute",
                width: $container.width() + 2,
                height: $container.height(),
                opacity: 0.4,
                top: $container.offset().top,
                left: $container.offset().left,
                backgroundColor: "black",
                zIndex: 1040
            }).find("span").css({
                position: "absolute",
                marginLeft: $container.width() / 2,
                marginTop: $container.height() / 2
            });
            $container.append($div);
            $div.find("span").css({
                marginLeft: ($div.width() / 2) - ($div.find("img").width() / 2),
                marginTop: ($div.height() / 2) - ($div.find("img").height() / 2)
            });

        }

    }

    angular.element.loadingLayerTIW.defaults = {
        close : false, // force to close the layer, so prevent to open a layer if not wished
        container : null
    }

}());


/* ==============================================================================================================
   Author:		Nicolas Arroyo
   Create date: 03-03-2014
   Description:	forces an input text to only have numeric values, allow decimal by parameter conf
   ============================================================================================================== */




function isStrictNumeric(str) {
    return (angular.element.isNumeric(str) && (str.indexOf(".") === -1) && (str.indexOf(" ") === -1));
}


function isStrictAlphaNumeric(str) {

    var i = str.length, key;

    for (var cont = 0; cont < i; cont++) {
        key = str.charCodeAt(cont);
        if (!(
          (key >= 48 && key <= 57) ||  //NUMBERS
          (key >= 65 && key <= 90) ||  //UPPER CASE LETTERS
          (key >= 97 && key <= 122)  //LOWER CASE LETTERS
          )) {
            return false;
        }
    }

    return true;
}


jQuery.fn.ForceNaturalNumbers = function () {
    return this.each(function () {

        angular.element(this).on("change",function() {

            if (angular.element.isNumeric(angular.element(this).val())) {
                if (parseInt(angular.element(this).val()) < 0) { angular.element(this).val(parseInt(angular.element(this).val()) + 1); }
            }
        });

    });
}


jQuery.fn.ForceStrictNumerics = function () {

    return this.each(function () {

        angular.element(this).keypress(function (e) {

            var key = e.charCode || e.keyCode || 0;

            return (
                (key >= 48 && key <= 57) ||  //NUMBERS
                (key === 8) || //BACKSPACE
                (key === 9) || //TAB
                (((e.keyCode === 35 || e.keyCode === 36 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 46) && (navigator.sayswho().indexOf("Firefox") === 0))) //END,HOME,ARROWS,DELETE FOR FIREFOX
                );
        });


        angular.element(this).on("paste", function () {
            var $input = angular.element(this),
                aux = angular.element(this).val();

            setTimeout(function () {
                if (!isStrictNumeric($input.val())) {
                    $input.val(aux);
                }
            }, 1);


        });

    });
};

jQuery.fn.ForceStrictAlphaNumerics = function (allowSpace) {

    return this.each(function () {

        angular.element(this).keypress(function (e) {

            var key = e.charCode || e.keyCode || 0;

            return (
                (key >= 48 && key <= 57) ||  //NUMBERS
                (key >= 65 && key <= 90) ||  //UPPER CASE LETTERS
                (key >= 97 && key <= 122) ||  //LOWER CASE LETTERS
                (key === 8) || //BACKSPACE
                (key === 9) || //TAB
                (key === 13) || //ENTER
                (key === 32 && allowSpace) ||
                (((e.keyCode === 35 || e.keyCode === 36 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 46) && (navigator.sayswho().indexOf("Firefox") === 0))) //END,HOME,ARROWS,DELETE FOR FIREFOX
                );
        });


        angular.element(this).on("paste", function () {
            var $input = angular.element(this),
                aux = angular.element(this).val();

            setTimeout(function () {
                if (!isStrictAlphaNumeric($input.val())) {
                    $input.val(aux);
                }
            }, 1);


        });
    });
};

jQuery.fn.ForceStrictAlpha = function (allowSpace) {

    return this.each(function () {

        angular.element(this).keypress(function (e) {

            var key = e.charCode || e.keyCode || 0;

            return (
                (key >= 65 && key <= 90) ||  //UPPER CASE LETTERS
                (key >= 97 && key <= 122) ||  //LOWER CASE LETTERS
                (key === 8) || //BACKSPACE
                (key === 9) || //TAB
                (key === 13) || //ENTER
                (key === 32 && allowSpace) ||
                (((e.keyCode === 35 || e.keyCode === 36 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || e.keyCode === 46) && (navigator.sayswho().indexOf("Firefox") === 0))) //END,HOME,ARROWS,DELETE FOR FIREFOX
                );
        });


        angular.element(this).on("paste", function () {
            var $input = angular.element(this),
                aux = angular.element(this).val();

            setTimeout(function () {
                if (!isStrictAlphaNumeric($input.val())) {
                    $input.val(aux);
                }
            }, 1);


        });
    });
};

jQuery.fn.ForceNumerics = function (decimal) {

    if (arguments[0] === undefined) {
        decimal = false;
    }

    return this.each(function () {

        angular.element(this).blur(function () {
            if (this.value[this.value.length - 1] === ".") {
                this.value = this.value.replace(".", "");
            }
        });

        angular.element(this).keydown(function (e) {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 ||
                key == 17 ||
                //((key == 67) && ctrlDown) ||
                key == 9 ||
                key == 46 ||
                (decimal && key == 110 && !this.value.contains(".")) ||
                // key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};


//Capitalizes first letter
if (typeof String.prototype.capitalize == undefined) {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}

//validates email adress
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


//Detect version of browser
navigator.sayswho = function () {
    var ua = navigator.userAgent, tem,
    M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
    return M.join(' ');
};

//detect is mobile browser
//To check to see if the user is on any of the supported mobile devices:

//if( isMobile.any() ) alert('Mobile');

//To check to see if the user is on a specific mobile device:

//if( isMobile.iOS() ) alert('iOS');
var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}


if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
