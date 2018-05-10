/**
 * PSP utility functions
 *
 * A set of utility function used throughout the components used in the main process of the PSP.
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

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.app");


/**
 * Generic channel component for communication with BroserWindows
 * It simply registers listeners for the passed events.
 */
fluid.defaults("gpii.app.dialog.simpleChannelListener", {
    gradeNames: "fluid.component",

    events: {}, // to be passed by implementor
    ipcTarget: null,

    listeners: {
        "onCreate.registerIpcListeners": {
            funcName: "gpii.app.dialog.simpleChannelListener.registerIPCListeners",
            args: ["{that}", "{that}.events"]
        },
        "onDestroy.deregisterIpcListeners": {
            funcName: "gpii.app.dialog.simpleChannelListener.deregisterIPCListeners",
            args: ["{that}", "{that}.events"]
        }
    },

    invokers: {
        registerIPCListener: {
            funcName: "gpii.app.dialog.simpleChannelListener.registerIPCListener",
            args: [
                "{that}.options.ipcTarget",
                "{arguments}.0", // channelName
                "{arguments}.1"  // event
            ]
        },
        deregisterIPCListener: {
            funcName: "gpii.app.dialog.simpleChannelListener.deregisterIPCListener",
            args: [
                "{that}.options.ipcTarget",
                "{arguments}.0" // channelName
            ]
        }
    }
});


/**
 * Registers simple IPC socket listeners for all given events. In case anything is written to
 * the channel, the corresponding event is triggered.
 *
 * @param events {Object} The events to be used.
 */
gpii.app.dialog.simpleChannelListener.registerIPCListeners = function (that, events) {
    fluid.each(events, function (event, eventName) {
        that.registerIPCListener(eventName, event);
    });
};

/**
 * Deregisters all socket listeners for the specified events.
 *
 * @param events {Object} The events to be used.
 */
gpii.app.dialog.simpleChannelListener.deregisterIPCListeners = function (that, events) {
    fluid.keys(events).forEach(that.registerIPCListener);
};


/**
 * Registers a single IPC socket channel.
 *
 * @param channelName {String} The name of the channel to be listened to.
 * @param event {Object} The event to be fired when the channel is notified.
 */
gpii.app.dialog.simpleChannelListener.registerIPCListener = function (ipcTarget, channelName, event) {
    ipcTarget.on(channelName, function (/* event, args... */) {
        event.fire.apply(event, [].slice.call(arguments, 1));
    });
};


/**
 * Deregisters a socket listener.
 *
 * @param channelName {String} The channel to be disconnected from.
 */
gpii.app.dialog.simpleChannelListener.deregisterIPCListener = function (ipcTarget, channelName) {
    ipcTarget.removeAllListeners(channelName);
};



fluid.defaults("gpii.app.dialog.simpleChannelNotifier", {
    gradeNames: "fluid.component",

    events: {}, // to be passed by implementor
    ipcTarget: null,

    listeners: {
        "onCreate.registerIPCNotifiers": {
            funcName: "gpii.app.dialog.simpleChannelNotifier.registerIPCNotifiers",
            args: [
                "{that}.options.ipcTarget",
                "{that}.events"
            ]
        }
    }
});

/**
 * Registers simple IPC socket listeners for all given events. In case anything is written to
 * the channel, the corresponding event is triggered.
 *
 * @param events {Object} The events to be used.
 */
gpii.app.dialog.simpleChannelNotifier.registerIPCNotifiers = function (ipcTarget, events) {
    fluid.each(events, function (event, eventName) {
        // send data to a channel named after the event name
        event.addListener(ipcTarget.send.bind(ipcTarget.send, eventName));
    });
};
