/*
 * Application Zoom
 *
 *
 * Copyright 2017 Raising the Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

// var fluid = require("gpii-universal"),
//     path = require("path");

var gpii = fluid.registerNamespace("gpii");
var windows = fluid.registerNamespace("gpii.windows");
fluid.registerNamespace("gpii.windows.appZoom");

fluid.defaults("gpii.windows.appZoom", {
    gradeNames: ["fluid.component"],
//     invokers: {
//         startMessages: "{gpii.windows.messages}.start({that})",
//         stopMessages: "{gpii.windows.messages}.stop({that})",
//         getMessageWindow: "{gpii.windows.messages}.getWindowHandle()",
//         windowActivated: {
//             funcName: "gpii.windows.appZoom.windowActivated",
//             args: ["{that}", "{arguments}.0"] // [hwnd]
//         },
//         getConfig: {
//             funcName: "gpii.windows.appZoom.getConfig",
//             args: ["{that}", "{arguments}.0"] // [WindowInfo]
//         },
//         sendZoom: {
//             funcName: "gpii.windows.appZoom.sendZoom",
//             args: ["{that}", "{arguments}.0"] // [direction]
//         }
//     },
//     events: {
//         // The current window has changed.
//         onApplicationActivated: null // [{that}, WindowInfo]
//     },
//     listeners: {
//         "onCreate": "gpii.windows.appZoom.start({that})",
//         "{gpii.windows.messages}.events.onMessage": {
//             funcName: "gpii.windows.appZoom.windowMessage",
//             // that, hwnd, msg, wParam, lParam
//             args: [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3" ]
//         }
//     },
//     members: {
//         // The window that should receive the zoom.
//         currentWindow: null
//     },
//     configurations: {
//         ignored: {
//             // "ignored" means they don't become the current window. Windows owned by this process are included.
//             ignore: true,
//             match: ["explorer.exe"]
//         },
//         generic: {
//             // All unmatched windows - the wheel message, with simulated ctrl press.
//             wheel: {},
//             ctrl: true
//         },
//         wheel: {
//             // Well behaved applications, that just require the wheel message (which includes the ctrl key).
//             match: ["chrome.exe"],
//             wheel: {}
//         },
//         standardKey: {
//             // Presses ctrl + "-" or "="
//             match: ["acrord32.exe", "firefox.exe" ],
//             ctrl: true,
//             key: {
//                 decrease: "-",
//                 increase: "="
//             }
//         },
//         word: {
//             match: ["winword.exe"],
//             wheel: {
//                 delay: 500
//             },
//             ctrl: true,
//             childWindow: "_WwG"
//         },
//         edge: {
//             match: ["microsoftedgecp.exe"],
//             // The active window reported by the shell message is wrong.
//             getForegroundWindow: true,
//             childWindow: "Windows.UI.Core.CoreWindow",
//             ctrl: true,
//             wheel: {
//                 delay: 500,
//                 simulate: true
//             }
//         },
//         uwp: {
//             match: ["applicationframehost.exe"],
//             getForegroundWindow: true,
//             childWindow: "Windows.UI.Core.CoreWindow",
//             ctrl: true,
//             wheel: {
//                 simulate: true
//             }
//         }

//     }
});

// /**
//  * Information about a window.
//  * @typedef {Object} WindowInfo
//  * @property {Number} hwnd The window handle.
//  * @property {Number} pid The process ID.
//  * @property {String} exe The executable name (lower-cased, without the directory)
//  * @property {ZoomConfig} config The configuration to use for the zooming.
//  */

// /**
//  * Information about a configuration.
//  *
//  * @typedef {Object} ZoomConfig
//  * @property {String} name Config name.
//  * @property {String[]} match The executable files (without the directory) to match against.
//  * @property {String} [optional] The class-name of a child window to sent the notifications to.
//  * @property {Boolean} getForegroundWindow true to call GetForegroundWindow instead of trusting the handle passed by
//  * WM_SHELLHOOKMESSAGE.
//  *
//  * @property {Boolean} ctrl Explicitly hold the control key down.
//  *
//  * @property {Object} wheel Use ctrl+mouse wheel.
//  * @property {Boolean} wheel.delay Wait a number of milliseconds before and after.
//  * @property {Boolean} wheel.simulate Simulate the mouse action by moving the cursor and injecting a wheel movement,
//  *  rather than just sending WM_MOUSEWHEEL.
//  *
//  * @property {Object} keys The keys to send to adjust the zoom level.
//  * @property {String|Number} keys.decrease The key (character or virtual key code) to send to reduce the zoom.
//  * @property {String|Number} keys.increase The key (character or virtual key code) to send to increase the zoom.
//  */

// /**
//  * Sends the zoom command to the current window.
//  *
//  * @param {Component} that The gpii.windows.appZoom component.
//  * @param {String} direction The direction to zoom, "decrease" "increase".
//  * @return {Promise} Resolves when the actions have been sent.
//  */
// windows.appZoom.sendZoom = function (that, direction) {
//     var window = that.currentWindow;
//     var config = window && window.config;
//     var promise = fluid.promise();

//     fluid.log("sendZoom(" + direction + "): ", window);

//     var minimised = windows.user32.IsIconic(window.hwnd);

//     if (minimised) {
//         promise.resolve();
//     } else if (config) {
//         if (config.ctrl) {
//             // Even though the WM_MOUSEWHEEL message does provide the modifier key state, some applications will
//             // still use GetKeyState/GetAsyncKeyState. For this case, simulate the control key press.
//             windows.appZoom.setControlKeyState(true);
//         }

//         var increment = direction === "increase" ? 1 : -1;
//         if (increment < 0 && direction !== "decrease") {
//             fluid.fail("sendZoom: direction should be either 'decrease' or 'increase'");
//         }

//         var hwnd = 0;
//         if (config.childWindow) {
//             // Send messages to a child window - find the child.
//             hwnd = windows.appZoom.findChildWindow(window, config);
//         }

//         if (!hwnd) {
//             hwnd = window.hwnd;
//         }

//         if (config.wheel) {
//             setTimeout(function () {
//                 windows.appZoom.sendWheel(hwnd, increment, window);
//                 setTimeout(function () {
//                     // Release the ctrl key after a short delay
//                     windows.appZoom.setControlKeyState(false);
//                     promise.resolve();
//                 }, 500);
//             }, config.wheel.delay);

//         } else if (config.key) {
//             var key = config.key[direction];
//             if (key) {
//                 var keyCode = parseInt(key);
//                 if (!keyCode) {
//                     keyCode = windows.user32.VkKeyScanW(key.charCodeAt(0)) & 0xff;
//                 }
//                 windows.user32.PostMessageW(hwnd, windows.API_constants.WM_KEYDOWN, keyCode, 0);
//                 windows.user32.PostMessageW(hwnd, windows.API_constants.WM_KEYUP, keyCode, 1);
//                 setTimeout(function () {
//                     // Release the ctrl key after a short delay
//                     windows.appZoom.setControlKeyState(false);
//                     promise.resolve();
//                 }, 500);
//             }
//         }
//     } else {
//         promise.reject({
//             isError: true,
//             message: "Tried to zoom an unrecognised window"
//         });
//     }

//     return promise;

// };

// /**
//  * Set the state of the control key.
//  *
//  * @param {Boolean} down True to put the key in the pressed state, otherwise de-pressed.
//  */
// windows.appZoom.setControlKeyState = function (down) {
//     var KEYEVENTF_EXTENDEDKEY = 0x1;
//     var KEYEVENTF_KEYUP = 0x2;

//     var flags = down ? 0 : KEYEVENTF_KEYUP;
//     if (down) {
//         // Ensure the keys are released first, MS Word sometimes needs this.
//         windows.appZoom.setControlKeyState(!down);
//     }

//     windows.user32.keybd_event(windows.API_constants.virtualKeyCodes.VK_CONTROL, 0, flags, 0);
//     if (!down) {
//         // ensure both keys are up
//         windows.user32.keybd_event(
//             windows.API_constants.virtualKeyCodes.VK_CONTROL, 0, flags | KEYEVENTF_EXTENDEDKEY, 0);
//     }
// };

// /**
//  * Send the mouse-wheel event to a given window.
//  * @param {Number} hwnd The window handle to send events to.
//  * @param {Number} direction The direction to spin the wheel: > 0 for up, < 0 for down.
//  * @param {WindowInfo} window The window of the application that is being zoomed.
//  */
// windows.appZoom.sendWheel = function (hwnd, direction, window) {
//     var MK_CONTROL = 0x8;
//     var WHEEL_DELTA = 120;
//     var MOUSEEVENTF_WHEEL = 0x800;

//     var config = window.config;

//     // Say that the mouse cursor is in the middle of the window.
//     var distance = WHEEL_DELTA * Math.sign(direction);

//     // Some (or most?) applications will not zoom if their window isn't top-most at that point.
//     var targetPoint = windows.appZoom.findUncoveredPoint(hwnd, window);

//     if (config.wheel.simulate) {
//         // Move the cursor on the window and simulate wheel movement.
//         var cursorPos = new windows.POINT();
//         windows.user32.GetCursorPos(cursorPos.ref());
//         windows.user32.SetCursorPos(targetPoint.x, targetPoint.y);
//         windows.user32.mouse_event(MOUSEEVENTF_WHEEL, 0, 0, distance, 0);
//         // Put it back again.
//         windows.user32.SetCursorPos(cursorPos.x, cursorPos.y);
//     } else {
//         // Send the wheel message.
//         var lParam = windows.makeLong(targetPoint.x, targetPoint.y);
//         var wParam = windows.makeLong(MK_CONTROL, distance);
//         windows.user32.PostMessageW(hwnd, windows.API_constants.WM_MOUSEWHEEL, wParam, lParam);
//     }
// };

// /**
//  * Returns a point closest to the centre of the target window that isn't covered by another Window owned by a different
//  * process.
//  *
//  * This function assumes only one window could be covering the target.
//  *
//  * The target window is the active (or most recently active) Window, so its not expected to have any window above it
//  * (especially in the middle). The covering window is most likely to be the QSS.
//  *
//  * @param {Number} hwnd The target window handle.
//  * @param {WindowInfo} window The window of the application that is being zoomed.
//  * @return {Object} A point {x,y} that's close to the centre of the target window.
//  */
// windows.appZoom.findUncoveredPoint = function (hwnd, window) {
//     var rect = windows.getWindowRect(hwnd);
//     var result;
//     if (rect) {
//         var centre = {
//             x: rect.left + rect.width / 2,
//             y: rect.top + rect.height / 2
//         };

//         result = {
//             x: centre.x,
//             y: centre.y
//         };

//         var windowOver = windows.user32.WindowFromPoint(centre.x, centre.y);
//         var windowPid = windows.getWindowProcessId(windowOver);
//         if (windowOver && windowOver !== hwnd && windowPid !== window.pid) {
//             // The window at the point could be a child window, so get the top-level owner.
//             var owner = windows.getTopParent(windowOver);
//             if (owner) {
//                 windowOver = owner;
//             }

//             var points = windows.appZoom.getOverlappingPoints(rect, centre, windowOver);

//             if (points.length === 1) {
//                 result = points[0];
//             } else if (points.length > 1) {
//                 // Get the closest to the centre, in case it matters for zoom-points.
//                 var closest = null;
//                 fluid.each(points, function (pt) {
//                     var dist = Math.hypot(centre.x - pt.x, centre.y - pt.y);

//                     if (closest === null || dist < closest) {
//                         closest = dist;
//                         result = pt;
//                     }
//                 });
//             }
//         }
//     } else {
//         result = {
//             x: 0,
//             y: 0
//         };
//     }

//     return result;
// };

// /**
//  * Find the side(s) of the overlapping window that's within the target window.
//  * @param {Object} rect A rect object.
//  * @param {Object} centre The center point of the window.
//  * @param {WindowInfo} windowOver a window handle
//  * @return {Array} Array of points.
//  */
// windows.appZoom.getOverlappingPoints = function (rect, centre, windowOver) {
//     //
//     var points = [];
//     var overRect = windows.getWindowRect(windowOver);
//     if (overRect) {
//         overRect.left -= 1;
//         overRect.top -= 1;

//         if (rect.left < overRect.left) {
//             points.push({x: overRect.left, y: centre.y});
//         }
//         if (rect.top < overRect.top) {
//             points.push({x: centre.x, y: overRect.top});
//         }
//         if (rect.right > overRect.right) {
//             points.push({x: overRect.right, y: centre.y});
//         }
//         if (rect.bottom > overRect.bottom) {
//             points.push({x: centre.x, y: overRect.bottom});
//         }
//     }
//     return points;
// };

// /**
//  * Gets some information about a given window.
//  * @param {Number} hwnd The window handle.
//  * @return {WindowInfo} Information about the window.
//  */
// windows.appZoom.getWindowInfo = function (hwnd) {
//     var pid = hwnd && windows.getWindowProcessId(hwnd);
//     var result;

//     if (pid) {
//         var processPath = windows.getProcessPath(pid);

//         result = {
//             hwnd: hwnd,
//             pid: pid,
//             exe: processPath && path.basename(processPath).toLowerCase()
//         };
//     }
//     return result;
// };

// /**
//  * Gets the zoom configuration that should be used for given window.
//  *
//  * @param {Component} that The gpii.windows.appZoom component.
//  * @param {WindowInfo} window The window.
//  * @return {ZoomConfig} The configuration.
//  */
// windows.appZoom.getConfig = function (that, window) {
//     var config = fluid.find(that.options.configurations, function (config) {
//         return fluid.makeArray(config.match).indexOf(window.exe) >= 0 ? config : undefined;
//     });

//     return config || that.options.configurations.generic;
// };

// /**
//  * A window has been activated.
//  * @param {Component} that The gpii.windows.appZoom component.
//  * @param {Number} hwnd The handle to the activated window.
//  */
// windows.appZoom.windowActivated = function (that, hwnd) {
//     if (that.activeWindow !== hwnd) {
//         that.activeWindow = hwnd;
//         var window = windows.appZoom.getWindowInfo(hwnd);

//         // Get the configuration for the window.
//         if (window && (window.pid !== process.pid)) {
//             window.config = that.getConfig(window);
//             if (!window.config.ignore) {

//                 that.currentWindow = window;

//                 if (window.config.getForegroundWindow) {
//                     // Edge's edge case. The window reported by the notification isn't the right window.
//                     window.hwnd = windows.user32.GetForegroundWindow();
//                 }
//             }
//         }
//         if (that.currentWindow) {
//             that.events.onApplicationActivated.fire(that, that.currentWindow);
//         }
//     }
// };

// /**
//  * Called when an event has been received by the message window.
//  *
//  * Handles the WM_SHELLHOOKMESSAGE message.
//  *
//  * @param {Component} that The gpii.windows.appZoom component.
//  * @param {Number} hwnd The window handle of the message window.
//  * @param {Number|String} msg The message identifier.
//  * @param {Number} wParam Message specific data.
//  * @param {Buffer} lParam Additional message specific data.
//  */
// gpii.windows.appZoom.windowMessage = function (that, hwnd, msg, wParam, lParam) {
//     var HSHELL_WINDOWACTIVATED = 4;
//     var HSHELL_RUDEAPPACTIVATED = 0x8004;

//     if (msg === windows.API_constants.WM_SHELLHOOK) {
//         if (wParam === HSHELL_WINDOWACTIVATED || wParam === HSHELL_RUDEAPPACTIVATED) {
//             // Run the code in the next tick so this function can return soon, as it's a window procedure.
//             process.nextTick(that.windowActivated, lParam.address());
//         }
//     }
// };

// /**
//  * Start monitoring window activation.
//  *
//  * @param {Component} that The gpii.windows.appZoom component.
//  */
// windows.appZoom.start = function (that) {
//     that.startMessages();
//     // Tell Windows to send WM_SHELLHOOKMESSAGE.
//     gpii.windows.user32.RegisterShellHookWindow(that.getMessageWindow());
// };

// /**
//  * Find child window.
//  *
//  * @param {WindowInfo} window The window.
//  * @param {Config} config The configuration to use.
//  * @return {String} The window handleThe window handle.
//  */
// windows.appZoom.findChildWindow = function (window, config) {
//     var classBuffer = Buffer.alloc(0xff);
//     var hwnd = windows.enumerateWindows(window.hwnd, function (hwndChild) {
//         if (windows.user32.GetClassNameW(hwndChild, classBuffer, classBuffer.length)) {
//             var cls = windows.stringFromWideChar(classBuffer);
//             return cls === config.childWindow ? hwndChild : undefined;
//         }
//     });

//     if (!hwnd) {
//         fluid.log("appZoom: child window '" + config.childWindow + "' not found.");
//     }
//     return hwnd;
// };
