
/*-----------------------------------------------------------------------
// <copyright file="jquery.tiwmodal.js" company="TIWGroup">
//     Copyright (c) TIW Group.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------*/
// 
//
//
//-----------------------------------------------------------------------*/

"use strict";
(function ($, window, document) {




    $.modalTIW = function (opts) {

        if ($(".modal-backdrop").length) {
            return;
        }

        $.modalTIW.regional = [];
        $.modalTIW.regional["en"] = {
            closeButtonText: "No"
        };

        $.modalTIW.regional["fr"] = {
            closeButtonText: "Fermer"
        };

        $.modalTIW.regional["nl"] = {
            closeButtonText: "Afsluiten"
        };
        $.modalTIW.defaults = {
            headerText: "",
            bodyText: "",
            style: "",
            height: 0,
            documentViewerMode: false,
            closeButton: {
                visible: false,
                text: $.modalTIW.regional[(opts.language ? opts.language : "en")].closeButtonText,
                action: function () { }
            },
            acceptButton: {
                text: "OK",
                disabled: false,
                action: function () { }
            },
            extraButton: {
                visible: false,
                text: "Opt",
                action: function () { }
            },
            language: "en",
            errorMsg: {
                text: "ERROR"
            },
            revertButton: false

        };



        var options = $.extend(true, $.modalTIW.defaults, opts);



        var $myModal = $('<div class="modal fade" id="myTIWModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
								'<div class="modal-dialog">' +
							  '<div class="modal-content">' +
								'<div class="modal-header">' +
								  '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
								  '<h4 class="modal-title"></h4>' +
								'</div>' +
								'<div class="modal-body" ' + (options.height ? 'style="overflow-y:auto;height:' + options.height + 'px;"'  : "") +  ' >' +
								  '<p></p>' +
								'</div>' +
								'<div class="modal-footer">' +
                                    '<button type="button" class="btn btn-tiw-green btn  btn-primary extra-button"></button>' +
								  '<button ' + (options.acceptButton.disabled ? "disabled" : "") + ' type="button" class="btn btn-tiw-green btn  btn-primary btn-accept ' + (options.revertButton ? 'revert-button' : '') + '"></button>' +
								  '<button type="button" class="btn btn-tiw-green btn btn-primary btn-default" data-dismiss="modal">Cancel</button>' +
								'</div>' +
							  '</div>' +
							'</div>' +
						 '</div>'),
				btnAccept = $myModal.find(".btn-accept"),
        close = function () {
            $myModal.modal("hide");
        },

        messageToUser = function (type, msg) {
            var classMsg = "info";

            switch (type) {
                case "success":
                    classMsg = "success";
                    break;
                case "warning":
                    classMsg = "warning";
                    break;
                case "error":
                    classMsg = "danger";

            };
            if ($myModal.find(".alert").length) {
                $myModal.find(".alert").hide();
            }
            $myModal.find(".modal-footer").prepend('<div class="alert alert-' + classMsg + ' alert-dismissable" style="text-align:left;margin-bottom:10px;width:100%;" ><button  type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + type.capitalize() + '!</strong></br><div> ' + msg + '</div></div>');
            $(".alert-dismissable").find("div").html($(".alert-dismissable").find("div").html().replace(/\n/g, '<br/>'));
        },
        toggleStyle = function () {
            $myModal.find(".modal-content").toggleClass("tiw-modal-content");
        },
        getMsgTranslation = function (array) {
            var str = "No language string found.",
            strRequested = $(array).filter(function (i, val) {
                return val[0] == options.language;
            });
            try {
                if (strRequested.length) {
                    str = strRequested[0][1];
                }
            } catch (e) { }

            return str;


        }

        if ($("#myTIWModal").length) {
            $("#myTIWModal").remove();
        }

        if (options.acceptButton.text.length) {
            if ($.isArray(options.acceptButton.text)) {
                btnAccept.text(getMsgTranslation(options.acceptButton.text));
            } else {
                btnAccept.text(options.acceptButton.text);
            }

            btnAccept.on("click", options.acceptButton.action);
        } else {
            btnAccept.hide();
        }

        if (!options.closeButton.visible) {
            $myModal.find(".modal-footer .btn-default").hide();
        } else {
            $myModal.find(".modal-footer .btn-default").on("click", options.closeButton.action);

            if ((typeof options.closeButton.text != "undefined") && (options.closeButton.text.length)) {
                $myModal.find(".modal-footer .btn-default").text(options.closeButton.text);
            } else {
                $myModal.find(".modal-footer .btn-default").hide();
            }

        }


        if (!options.extraButton.visible) {
            $myModal.find(".modal-footer .extra-button").hide();
        } else {
            $myModal.find(".modal-footer .extra-button").on("click", options.extraButton.action);
            if ((typeof options.extraButton.text != "undefined") && (options.extraButton.text.length)) {
                $myModal.find(".modal-footer .extra-button").text(options.extraButton.text);
            } else {
                $myModal.find(".modal-footer .extra-button").hide();
            }
        }


        if (options.bodyText instanceof jQuery) {
            $myModal.find(".modal-body p").append(options.bodyText);
            options.bodyText.show();
        } else if ($.isArray(options.bodyText)) {
            $myModal.find(".modal-body p").text(getMsgTranslation(options.bodyText));
        } else {
            $myModal.find(".modal-body p").text(options.bodyText);
        }

        if (options.style === "tiw") {
            $myModal.find(".modal-content").addClass("tiw-modal-content");
        }
        if ($.isArray(options.headerText)) {
            $myModal.find(".modal-title").text(getMsgTranslation(options.headerText));
        } else {
            $myModal.find(".modal-title").text(options.headerText);
        }

        $myModal.modal();

        setTimeout(function () {
            (options.documentViewerMode ? $myModal.find(".modal-dialog").width("70%") : $myModal.find(".modal-dialog").css("marginTop", "5%"));
            if (options.height) {
                $myModal.find(".tiw-modal-content").draggable();
            }
        }, 1); //developed this way due IE9


        return {
            closeModal: close,
            messageToUser: messageToUser,
            toggleStyle: toggleStyle
        }
    }





}(window.jQuery, window, document));





if (typeof String.prototype.capitalize === "undefined") {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}