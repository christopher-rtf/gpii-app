/**
 * The Quick Set Strip tooltip pop-up
 *
 * Introduces a component that uses an Electron BrowserWindow to represent a QSS tooltip.
 * Copyright 2016 Steven Githens
 * Copyright 2016-2017 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */
"use strict";

var fluid = require("infusion");


require("../basic/dialog.js");
require("../basic/delayedShow.js");
require("../basic/blurrable.js");
require("../basic/offScreenHidable.js");
require("../../../shared/channelUtils.js");

var gpii = fluid.registerNamespace("gpii");



fluid.defaults("gpii.app.qssTooltipDialog", {
    gradeNames: [
        "gpii.app.dialog",
        "gpii.app.blurrable",
        "gpii.app.dialog.delayedShow",
        "gpii.app.dialog.offScreenHidable"
    ],

    model: {
        isKeyedIn: false,
        setting: null,
        tooltip: null
    },

    modelRelay: {
        tooltip: {
            target: "tooltip",
            singleTransform: {
                type: "fluid.transforms.free",
                func: "gpii.app.qssTooltipDialog.getTooltip",
                args: [
                    "{that}.model.isKeyedIn",
                    "{that}.model.setting"
                ]
            }
        }
    },

    showDelay: 500,

    config: {
        showInactive: true, // not focused when shown
        closable: false,

        attrs: {
            width: 200,
            height: 300,
            alwaysOnTop: true
        },
        fileSuffixPath: "qssTooltipPopup/index.html"
    },

    // close whenever focus is lost
    linkedWindowsGrades: [],

    invokers: {
        showIfPossible: {
            funcName: "gpii.app.qssTooltipDialog.showIfPossible",
            args: [
                "{that}",
                "{arguments}.0",
                "{arguments}.1"
            ]
        },
        show: {
            // TODO split to some generic parts
            funcName: "gpii.app.qssTooltipDialog.show",
            args: [
                "{that}",
                "{arguments}.0",
                "{arguments}.1"
            ]
        }
    },

    components: {
        channelNotifier: {
            type: "gpii.app.channelNotifier",
            options: {
                events: {
                    // update message in the tooltip
                    // expect this message to be translated
                    onTooltipUpdated: null
                },
                modelListeners: {
                    "{qssTooltipDialog}.model.tooltip": {
                        func: "{that}.events.onTooltipUpdated.fire",
                        args: ["{change}.value"],
                        excludeSource: "init"
                    }
                }
            }
        }
    }
});

gpii.app.qssTooltipDialog.getTooltip = function (isKeyedIn, setting) {
    if (setting) {
        var tooltip = setting.tooltip;
        return (isKeyedIn ? tooltip.keyedIn : tooltip.keyedOut) || tooltip;
    }
};

gpii.app.qssTooltipDialog.showIfPossible = function (that, setting, btnCenterOffset) {
    if (setting && fluid.isValue(setting.tooltip)) {
        that.delayedShow(setting, btnCenterOffset);

        // trigger update in the tooltip BrowserWindow
        // and keep the last shown setting
        gpii.app.applier.replace(that.applier, "setting", setting);
    }
};


/**
 * Retrieve element position.
 */
function getTooltipPosition(dialog, btnCenterOffset) {
    // XXX extract hardcoded value to a better place
    var arrowSize = 44; // px
    return {
        offsetX: btnCenterOffset.x - arrowSize,
        offsetY: btnCenterOffset.y
    };
}

// TODO reuse widget show
gpii.app.qssTooltipDialog.show = function (that, setting, btnCenterOffset) {
    var offset = getTooltipPosition(that, btnCenterOffset);

    that.dialog.setAlwaysOnTop(true);

    // reposition window properly
    that.setPosition(offset.offsetX, offset.offsetY);

    // Trigger the showing mechanism
    that.applier.change("isShown", true);
};