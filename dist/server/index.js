"use strict";
// import 'jquery';
var di = require("akala-core");
di.injectWithName(['$master'], function (master) {
    master(module.filename, './master');
})();

//# sourceMappingURL=index.js.map
