/*
 * Cross-platform Language Redirect
 *
 * Copyright 2020 Raising the Floor -- US Inc. All rights reserved.
 * Copyright 2018 Raising the Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 * 
 * The R&D leading to these results received funding from the
 * Department of Education - Grant H421A150005 (GPII-APCP). However,
 * these results do not necessarily represent the policy of the
 * Department of Education, and you should not assume endorsement by the
 * Federal Government.
 */

"use strict";

// NOTE: this code redirects hardcoded Fluid-based calls through gpii.app.language to the OS-specific gpii.xplat.language settings handler

var fluid = require("gpii-universal");

var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.app");
fluid.registerNamespace("gpii.app.language");

fluid.defaults("gpii.app.language", {
    gradeNames: ["fluid.component", "fluid.modelComponent"],
    invokers: {
        getInstalledLanguages: {
            funcName: "gpii.app.language.getInstalled",
            args: [ "{that}" ]
        },
        getLanguageNames: {
            funcName: "gpii.app.language.getLanguageNames",
            args: [ "{that}", "{arguments}.0" ]
        },
        getDisplayLanguage: {
            funcName: "gpii.app.language.getDisplayLanguage"
        },
//         startMessages: "{gpii.windows.messages}.start({that})",
//         stopMessages: "{gpii.windows.messages}.stop({that})"
    },
    listeners: {
        "onCreate.update": "{that}.getInstalledLanguages()",
//         "onCreate.messages": "{that}.startMessages()",
//         "{gpii.windows.messages}.events.onMessage": {
//             funcName: "gpii.app.language.windowMessage",
//             // that, hwnd, msg, wParam, lParam
//             args: [ "{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3" ]
//         }
    },
    // The model gets updated whenever getInstalledLanguages is called.
    model: {
        /** @type {Map<String,InstalledLanguage>} */
        installedLanguages: null,
        /** Currently configured display language */
        configuredLanguage: null
    },
    members: {
        /** code=>name map of language names in english */
        englishNames: {}
    }
});

/**
 * Gets the display languages that are installed on the system, and updates the model.
 *
 * These are listed in HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\MUI\UILanguages
 *
 * @param {Component} that The gpii.[ospackage].language instance.
 * @return {Promise<Map<String,InstalledLanguage>>} A promise, resolving with either the language names if the list has
 * changed, or null if there was no change.
 */
gpii.app.language.getInstalled = function (that) {
    return gpii.xplat.language.getInstalled(that);
};

/**
 * Gets the language names of the given languages, identified by their IETF language codes (`en`, `es-MX`).
 *
 * It returns an object containing the name in English, the current display language, and native language.
 *
 * If only the language identifier (first 2 characters) are passed, then the language name is returned.
 * If the country code is also given, then the country is also returned in brackets:
 *  - If the country is code is unknown, or the country-specific language isn't recognised, then the language code is
 *     used instead of the country.
 *  - If the language is only spoken in a single country (eg, Bulgarian), then the country is not returned, unless a
 *     different country was passed (eg, bg-GB).
 * If the language is unknown, then an empty string is used. If the language code is invalid, null each field is null.
 *
 * Examples:
 *```
 * "es-MX" => { english: "Spanish (Mexico)", local: "Spanish (Mexico)", native: "Español (México)" }
 * "en" => { english: "English", local: "English", native: "English" }
 * "en-GB" => { "english": "English (United Kingdom)", "local": "English (United Kingdom)", "native": "English (United Kingdom)" }
 *```
 * When the current display language is French:
 * ```
 * "nl-NL" => { english: "Dutch (Netherlands)", local: "Néerlandais (Pays-Bas)", native: "Nederlands (Nederland)" }
 * ```
 * @param {Component} that The gpii.[ospackage].language instance.
 * @param {String|Array<String>} langCodes The language code(s), in the form of `lang[-COUNTRY]`.
 * @return {Promise<LanguageNames>} A promise, resolving with the language names.
 */
gpii.app.language.getLanguageNames = function (that, langCodes) {
    return gpii.xplat.language.getLanguageNames(that, langCodes);
};

// /**
//  * Called when an event has been received by the message window.
//  *
//  * When a relevant message is received, the installed languages model will be updated. The current language can't be
//  * changed during a session, however the drop-down list in control panel still broadcasts WM_SETTINGCHANGE.
//  *
//  * @param {Component} that The gpii.[ospackage].language component.
//  * @param {Number} hwnd The window handle of the message window.
//  * @param {Number} msg The message identifier.
//  * #param {Number} wParam Message specific data. (unused)
//  * #param {Buffer} lParam Additional message specific data. (unused)
//  */
// gpii.app.language.windowMessage = function (that, hwnd, msg) {
//     if (msg === gpii.windows.API_constants.WM_SETTINGCHANGE
//         || msg === gpii.windows.API_constants.WM_INPUTLANGCHANGE) {
//         that.getInstalledLanguages();
//     }
// };

/**
 * Gets the currently configured display language.
 *
 * This is the language which new processes will use.
 *
 * @return {String} The language code of the currently configured display language.
 */
gpii.app.language.getDisplayLanguage = function () {
    return gpii.xplat.language.getDisplayLanguage();
};
