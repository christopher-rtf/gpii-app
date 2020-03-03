/*
 * Cross-platform Display Redirect
 *
 * Copyright 2016-2020 Raising the Floor -- US Inc. All rights reserved.
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

var fluid = require("gpii-universal");

var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.app");
fluid.registerNamespace("gpii.app.display");

gpii.app.display.getScreenDpi = function (adapter) {
    return gpii.xplat.display.getScreenDpi(adapter);
}

fluid.defaults("gpii.app.display.getScreenDpi", {
    gradeNames: "fluid.function",
    argumentMap: {}
});
