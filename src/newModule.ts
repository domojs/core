#! /usr/bin/env node
import * as fs from 'fs';
import { spawn } from 'child_process';

(function (moduleName: string)
{
    if (!moduleName)
    {
        console.error('missing module name');
        return;
    }

    var modulePath = './modules/' + moduleName;

    fs.mkdir(modulePath, function (error)
    {
        if (error)
        {
            console.error(error);
            return;
        }

        fs.writeFile(modulePath + '/.gitignore', 'node_modules\
bower_components\
.vscode\
', function (error)
            {
                if (error)
                {
                    console.error(error);
                    return;
                }

                spawn('git', ['init'], { cwd: modulePath }).on('exit', function ()
                {
                    spawn('git', ['submodule', 'add', modulePath, modulePath]).on('exit', function ()
                    {
                        fs.mkdir(modulePath + '/src', function (error)
                        {
                            if (error)
                            {
                                console.error(error);
                                return;
                            }

                            fs.writeFile(modulePath + '/package.json', JSON.stringify({
                                "name": moduleName,
                                "version": "1.0.0",
                                "description": "",
                                "main": "dist/index.js",
                                "scripts": {
                                    "test": "echo \"Error: no test specified\" && exit 1"
                                },
                                "author": "",
                                "license": "ISC",
                                "dependencies": {},
                                "typings": "dist/index.d.ts"
                            }
                                , null, 4)
                                , function (error)
                                {
                                    if (error)
                                    {
                                        console.error(error);
                                        return;
                                    }

                                    fs.mkdir(modulePath + '/src/server', function (error)
                                    {
                                        if (error)
                                        {
                                            console.error(error);
                                            return;
                                        }

                                        fs.writeFile(modulePath + '/src/server/tsconfig.json', JSON.stringify({
                                            "compileOnSave": true,
                                            "compilerOptions": {
                                                "sourceMap": true,
                                                "experimentalDecorators": true,
                                                "declaration": true,
                                                "moduleResolution": "node",
                                                "module": "commonjs",
                                                "outDir": "dist"
                                            },
                                            "exclude": [
                                                "dist",
                                                "node_modules"
                                            ]
                                        }
                                            , null, 4)
                                            , function (error)
                                            {
                                                if (error)
                                                {
                                                    console.error(error);
                                                    return;
                                                }
                                            });
                                    });
                                });
                        });
                    });
                });

            });
    });

})(process.argv[2])