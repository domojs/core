"use strict";
// import 'jquery';
var di = require('node-di2');
di.injectWithName(['$master'], function (master) {
    master(module.filename, './master');
})();

//# sourceMappingURL=index.js.map
