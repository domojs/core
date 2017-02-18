// import 'jquery';
import * as di from 'akala-core';

di.injectWithName(['$master'], function (master)
{
    master(module.filename, './master');
})();
