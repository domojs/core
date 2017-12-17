// import 'jquery';
import * as akala from '@akala/server';
export * from './worker'

if (process.argv[2] == '@akala-modules/core')
    akala.injectWithName(['$master'], function (master)
    {
        master(module.filename, './master', './worker');
    })();
