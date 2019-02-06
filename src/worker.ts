import * as akala from '@akala/server';
import * as fs from 'fs';
import * as send from 'send'

var log = akala.log('akala:module:core:worker');

export interface AssetRegistration
{
    register(url: string, path: string): void;
    getContent(url: string): string;
}

export namespace AssetRegistration
{
    export const name = '$assets'
}


akala.registerFactory(AssetRegistration.name, function ()
{
    return akala.worker.createClient('assets').then(function (client)
    {
        var router = new akala.worker.Router();

        var routerClient = akala.api.jsonrpcws(akala.master.metaRouter).createClient(client, { getContent: akala.worker.handle(router, '') });

        return {
            register: function (url: string, path: string)
            {
                router.get(url, akala.worker.expressWrap(function (req, res, next)
                {
                    res.sendFile(path, { acceptRanges: false, dotfiles: 'allow', extensions: false }, next);
                }));

                routerClient.$proxy().register({ path: url });
            }
        };
    });
})
