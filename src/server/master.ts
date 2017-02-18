
import * as di from 'akala-core'
import * as express from 'express'

console.log('core master');
di.injectWithName(['$router', '$config'], function (app, config)
{
    app.use('/assets/', express.static('modules/core/assets'));
    console.log(config);
    app.get('/', express.static(config && config.root || 'modules/core/views'));
    // app.use(express.static('modules/core/views'));
})();