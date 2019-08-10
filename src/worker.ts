import * as akala from '@akala/server';

var log = akala.log('akala:module:core:worker');

export interface AssetRegistration
{
    register(url: string, path: string, options?: akala.worker.SendFileOptions): void;
}

export namespace AssetRegistration
{
    export const name = '$assets'
}


akala.registerFactory<PromiseLike<AssetRegistration>>(AssetRegistration.name, function ()
{
    return akala.worker.createClient('assets').then(function (client)
    {
        var router = new akala.worker.Router();

        var routerClient = akala.api.jsonrpcws(akala.master.metaRouter).createClient(client, { getContent: akala.worker.handle(router, '') });

        return {
            register: function (url: string, path: string, options: akala.worker.SendFileOptions)
            {
                router.get(url, akala.worker.expressWrap(function (req, res: akala.worker.Callback, next)
                {
                    res.sendFile(path, Object.assign({ acceptRanges: false, dotfiles: 'allow', extensions: false }, options), next);
                }));

                routerClient.$proxy().register({ path: url, remap: null });
            }
        };
    });
})
