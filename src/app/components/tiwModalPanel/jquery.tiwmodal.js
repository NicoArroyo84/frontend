/* eslint-disable */


(function () {
  "use strict";
    angular.element.modalTIW = function (opts) {

        if (angular.element(".modal-backdrop").length) {
            return;
        }

        angular.element.modalTIW.regional = [];
        angular.element.modalTIW.regional["en"] = {
            closeButtonText: "No"
        };

        angular.element.modalTIW.regional["fr"] = {
            closeButtonText: "Fermer"
        };

        angular.element.modalTIW.regional["nl"] = {
            closeButtonText: "Afsluiten"
        };
        angular.element.modalTIW.defaults = {
            headerText: "",
            bodyText: "",
            style: "",
            height: 0,
            documentViewerMode: false,
            closeButton: {
                visible: false,
                text: angular.element.modalTIW.regional[(opts.language ? opts.language : "en")].closeButtonText,
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



        var options = angular.element.extend(true, angular.element.modalTIW.defaults, opts);


        var $myModal = angular.element('<div class="modal fade" id="myTIWModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
								'<div class="modal-dialog">' +
							  '<div class="modal-content">' +
								'<div class="modal-header">' +
								  //'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
								  '<h4 class="modal-title"></h4>' +
								'</div>' +
								'<div class="modal-body" ' + (options.height ? 'style="overflow-y:auto;height:' + options.height + 'px;"'  : "") +  ' >' +
								  '<p></p>' +
								'</div>' +
								'<div class="modal-footer">' +
                                    '<button type="button" class="btn btn-tiw-green btn  btn-primary extra-button"></button>' +
								  '<button ' + (options.acceptButton.disabled ? "disabled" : "") + ' type="button" class="btn btn-tiw-green btn  btn-primary btn-accept ' + (options.revertButton ? 'revert-button' : '') + '"></button>' +
								  '<button type="button" class="btn btn-tiw-green btn btn-primary btn-default btn-cancel" data-dismiss="modal">Cancel</button>' +
								'</div>' +
							  '</div>' +
							'</div>' +
						 '</div>'),
				btnAccept = $myModal.find(".btn-accept"),
        btnCancel = $myModal.find(".btn-cancel"),
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

            }

            if ($myModal.find(".alert").length) {
                $myModal.find(".alert").hide();
            }
            $myModal.find(".modal-footer").prepend('<div class="alert alert-' + classMsg + ' alert-dismissable" style="text-align:left;margin-bottom:10px;width:100%;" ><button  type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><strong>' + type.capitalize() + '!</strong></br><div> ' + msg + '</div></div>');
          angular.element(".alert-dismissable").find("div").html(angular.element(".alert-dismissable").find("div").html().replace(/\n/g, '<br/>'));
        },
        toggleStyle = function () {
            $myModal.find(".modal-content").toggleClass("tiw-modal-content");
        },
        getMsgTranslation = function (array) {
            var str = "No language string found.",
            strRequested = angular.element(array).filter(function (i, val) {
                return val[0] == options.language;
            });
            try {
                if (strRequested.length) {
                    str = strRequested[0][1];
                }
            } catch (e) { }

            return str;


        };

        if (angular.element("#myTIWModal").length) {
            angular.element("#myTIWModal").remove();
        }

        if (options.acceptButton.text.length) {
            if (angular.element.isArray(options.acceptButton.text)) {
                btnAccept.text(getMsgTranslation(options.acceptButton.text));
            } else {
                btnAccept.text(options.acceptButton.text);
            }

            btnAccept.on("click", options.acceptButton.action);
        } else {
            btnAccept.hide();
        }

        if (!options.closeButton.visible) {
          btnCancel.hide();
        } else {
          btnCancel.on("click", options.closeButton.action);

            if ((typeof options.closeButton.text != "undefined") && (options.closeButton.text.length)) {
              btnCancel.text(options.closeButton.text);
            } else {
              btnCancel.hide();
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
        } else if (angular.element.isArray(options.bodyText)) {
            $myModal.find(".modal-body p").text(getMsgTranslation(options.bodyText));
        } else {
            $myModal.find(".modal-body p").text(options.bodyText);
        }

        if (options.style === "tiw") {
            $myModal.find(".modal-content").addClass("tiw-modal-content");
        }
        if (angular.element.isArray(options.headerText)) {
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





}());





if (typeof String.prototype.capitalize === "undefined") {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}
