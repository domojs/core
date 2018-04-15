// import 'jquery';
import * as akala from '@akala/server';
export * from './worker'

akala.injectWithName(['$master', '$isModule'], function (master: akala.worker.MasterRegistration, isModule: akala.worker.IsModule)
{
    if (isModule('@akala-modules/core'))
        master(module.filename, './master', './worker');
})();
