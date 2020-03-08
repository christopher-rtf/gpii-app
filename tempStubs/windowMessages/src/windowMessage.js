/* Captures Window messages.
 *
 * Copyright 2018 Raising the Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The R&D leading to these results received funding from the
 * Department of Education - Grant H421A150005 (GPII-APCP). However,
 * these results do not necessarily represent the policy of the
 * Department of Education, and you should not assume endorsement by the
 * Federal Government.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("gpii-universal") /*,
    ffi = require("ffi-napi"); */

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.windows.messages");

// require("../../WindowsUtilities/WindowsUtilities.js");

// var windows = gpii.windows;

fluid.defaults("gpii.windows.messages", {
    gradeNames: ["fluid.component", "fluid.resolveRootSingle"],
    singleRootType: "gpii.windows.messages",
    events: {
        /**
         * Message received (see https://msdn.microsoft.com/library/ms633573)
         * Set `result.value` to specify a return value (and not call DefWindowProc).
         *
         * @param {Number} hwnd Window handle
         * @param {Number} msg Message (WM_*)
         * @param {Number} wParam Message specific data
         * @param {Buffer} lParam  Message specific data (ffi pointer, may not be valid after return)
         * @param {object} result Set a 'value' field to specify a return value.
         */
        "onMessage": null
    },
//     listeners: {
//         "onDestroy": {
//             funcName: "gpii.windows.messages.stop",
//             args: "{that}"
//         }
//     },
    invokers: {
        start: {
            funcName: "gpii.windows.messages.start",
            args: [
                "{that}",
                "{arguments}.0"
            ]
        },
        stop: {
            funcName: "gpii.windows.messages.stop",
            args: [
                "{that}",
                "{arguments}.0"
            ]
        },
//         getWindowHandle: {
//             funcName: "gpii.windows.messages.getWindowHandle",
//             args: "{that}"
//         },
//         sendMessage: {
//             funcName: "gpii.windows.messages.sendMessage",
//             // window, message, wparam, lparam
//             args: ["{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
//         },
//         sendData: {
//             funcName: "gpii.windows.messages.sendData",
//             // window, number, data
//             args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
//         }
    },
//     members: {
//         /** Message window class */
//         windowClassname: "gpii-message-window",
//         /** Window handle of the message window (multiple component instances use the same window). */
//         messageWindow: null,
//         /** A reference counter, so the window can be destroyed when no longer required. */
//         references: []
//     }
});

/**
 * Start listening for window messages. Create the message window if it's not already created.
 *
 * @param {Component} that The gpii.windows.messages instance.
 * @param {Component} component The component that's listening for messages.
 */
gpii.windows.messages.start = function (that, component) {
    // TODO: move this function to GPII/windows
    // in the meantime...just return
    return;

//     var id = component.id;
//     if (that.references.indexOf(id) === -1) {
//         if (!that.messageWindow) {
//             gpii.windows.messages.createMessageWindow(that);
//         }
//         that.references.push(id);
//     }
};

/**
 * Stop listening for window messages. Destroy the message window if no other instance is using it.
 *
 * @param {Component} that The gpii.windows.messages instance.
 * @param {Component} component The component that's listening for messages, or null to stop completely.
 */
gpii.windows.messages.stop = function (that, component) {
    // TODO: move this function to GPII/windows
    // in the meantime...just return
    return;

//     if (component) {
//         var id = component.id;
//         var index = that.references.indexOf(id);
//         if (index > -1) {
//             that.references.splice(index, 1);
//         }
//     } else {
//         that.references = [];
//     }

//     if (that.references.length === 0) {
//         gpii.windows.messages.destroyMessageWindow(that);
//     }
};

// /**
//  * Gets the handle of the message window (hWnd).
//  *
//  * @param {Component} that The gpii.windows.messages instance.
//  * @return {Number} The handle, or 0 if there's no window.
//  */
// gpii.windows.messages.getWindowHandle = function (that) {
//     return that.messageWindow || 0;
// };

// /**
//  * The window procedure for the window. Fires the event, then passes the message to the default window procedure.
//  *
//  * WindowProc: https://msdn.microsoft.com/library/ms633573
//  *
//  * @param {Component} that The gpii.windows.messages instance.
//  * @param {Number} hwnd Window handle.
//  * @param {Number} msg The window message.
//  * @param {Number} wParam Message parameter.
//  * @param {Number} lParam Message parameter.
//  * @return {Number} The result of the message.
//  */
// gpii.windows.messages.windowProc = function (that, hwnd, msg, wParam, lParam) {
//     var result = { value: undefined };

//     var messageValue = gpii.windows.messages.registeredMessageName(msg);

//     try {
//         that.events.onMessage.fire(hwnd, messageValue, wParam, lParam, result);
//     } finally {
//         if (result.value === undefined) {
//             return windows.user32.DefWindowProcW(hwnd, msg, wParam, lParam);
//         } else {
//             return result.value;
//         }
//     }
// };

// /**
//  * Polls for messages - only required if not running under electron.
//  *
//  * @param {Component} that The gpii.windows.messages instance.
//  */
// gpii.windows.messages.messagePump = function (that) {

//     var loop = function () {
//         // sizeof(MSG) = 48 on 64-bit, 28 on 32-bit.
//         var msg = Buffer.alloc(process.arch === "x64" ? 48 : 28);

//         // Unable to use GetMessage because it blocks, and can't call via .async because it needs to be in the same
//         // thread as the window.
//         while (gpii.windows.user32.PeekMessageW(msg, 0, 0, 0, 1)) {
//             gpii.windows.user32.TranslateMessage(msg);
//             gpii.windows.user32.DispatchMessageW(msg);
//         }

//         if (that.messageWindow) {
//             setTimeout(loop, gpii.windows.messages.messagePumpDelay);
//         }
//     };
//     loop();
// };

// /** Delay in ms for polling messages. Only applies when running as gpii-windows. */
// gpii.windows.messages.messagePumpDelay = 2000;

// /**
//  * Creates a window whose only purpose is to receive messages.
//  *
//  * The window has no visibility - it just exists.
//  *
//  * @param {Component} that The gpii.windows.messages instance.
//  */
// gpii.windows.messages.createMessageWindow = function (that) {
//     if (that.messageWindow) {
//         fluid.fail("Message window already created.");
//     }

//     var className = windows.stringToWideChar(that.windowClassname);

//     // Window class only needs to be registered once.
//     if (!gpii.windows.messages.windowProcPointer) {
//         // Create the Window Class for the window
//         var cls = new windows.WNDCLASSW();
//         cls.ref().fill(0);

//         cls.lpszClassName = className;

//         // Create a pointer to the window procedure function.
//         var callback = ffi.Callback(gpii.windows.types.HANDLE,
//             [gpii.windows.types.HANDLE, gpii.windows.types.UINT, gpii.windows.types.UINT, gpii.windows.types.PVOID],
//             function (hwnd, msg, wParam, lParam) {
//                 return gpii.windows.messages.windowProc(that, hwnd, msg, wParam, lParam);
//             });
//         cls.lpfnWndProc = callback;

//         // Keep a reference to the function pointer, otherwise the GC will free it. Because 'callback' points to the
//         // function that windows calls whenever there is a window message, the buffers need to be kept alive for as long
//         // as GPII is running.
//         // Additionally, this value also contains the "cif" buffer (internal to ffi-napi) which also needs to be
//         // referenced. See GPII-3445.
//         gpii.windows.messages.windowProcPointer = function () {
//             callback();
//         };

//         var result = gpii.windows.user32.RegisterClassW(cls.ref());
//         if (!result) {
//             fluid.fail("RegisterClass failed");
//         }
//     }

//     // Start the message loop
//     if (!process.versions.electron) {
//         that.messageWindow = 1; // make the loop think there's already a window.
//         gpii.windows.messages.messagePump(that);
//     }

//     // Create the Window.
//     that.messageWindow =
//         gpii.windows.user32.CreateWindowExW(0, className, className, 0, 0, 0, 0, 0, 0, 0, 0, 0);

//     if (!that.messageWindow) {
//         fluid.fail("CreateWindowEx failed");
//     }
// };

// /**
//  * Destroys the window created by createMessageWindow.
//  *
//  * @param {Component} that The gpii.windows.messages instance.
//  * @return {Boolean} false on failure.
//  */
// gpii.windows.messages.destroyMessageWindow = function (that) {
//     var success = true;
//     if (that.messageWindow) {
//         // Destroy the window.
//         success = !!windows.user32.DestroyWindow(that.messageWindow);
//         that.messageWindow = null;
//         that.references = [];
//     }
//     return success;
// };

// /**
//  * Send a message to a window, returning a promise which resolve when the message has been processed.
//  *
//  * @param {Number} hwnd The window handle.
//  * @param {Number} msg The message, or the name of a registered message (will be registered if not already).
//  * @param {Number} wParam Message parameter.
//  * @param {Number} lParam Message parameter.
//  * @param {Number} timeout [optional] Number of milliseconds to wait before resolving with "timeout".
//  * @return {Promise} Resolves when the message has been processed.
//  */
// gpii.windows.messages.sendMessageAsync = function (hwnd, msg, wParam, lParam, timeout) {
//     var promise = fluid.promise();
//     var complete = false;

//     var timer = timeout && setTimeout(function () {
//         if (!complete) {
//             complete = true;
//             promise.resolve("timeout");
//         }
//     }, timeout);

//     var t = gpii.windows.types;
//     var callback = ffi.Callback(t.BOOL, [t.HANDLE, t.UINT, t.UINT, t.ULONG_PTR, t.ULONG_PTR],
//         function (w, m, wp, lp, result) {
//             if (!complete) {
//                 complete = true;
//                 promise.resolve(result);
//             }
//             if (timer) {
//                 clearTimeout(timer);
//             }
//         });

//     gpii.windows.user32.SendMessageCallbackW(hwnd, msg, wParam, lParam, callback, 0);

//     // SendMessageCallbackW is async, and will call the callback function beyond the lifetime of this function. This
//     // has meant that callback sometimes gets GC'd before it is called. Referring to it in a function that's attached
//     // to the promise will keep the callback alive for as long as the promise.
//     // https://github.com/node-ffi/node-ffi/issues/72#issuecomment-8599403
//     promise.then(function () {
//         // A no-op that keeps a reference to callback.
//         return callback && null;
//     });

//     return promise;
// };

// /**
//  * Defines a new window message that is guaranteed to be unique throughout the system.
//  * @see https://docs.microsoft.com/windows/desktop/api/winuser/nf-winuser-registerwindowmessagew
//  * @param {String} messageName The message to be registered.
//  * @return {Number} The message identifier.
//  */
// gpii.windows.messages.registeredMessage = function (messageName) {
//     return gpii.windows.user32.RegisterWindowMessageW(gpii.windows.stringToWideChar(messageName));
// };

// /**
//  * Gets the name of a registered message.
//  *
//  * @param {Number} msg The message identifier.
//  * @return {String|Number} The registered message name, or `msg` if it's not a registered message.
//  */
// gpii.windows.messages.registeredMessageName = function (msg) {
//     var togo = msg;

//     // MSDN: "a message identifier in the range 0xC000 through 0xFFFF".
//     if (msg >= 0xc000 && msg <= 0xffff) {
//         var nameBuffer = Buffer.alloc(0xff * 2);
//         // Windows has a quirk where you can use GetClipboardFormatName to lookup the name of a message
//         // https://linux.m2osw.com/recover-name-message-registered-registerwindowmessage
//         var ret = gpii.windows.user32.GetClipboardFormatNameW(msg, nameBuffer, 0xff);
//         if (ret > 0) {
//             togo = gpii.windows.stringFromWideChar(nameBuffer);
//         }
//     }

//     return togo;
// };

// /**
//  * Sends a message to a window.
//  *
//  * The window can be identified using its handle (hWnd), the class name, or "BROADCAST" (or null) to send to all
//  * top-level windows.
//  *
//  * If a class name is specified, then the message is sent to all top-level windows with the specified class name.
//  *
//  * @param {Number|String} window Window identifier. Can be the window handle, class name, or "BROADCAST"/null, or an
//  * array describing the parent to child path.
//  * @param {Number|String} msg The message, or the name of a registered message (will be registered if not already).
//  * @param {Number} wParam Message parameter.
//  * @param {Number|String|Buffer} lParam Message parameter.
//  * @param {Object} options [optional] Options
//  * @param {Boolean} options.blocking Use the blocking SendMessage (instead of SendMessageNotify)
//  * @return {Number} The result of the message.
//  */
// gpii.windows.messages.sendMessage = function (window, msg, wParam, lParam, options) {
//     options = options || {};

//     if (typeof(msg) === "string") {
//         msg = parseInt(msg) || gpii.windows.messages.registeredMessage(msg);
//     }

//     var hwnd = parseInt(window);
//     if (isNaN(hwnd)) {
//         if (!window || (window === "BROADCAST")) {
//             hwnd = windows.API_constants.HWND_BROADCAST;
//         } else if (fluid.isArrayable(window)) {
//             hwnd = gpii.windows.findWindows(window);
//         } else {
//             hwnd = [];
//             var classBuffer = Buffer.alloc(0xff);
//             classBuffer.ref().fill(0);
//             // Get all the windows that have the specified class
//             windows.enumerateWindows(function (hwndFound) {
//                 if (windows.user32.GetClassNameW(hwndFound, classBuffer, classBuffer.length)) {
//                     var cls = windows.stringFromWideChar(classBuffer);
//                     if (cls === window) {
//                         hwnd.push(hwndFound);
//                     }
//                 }
//             });
//         }
//     }

//     var sendMessage = options.blocking
//         ? windows.user32.SendMessageW
//         : windows.user32.SendNotifyMessageW;

//     var lp = (typeof(lParam) === "string")
//         ? windows.stringToWideChar(lParam)
//         : lParam;

//     var addr = lp.address ? lp.address() : lp;

//     fluid.each(fluid.makeArray(hwnd), function (hw) {
//         sendMessage(hw, msg, wParam, addr);
//     });

//     return hwnd;
// };

// /**
//  * Sends some data to another window, using the WM_COPYDATA message.
//  *
//  * @param {Component} that The gpii.windows.messages instance.
//  * @param {Number|String} window Window identifier. Can be the window handle, or class name.
//  * @param {Number} number Numeric data to send.
//  * @param {Buffer|String} data Additional data to send.
//  */
// gpii.windows.messages.sendData = function (that, window, number, data) {

//     var copyData = new gpii.windows.COPYDATASTRUCT();
//     copyData.ref().fill(0);

//     if (fluid.isValue(data)) {
//         var dataBuf = data.address ? data : windows.stringToWideChar(data.toString());
//         copyData.cbData = dataBuf.length;
//         copyData.lpData = dataBuf;
//     }
//     copyData.dwData = number;

//     gpii.windows.messages.sendMessage(window, windows.API_constants.WM_COPYDATA, that.getWindowHandle(),
//         copyData.ref().address(), {blocking: true});
// };

gpii.windows.messages();