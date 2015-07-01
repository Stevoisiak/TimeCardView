/*
 * TimeCard View
 * Copyright ©2015 Thomas Nelson, Jacob Nichols, David Opp, Todd Brochu,
Andrew McGown, Sasha Fahrenkopf, Cameron B. White.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE text file in the root directory of this source tree.
 */
var ReactTools = require("react-tools");
module.exports = {
    process: function(src) {
        return ReactTools.transform(src, {
            harmony: true
        });
    }
};
