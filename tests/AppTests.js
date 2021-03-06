/**
 * PSP unit tests
 *
 * Unit tests for the Menu and the Tray components of the PSP.
 * Copyright 2017 Raising the Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */
/* eslint-env node */
"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
fluid.loadTestingSupport();
var jqUnit = fluid.require("node-jqunit");

require("../src/main/app.js");
fluid.registerNamespace("gpii.tests.app");

jqUnit.module("GPII Application Tests");

// Unit test the functions in gpii.app.menu

var prefSet1 = {
        path: "a",
        name: "not used"
    },
    prefSet2 = {
        path: "b",
        name: "used"
    },
    emptyPrefSets = {
        sets: [],
        activeSet: null
    },
    keyedInPrefSets = {
        sets: [prefSet1, prefSet2],
        activeSet: prefSet2.path
    };


jqUnit.test("Tray.getTrayTooltip", function () {
    var messages = {
        defaultTooltip: "Morphic: Ready",
        prefSetTooltip: "Morphic: %prefSet"
    };

    jqUnit.expect(2);

    jqUnit.assertEquals("The tooltip is default when user is not keyedIn",
        messages.defaultTooltip,
        gpii.app.getTrayTooltip(false, emptyPrefSets, messages)
    );

    jqUnit.assertEquals("The tooltip is the active pref set name when user is keyed in",
        fluid.stringTemplate(messages.prefSetTooltip, {prefSet: prefSet2.name}),
        gpii.app.getTrayTooltip(true, keyedInPrefSets, messages)
    );
});

jqUnit.test("Tray.getTrayIcon", function () {
    var icons = {
        keyedIn: "keyedInIcon",
        keyedOut: "keyedOutIcon"
    };

    jqUnit.expect(2);

    jqUnit.assertEquals("Tray icon is keyedOut icon when there is no keyed in user",
        icons.keyedOut,
        gpii.app.getTrayIcon(null, icons)
    );

    var keyedInUserToken = "alice";
    jqUnit.assertEquals("Tray icon is keyedIn icon when user is keyed in",
        icons.keyedIn,
        gpii.app.getTrayIcon(keyedInUserToken, icons)
    );
});

jqUnit.test("Menu.getSimpleMenuItem", function () {
    jqUnit.expect(4);

    var event = "onQSS",
        label = "Open Morphic",
        menuItem = gpii.app.menu.getSimpleMenuItem(label, event);


    jqUnit.assertEquals("Simple menu item object have proper handler", event, menuItem.click);
    jqUnit.assertEquals("Simple menu item object have proper label", label, menuItem.label);
    jqUnit.assertDeepEq("Simple menu item object have proper params", {}, menuItem.args);

    var args = { token: "some" };
    var menuItemWithArgs = gpii.app.menu.getSimpleMenuItem(label, event, args);

    jqUnit.assertDeepEq("Simple menu item object have proper params", args, menuItemWithArgs.args);
});

gpii.tests.app.testPrefSetMenuItem = function (item, label, checked) {
    var prefSetMenuItemEvent = "onActivePreferenceSetAltered";
    jqUnit.assertEquals("Pref set menu item has proper click handler", prefSetMenuItemEvent, item.click);

    var prefSetMenuType = "radio";
    jqUnit.assertEquals("Pref set menu item has proper type", prefSetMenuType, item.type);

    jqUnit.assertEquals("Pref set menu item has proper label", label, item.label);
    jqUnit.assertEquals("Pref set menu item has proper (un)checked state", checked, item.checked);
};

jqUnit.test("Menu.getPreferenceSetsMenuItems", function () {
    var notKeyedInItems = gpii.app.menu.getPreferenceSetsMenuItems(false, [], null);
    var prefSetList = gpii.app.menu.getPreferenceSetsMenuItems(true, keyedInPrefSets.sets, prefSet2.path);

    jqUnit.expect(10);

    jqUnit.assertEquals("Pref set menu items list is empty", 0, notKeyedInItems.length);
    // Note: +2 for separators
    jqUnit.assertEquals("Pref set menu items list", 4, prefSetList.length);

    gpii.tests.app.testPrefSetMenuItem(prefSetList[1], keyedInPrefSets.sets[0].name, false);
    gpii.tests.app.testPrefSetMenuItem(prefSetList[2], keyedInPrefSets.sets[1].name, true);
});

jqUnit.test("Menu.getKeyedInSnapset", function () {
    jqUnit.expect(4);

    var snapsetName = "Snapset_1";
    var keyedInStrTemp = "Keyed in with %snapsetName";    // string template

    var keyedInObject = gpii.app.menu.getKeyedInSnapset(false, null, keyedInStrTemp);
    jqUnit.assertFalse("Keyed in user object is not created when no token is provided.", keyedInObject);

    keyedInObject = gpii.app.menu.getKeyedInSnapset(true, snapsetName, keyedInStrTemp);
    jqUnit.assertTrue("Keyed in user object is created when there is a token", keyedInObject);
    jqUnit.assertFalse("Keyed in user object is disabled", keyedInObject.enabled);
    jqUnit.assertEquals("Label is set in the keyed in user object",
        fluid.stringTemplate(keyedInStrTemp, {"snapsetName": snapsetName}), keyedInObject.label);
});

jqUnit.test("Menu.getKeyOut", function () {
    jqUnit.expect(4);
    var token = "alice";
    var keyOutStr = "Reset Morphic";

    var keyOutObj = gpii.app.menu.getKeyOut(token, keyOutStr);
    jqUnit.assertTrue("Key out object exists", keyOutObj);
    jqUnit.assertEquals("Key out is bound to onClick", "onKeyOut", keyOutObj.click);
    jqUnit.assertEquals("Token is set in the key out object", token, keyOutObj.args.token);
    jqUnit.assertEquals("Label is set in the key out object", keyOutStr, keyOutObj.label);

});

var item1 = {label: "Item 1", enabled: false};
var item2 = {label: "Item 2"};
var item3 = {label: "Item 3", click: "onKeyIn", args: {token: "3"}};
var submenu = {label: "submenu", submenu: [item3]};

jqUnit.test("Menu.expandMenuTemplate", function () {
    jqUnit.expect(4);

    // A mocked event
    var events = {
        onKeyIn: {
            fire: function (args) {
                jqUnit.assertEquals("Menu item was \"clicked\" with proper arguments", item3.args, args);
            }
        }
    };

    var menuTemplate = gpii.app.menu.generateMenuTemplate(item1, item2, submenu);
    jqUnit.assertEquals("There are 3 items in the menuTemplate after generation", 3, menuTemplate.length);

    menuTemplate = gpii.app.menu.expandMenuTemplate(menuTemplate, events);
    jqUnit.assertEquals("There are 3 items in the menuTemplate after expansion", 3, menuTemplate.length);
    jqUnit.assertEquals("The click string has been expanded into a function", "function", typeof menuTemplate[2].submenu[0].click);

    menuTemplate[2].submenu[0].click();
});
