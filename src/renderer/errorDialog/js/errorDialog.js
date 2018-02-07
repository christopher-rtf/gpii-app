/**
 * The restart dialog
 *
 * Represents the restart dialog which appears when there is a pending change and the
 * user has closed the PSP either by clicking outside of it or by using the close button
 * in the upper right corner.
 * Copyright 2017 Raising the Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

/* global fluid */

"use strict";
(function (fluid) {
    var ipcRenderer = require("electron").ipcRenderer;

    var gpii = fluid.registerNamespace("gpii");


    /**
     * A component that handles connection and communication with the Main process.
     * It supplies interface (through invokers) for communication in direction to
     * and events for data coming from the Main process.
     */
    fluid.defaults("gpii.errorDialog.channel", {
        gradeNames: ["fluid.component"],

        events: {
            onConfigReceived: null
        },

        listeners: {
            "onCreate.registerChannel": {
                funcName: "gpii.errorDialog.channel.register",
                args: "{that}.events"
            }
        },

        invokers: {
            close: {
                funcName: "gpii.errorDialog.channel.notifyChannel",
                args: "onClosed"
            }
        }
    });


    /**
     * Notifies a channel. Currently it is used only for notifying the
     * Main process that a button was clicked.
     * @param channel {String} The channel to be notified
     */
    gpii.errorDialog.channel.notifyChannel = function (channel) {
        ipcRenderer.send(channel);
    };

    /**
     * Registers for events from the Main process.
     * @param events {Object} Events map
     * @param events.onPendingChangesReceived {Object} Event related to pending
     * changes received from the Main process
     */
    gpii.errorDialog.channel.register = function (events) {
        ipcRenderer.on("onUpdate", function (event, config) {
            events.onConfigReceived.fire(config);
        });
    };


    /**
     * The wrapper component for the restart warning dialog. Handles visualization and
     * interactions for the require restart functionality.
     */
    fluid.defaults("gpii.errorDialog", {
        gradeNames: ["fluid.viewComponent"],

        model: {
            icon:    null,

            title:   null,
            subhead: null,
            details: null,
            code: null
        },

        selectors: {
            close:   ".fl-close",

            title:   ".fl-title",
            subhead: ".fl-subhead",
            details: ".fl-details",
            code: ".fl-code"
        },

        events: {
            // TODO introduce
            onClosed: null
        },

        modelListeners: {
            title: {
                this: "{that}.dom.title",
                method: "text",
                args: "{that}.model.title"
            },
            subhead: {
                this: "{that}.dom.subhead",
                method: "text",
                args: "{that}.model.subhead"
            },
            details: {
                this: "{that}.dom.details",
                method: "text",
                args: "{that}.model.details"
            },

            code: {
                this: "{that}.dom.code",
                method: "text",
                args: "{that}.model.code"
            }
        },

        listeners: {
            onClosed: "{channel}.close",
            "onCreate.log": {
                this: "console",
                method: "log",
                args: ["{that}"]
            }
        },

        invokers: {
            // merges with the current model
            updateConfig: {
                changePath: "",
                value: "{arguments}.0"
            }
        },

        components: {
            closeBtn: {
                type: "gpii.psp.widgets.button",
                container: "{that}.dom.close",
                options: {
                    invokers: {
                        onClick: "{errorDialog}.events.onClosed.fire"
                    }
                }
            },
            channel: {
                type: "gpii.errorDialog.channel",
                options: {
                    listeners: {
                        onConfigReceived: {
                            func: "{errorDialog}.updateConfig",
                            args: "{arguments}.0"
                        }
                    }
                }
            }
        }
    });
})(fluid);

