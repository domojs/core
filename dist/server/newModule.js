#! /usr/bin/env node
"use strict";
var fs = require("fs");
var child_process_1 = require("child_process");
(function (moduleName) {
    if (!moduleName) {
        console.error('missing module name');
        return;
    }
    var modulePath = './modules/' + moduleName;
    fs.mkdir(modulePath, function (error) {
        if (error) {
            console.error(error);
            return;
        }
        fs.writeFile(modulePath + '/.gitignore', 'node_modules\
bower_components\
.vscode\
', function (error) {
            if (error) {
                console.error(error);
                return;
            }
            child_process_1.spawn('git', ['init'], { cwd: modulePath }).on('exit', function () {
                child_process_1.spawn('git', ['submodule', 'add', modulePath, modulePath]).on('exit', function () {
                    fs.mkdir(modulePath + '/src', function (error) {
                        if (error) {
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
                        }, null, 4), function (error) {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            fs.mkdir(modulePath + '/src/server', function (error) {
                                if (error) {
                                    console.error(error);
                                    return;
                                }
                                fs.mkdir(modulePath + '/src/client', function (error) {
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
                                    }, null, 4), function (error) {
                                        if (error) {
                                            console.error(error);
                                            return;
                                        }
                                        fs.writeFile(modulePath + '/src/client/tsconfig.json', JSON.stringify({
                                            "compileOnSave": true,
                                            "compilerOptions": {
                                                "inlineSourceMap": true,
                                                "experimentalDecorators": true,
                                                "declaration": true,
                                                "moduleResolution": "node",
                                                "module": "umd",
                                                "target": "es6",
                                                "outDir": "dist",
                                                "rootDir": "."
                                            },
                                            "exclude": [
                                                "dist",
                                                "node_modules",
                                                "akala/client"
                                            ]
                                        }, null, 4), function (error) {
                                            if (error) {
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
        });
    });
})(process.argv[2]);

//# sourceMappingURL=newModule.js.map
