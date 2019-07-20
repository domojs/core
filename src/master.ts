import * as akala from '@akala/server'
import * as jsonrpc from '@akala/json-rpc-ws'
import * as stream from 'stream'
import * as ws from 'ws'

akala.injectWithNameAsync(['$preAuthenticationRouter', '$config.@akala-modules/core'], function (app, config)
{
    app.get('/assets', akala.static('modules/core/assets'));
    app.get('/', akala.static(config && config.root || 'modules/core/views'));

    var router = new akala.HttpRouter();
    app.use('/assets', router.router)

    var assets: { [path: string]: jsonrpc.Connection[] } = {};

    var server = akala.api.jsonrpcws(akala.master.metaRouter).createServer('/assets', {
        register: function (param, socket)
        {
            if (!assets[param.path])
            {
                assets[param.path] = assets[param.path] || [];
            }

            var indexOfSocket = assets[param.path].push(socket)
            if (socket.socket instanceof ws)
                socket.socket.on('close', function ()
                {
                    assets[param.path].splice(indexOfSocket, 1);
                })

            var self = this;

            router.get(param.path, function (req, res, next)
            {
                akala.when(akala.map(assets[param.path], function (socket)
                {
                    if (!socket.socket)
                        return <any>Promise.resolve();
                    var client = self.$proxy(socket);
                    return client.getContent(akala.master.translateRequest(req));
                })).then(function (responses: akala.CallbackResponse[])
                {
                    var validResponses = akala.grep(responses, function (r: akala.CallbackResponse)
                    {
                        return r && r.statusCode == 200;
                    });
                    if (validResponses.length == 0)
                    {
                        akala.master.handleResponse(res, null, 200)(akala.grep(responses, function (r) { return !!r; })[0]);
                        return;
                    }

                    // console.log(responses);

                    var rw = new stream.PassThrough();

                    var response: akala.CallbackResponse = Object.assign(rw, {
                        headers: {},
                        statusCode: 200,
                        data: undefined
                    });

                    akala.eachAsync(validResponses, function (r, i, next)
                    {
                        var linebreaks = 0;
                        akala.each(r.headers, function (value, name)
                        {
                            response.headers[name] = value;
                        });

                        if (r instanceof stream.Readable)
                        {
                            rw.write('\n');
                            linebreaks++;
                            r.pipe(rw, { end: false });
                            r.on('end', function ()
                            {
                                next();
                            });
                        }
                        else
                            next();
                    }, function ()
                        {
                            rw.end();
                        });
                    response.headers['Content-Length'] = validResponses.reduce(function (value, response) { return value + response.headers['Content-Length'] + 1; }, 0);
                    response.headers['Last-Modified'] = new Date(validResponses.reduce(function (value, response) { return Math.max(value, new Date(response.headers['Last-Modified']).valueOf()); }, 0)).toUTCString();

                    akala.master.handleResponse(res, null, 200)(response);


                }, function (rejection)
                    {
                        akala.master.handleResponse(res, null, 404)({ data: rejection });
                    });
            });
        }
    })
});