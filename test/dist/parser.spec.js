"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const parser_1 = require("../../bin/lib/parser");
const validators_1 = require("../../bin/lib/validators");
describe('Parser', function () {
    const parser = new parser_1.Parser();
    const validators = new validators_1.BuiltInValidators();
    it('should parse arguments correctly', function () {
        chai_1.expect(parser.parseArgument('[file_path]', validators.STRING)).to.deep.equal({
            name: 'file_path',
            apiName: 'filePath',
            required: false,
            validators: [validators.STRING],
            default: undefined
        });
        chai_1.expect(parser.parseArgument('<file-path>', validators.STRING, 'package.json')).to.deep.equal({
            name: 'file-path',
            apiName: 'filePath',
            required: true,
            validators: [validators.STRING],
            default: 'package.json'
        });
        chai_1.expect(parser.parseArgument('<relative_file_path>', null, 100)).to.deep.equal({
            name: 'relative_file_path',
            apiName: 'relativeFilePath',
            required: true,
            validators: [],
            default: 100
        });
    });
    it('should fail to parse invalid arguments', function () {
        let parsingError = null;
        try {
            parsingError = null;
            parser.parseArgument('<invalid]');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument <invalid] has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseArgument('invalid');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseArgument('<invalid__argument>');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid__argument has invalid name!`);
        try {
            parsingError = null;
            parser.parseArgument('<--invalid-argument>');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument --invalid-argument has invalid name!`);
        try {
            parsingError = null;
            parser.parseArgument('[invalid__]');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Argument invalid__ has invalid name!`);
    });
    it('should parse options correctly', function () {
        chai_1.expect(parser.parseOption('-p --port <port_number>', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: 'port',
            apiName: 'port',
            description: 'desc',
            required: false,
            multi: false,
            argument: {
                name: 'port_number',
                apiName: 'portNumber',
                required: true,
                validators: [],
                default: undefined
            }
        });
        chai_1.expect(parser.parseOption('--port -p <port_number>', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: 'port',
            apiName: 'port',
            description: 'desc',
            required: false,
            multi: false,
            argument: {
                name: 'port_number',
                apiName: 'portNumber',
                required: true,
                validators: [],
                default: undefined
            }
        });
        chai_1.expect(parser.parseOption('--port -p', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: 'port',
            apiName: 'port',
            description: 'desc',
            required: false,
            multi: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('-p --port', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: 'port',
            apiName: 'port',
            description: 'desc',
            required: false,
            multi: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('-P --portNumber', 'desc', false)).to.deep.equal({
            shortName: 'P',
            longName: 'portNumber',
            apiName: 'portNumber',
            description: 'desc',
            required: false,
            multi: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('-p [port_number]', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: null,
            apiName: null,
            description: 'desc',
            required: false,
            multi: false,
            argument: {
                name: 'port_number',
                apiName: 'portNumber',
                required: false,
                validators: [],
                default: undefined
            }
        });
        chai_1.expect(parser.parseOption('--port [port_number]', 'desc', false)).to.deep.equal({
            shortName: null,
            longName: 'port',
            apiName: 'port',
            description: 'desc',
            required: false,
            multi: false,
            argument: {
                name: 'port_number',
                apiName: 'portNumber',
                required: false,
                validators: [],
                default: undefined
            }
        });
        chai_1.expect(parser.parseOption('--port', 'desc', false)).to.deep.equal({
            shortName: null,
            longName: 'port',
            apiName: 'port',
            description: 'desc',
            required: false,
            multi: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('--port-p', 'desc', false)).to.deep.equal({
            shortName: null,
            longName: 'port-p',
            apiName: 'portP',
            description: 'desc',
            required: false,
            multi: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('-p', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: null,
            apiName: null,
            description: 'desc',
            required: false,
            multi: false,
            argument: null
        });
    });
    it('should fail to parse invalid options', function () {
        let parsingError = null;
        try {
            parsingError = null;
            parser.parseOption('port');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option port has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('p');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option p has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('port <argument>');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option port <argument> has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('--port_number');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option --port_number has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('--port_ -p [argument]');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option --port_ -p [argument] has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('-p --p');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p --p has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('[argument] -p --port');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option [argument] -p --port has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('-p [argument] --port');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p [argument] --port has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('-p--port [p]');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p--port [p] has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('-port [p]');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -port [p] has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('-p--port');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option -p--port has invalid syntax or contains invalid characters!`);
        try {
            parsingError = null;
            parser.parseOption('---port');
        }
        catch (error) {
            parsingError = error;
        }
        chai_1.expect(parsingError).not.to.be.null;
        chai_1.expect(parsingError.message).to.equal(`ARGUMENTAL_ERROR: Option ---port has invalid syntax or contains invalid characters!`);
    });
    it('should parse cli arguments correctly', function () {
        const commands = {
            'new script': {
                name: 'new script',
                description: null,
                aliases: ['ns'],
                arguments: [
                    {
                        name: 'script_type',
                        apiName: 'scriptType',
                        required: true,
                        description: null,
                        validators: [],
                        default: undefined
                    },
                    {
                        name: 'script_name',
                        apiName: 'scriptName',
                        required: true,
                        description: null,
                        validators: [],
                        default: undefined
                    }
                ],
                options: [
                    {
                        shortName: null,
                        longName: 'skip-compilation',
                        apiName: 'skipCompilation',
                        required: false,
                        argument: null,
                        description: null,
                        multi: false
                    },
                    {
                        shortName: 'd',
                        longName: null,
                        apiName: null,
                        required: false,
                        argument: null,
                        description: null,
                        multi: false
                    },
                    {
                        shortName: 's',
                        longName: null,
                        apiName: null,
                        required: false,
                        argument: null,
                        description: null,
                        multi: false
                    },
                    {
                        shortName: 'c',
                        longName: 'copy-to',
                        apiName: 'copyTo',
                        required: true,
                        multi: false,
                        argument: {
                            name: 'destination',
                            apiName: 'destination',
                            required: true,
                            validators: [],
                            default: undefined
                        },
                        description: null
                    },
                    {
                        shortName: 'p',
                        longName: null,
                        apiName: null,
                        required: true,
                        multi: false,
                        argument: {
                            name: 'port_number',
                            apiName: 'portNumber',
                            required: true,
                            validators: [],
                            default: undefined
                        },
                        description: null
                    },
                    {
                        shortName: 'x',
                        longName: null,
                        apiName: null,
                        required: true,
                        multi: false,
                        argument: {
                            name: 'port_number',
                            apiName: 'portNumber',
                            required: true,
                            validators: [],
                            default: undefined
                        },
                        description: null
                    },
                    {
                        shortName: 'f',
                        longName: 'force',
                        apiName: 'force',
                        required: true,
                        multi: false,
                        argument: null,
                        description: null
                    },
                    {
                        shortName: 'a',
                        longName: 'abort',
                        apiName: 'abort',
                        required: true,
                        multi: false,
                        argument: {
                            name: 'code',
                            apiName: 'code',
                            required: true,
                            validators: [],
                            default: undefined
                        },
                        description: null
                    },
                    {
                        shortName: 'b',
                        longName: 'bail',
                        apiName: 'bail',
                        required: true,
                        multi: false,
                        argument: {
                            name: 'code',
                            apiName: 'code',
                            required: true,
                            validators: [],
                            default: undefined
                        },
                        description: null
                    }
                ],
                actions: []
            }
        };
        let args = parser.parseCliArguments(['new', 'script', '--ext', '.ts', 'some-script.proc.ts', '-ds', '-sc', 'somewhere', '-c', 'here', '--copy-to', 'there', '-x', '-a', '2', '--bail', '0', '-b', '0'], commands);
        chai_1.expect(args).to.deep.equal({
            cmd: 'new script',
            args: {
                scriptType: 'some-script.proc.ts',
                scriptName: null
            },
            opts: {
                skipCompilation: false,
                d: true,
                s: true,
                c: ['somewhere', 'here', 'there'],
                copyTo: ['somewhere', 'here', 'there'],
                p: undefined,
                x: null,
                f: false,
                force: false,
                a: '2',
                abort: '2',
                b: ['0', '0'],
                bail: ['0', '0']
            }
        });
        args = parser.parseCliArguments(['ns', 'ts', '-a', '0', 'some-script.proc.ts', '-df', '-x', '""', '--abort', '1', '--abort', '-a', '"error code"'], commands);
        chai_1.expect(args).to.deep.equal({
            cmd: 'new script',
            args: {
                scriptType: 'ts',
                scriptName: 'some-script.proc.ts'
            },
            opts: {
                skipCompilation: false,
                d: true,
                s: false,
                c: undefined,
                copyTo: undefined,
                p: undefined,
                x: '',
                f: true,
                force: true,
                a: ['0', '1', null, 'error code'],
                abort: ['0', '1', null, 'error code'],
                b: undefined,
                bail: undefined
            }
        });
    });
    it('should fail to parse invalid cli arguments', function () {
        const commands = {
            'new script': {
                name: 'new script',
                description: null,
                aliases: ['ns'],
                arguments: [
                    {
                        name: 'script_type',
                        apiName: 'scriptType',
                        required: true,
                        description: null,
                        validators: [],
                        default: undefined
                    },
                    {
                        name: 'script_name',
                        apiName: 'scriptName',
                        required: true,
                        description: null,
                        validators: [],
                        default: undefined
                    }
                ],
                options: [
                    {
                        shortName: null,
                        longName: 'skip-compilation',
                        apiName: 'skipCompilation',
                        required: false,
                        argument: null,
                        description: null,
                        multi: false
                    }
                ],
                actions: []
            }
        };
        let args = parser.parseCliArguments(['s', 'ts'], commands);
        chai_1.expect(args).to.deep.equal({
            error: true,
            code: 'COMMAND_NOT_FOUND',
            minimistParsed: null
        });
        args = parser.parseCliArguments(['ns', 'ts', 'sd', 'dd', '--skip-compilation'], commands);
        chai_1.expect(args).to.deep.equal({
            error: true,
            code: 'ARGS_EXCEEDED',
            minimistParsed: {
                _: ['dd'],
                'skip-compilation': true
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLnNwZWMuanMiLCJzb3VyY2VSb290Ijoic3JjLyIsInNvdXJjZXMiOlsicGFyc2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLHlEQUE2RDtBQUU3RCxRQUFRLENBQUMsUUFBUSxFQUFFO0lBRWpCLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7SUFDNUIsTUFBTSxVQUFVLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO0lBRTNDLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtRQUVyQyxhQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDM0UsSUFBSSxFQUFFLFdBQVc7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQy9CLE9BQU8sRUFBRSxTQUFTO1NBQ25CLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDM0YsSUFBSSxFQUFFLFdBQVc7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQy9CLE9BQU8sRUFBRSxjQUFjO1NBQ3hCLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLHNCQUFzQixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzVFLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsT0FBTyxFQUFFLGtCQUFrQjtZQUMzQixRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxFQUFFO1lBQ2QsT0FBTyxFQUFFLEdBQUc7U0FDYixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtRQUUzQyxJQUFJLFlBQVksR0FBVSxJQUFJLENBQUM7UUFFL0IsSUFBSTtZQUVGLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUVuQztRQUNELE9BQU8sS0FBSyxFQUFFO1lBRVosWUFBWSxHQUFHLEtBQUssQ0FBQztTQUV0QjtRQUVELGFBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDcEMsYUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHlGQUF5RixDQUFDLENBQUM7UUFFakksSUFBSTtZQUVGLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUVqQztRQUNELE9BQU8sS0FBSyxFQUFFO1lBRVosWUFBWSxHQUFHLEtBQUssQ0FBQztTQUV0QjtRQUVELGFBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDcEMsYUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHVGQUF1RixDQUFDLENBQUM7UUFFL0gsSUFBSTtZQUVGLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBRTdDO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFFWixZQUFZLEdBQUcsS0FBSyxDQUFDO1NBRXRCO1FBRUQsYUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNwQyxhQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztRQUV4RyxJQUFJO1lBRUYsWUFBWSxHQUFHLElBQUksQ0FBQztZQUNwQixNQUFNLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FFOUM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1FBRXpHLElBQUk7WUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7U0FFckM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0lBRWxHLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1FBRW5DLGFBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2pGLFNBQVMsRUFBRSxHQUFHO1lBQ2QsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsTUFBTTtZQUNuQixRQUFRLEVBQUUsS0FBSztZQUNmLEtBQUssRUFBRSxLQUFLO1lBQ1osUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSxhQUFhO2dCQUNuQixPQUFPLEVBQUUsWUFBWTtnQkFDckIsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLFNBQVM7YUFDbkI7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNqRixTQUFTLEVBQUUsR0FBRztZQUNkLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLE1BQU07WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsS0FBSztZQUNaLFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsT0FBTyxFQUFFLFlBQVk7Z0JBQ3JCLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRSxFQUFFO2dCQUNkLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ25FLFNBQVMsRUFBRSxHQUFHO1lBQ2QsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLE1BQU07WUFDZixXQUFXLEVBQUUsTUFBTTtZQUNuQixRQUFRLEVBQUUsS0FBSztZQUNmLEtBQUssRUFBRSxLQUFLO1lBQ1osUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbkUsU0FBUyxFQUFFLEdBQUc7WUFDZCxRQUFRLEVBQUUsTUFBTTtZQUNoQixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxNQUFNO1lBQ25CLFFBQVEsRUFBRSxLQUFLO1lBQ2YsS0FBSyxFQUFFLEtBQUs7WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pFLFNBQVMsRUFBRSxHQUFHO1lBQ2QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsT0FBTyxFQUFFLFlBQVk7WUFDckIsV0FBVyxFQUFFLE1BQU07WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsS0FBSztZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDMUUsU0FBUyxFQUFFLEdBQUc7WUFDZCxRQUFRLEVBQUUsSUFBSTtZQUNkLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLE1BQU07WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsS0FBSztZQUNaLFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsT0FBTyxFQUFFLFlBQVk7Z0JBQ3JCLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFVBQVUsRUFBRSxFQUFFO2dCQUNkLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDOUUsU0FBUyxFQUFFLElBQUk7WUFDZixRQUFRLEVBQUUsTUFBTTtZQUNoQixPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSxNQUFNO1lBQ25CLFFBQVEsRUFBRSxLQUFLO1lBQ2YsS0FBSyxFQUFFLEtBQUs7WUFDWixRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixRQUFRLEVBQUUsS0FBSztnQkFDZixVQUFVLEVBQUUsRUFBRTtnQkFDZCxPQUFPLEVBQUUsU0FBUzthQUNuQjtTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNoRSxTQUFTLEVBQUUsSUFBSTtZQUNmLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLE1BQU07WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsS0FBSztZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2xFLFNBQVMsRUFBRSxJQUFJO1lBQ2YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsT0FBTyxFQUFFLE9BQU87WUFDaEIsV0FBVyxFQUFFLE1BQU07WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsS0FBSztZQUNaLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzVELFNBQVMsRUFBRSxHQUFHO1lBQ2QsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxNQUFNO1lBQ25CLFFBQVEsRUFBRSxLQUFLO1lBQ2YsS0FBSyxFQUFFLEtBQUs7WUFDWixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1FBRXpDLElBQUksWUFBWSxHQUFVLElBQUksQ0FBQztRQUUvQixJQUFJO1lBRUYsWUFBWSxHQUFHLElBQUksQ0FBQztZQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBRTVCO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFFWixZQUFZLEdBQUcsS0FBSyxDQUFDO1NBRXRCO1FBRUQsYUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNwQyxhQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0ZBQWtGLENBQUMsQ0FBQztRQUUxSCxJQUFJO1lBRUYsWUFBWSxHQUFHLElBQUksQ0FBQztZQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBRXpCO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFFWixZQUFZLEdBQUcsS0FBSyxDQUFDO1NBRXRCO1FBRUQsYUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNwQyxhQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsK0VBQStFLENBQUMsQ0FBQztRQUV2SCxJQUFJO1lBRUYsWUFBWSxHQUFHLElBQUksQ0FBQztZQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FFdkM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyw2RkFBNkYsQ0FBQyxDQUFDO1FBRXJJLElBQUk7WUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUM7U0FFckM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQywyRkFBMkYsQ0FBQyxDQUFDO1FBRW5JLElBQUk7WUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUU3QztRQUNELE9BQU8sS0FBSyxFQUFFO1lBRVosWUFBWSxHQUFHLEtBQUssQ0FBQztTQUV0QjtRQUVELGFBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDcEMsYUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLG1HQUFtRyxDQUFDLENBQUM7UUFFM0ksSUFBSTtZQUVGLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUU5QjtRQUNELE9BQU8sS0FBSyxFQUFFO1lBRVosWUFBWSxHQUFHLEtBQUssQ0FBQztTQUV0QjtRQUVELGFBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDcEMsYUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLG9GQUFvRixDQUFDLENBQUM7UUFFNUgsSUFBSTtZQUVGLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBRTVDO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFFWixZQUFZLEdBQUcsS0FBSyxDQUFDO1NBRXRCO1FBRUQsYUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNwQyxhQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0dBQWtHLENBQUMsQ0FBQztRQUUxSSxJQUFJO1lBRUYsWUFBWSxHQUFHLElBQUksQ0FBQztZQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FFNUM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrR0FBa0csQ0FBQyxDQUFDO1FBRTFJLElBQUk7WUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7U0FFcEM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1FBRWxJLElBQUk7WUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7U0FFakM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx1RkFBdUYsQ0FBQyxDQUFDO1FBRS9ILElBQUk7WUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7U0FFaEM7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxzRkFBc0YsQ0FBQyxDQUFDO1FBRTlILElBQUk7WUFFRixZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7U0FFL0I7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLFlBQVksR0FBRyxLQUFLLENBQUM7U0FFdEI7UUFFRCxhQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ3BDLGFBQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxxRkFBcUYsQ0FBQyxDQUFDO0lBRS9ILENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1FBRXpDLE1BQU0sUUFBUSxHQUFtRDtZQUMvRCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2YsU0FBUyxFQUFFO29CQUNUO3dCQUNFLElBQUksRUFBRSxhQUFhO3dCQUNuQixPQUFPLEVBQUUsWUFBWTt3QkFDckIsUUFBUSxFQUFFLElBQUk7d0JBQ2QsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLFVBQVUsRUFBRSxFQUFFO3dCQUNkLE9BQU8sRUFBRSxTQUFTO3FCQUNuQjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsYUFBYTt3QkFDbkIsT0FBTyxFQUFFLFlBQVk7d0JBQ3JCLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixVQUFVLEVBQUUsRUFBRTt3QkFDZCxPQUFPLEVBQUUsU0FBUztxQkFDbkI7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQO3dCQUNFLFNBQVMsRUFBRSxJQUFJO3dCQUNmLFFBQVEsRUFBRSxrQkFBa0I7d0JBQzVCLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLFFBQVEsRUFBRSxLQUFLO3dCQUNmLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixLQUFLLEVBQUUsS0FBSztxQkFDYjtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsR0FBRzt3QkFDZCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxPQUFPLEVBQUUsSUFBSTt3QkFDYixRQUFRLEVBQUUsS0FBSzt3QkFDZixRQUFRLEVBQUUsSUFBSTt3QkFDZCxXQUFXLEVBQUUsSUFBSTt3QkFDakIsS0FBSyxFQUFFLEtBQUs7cUJBQ2I7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLEdBQUc7d0JBQ2QsUUFBUSxFQUFFLElBQUk7d0JBQ2QsT0FBTyxFQUFFLElBQUk7d0JBQ2IsUUFBUSxFQUFFLEtBQUs7d0JBQ2YsUUFBUSxFQUFFLElBQUk7d0JBQ2QsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLEtBQUssRUFBRSxLQUFLO3FCQUNiO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxHQUFHO3dCQUNkLFFBQVEsRUFBRSxTQUFTO3dCQUNuQixPQUFPLEVBQUUsUUFBUTt3QkFDakIsUUFBUSxFQUFFLElBQUk7d0JBQ2QsS0FBSyxFQUFFLEtBQUs7d0JBQ1osUUFBUSxFQUFFOzRCQUNSLElBQUksRUFBRSxhQUFhOzRCQUNuQixPQUFPLEVBQUUsYUFBYTs0QkFDdEIsUUFBUSxFQUFFLElBQUk7NEJBQ2QsVUFBVSxFQUFFLEVBQUU7NEJBQ2QsT0FBTyxFQUFFLFNBQVM7eUJBQ25CO3dCQUNELFdBQVcsRUFBRSxJQUFJO3FCQUNsQjtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsR0FBRzt3QkFDZCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxPQUFPLEVBQUUsSUFBSTt3QkFDYixRQUFRLEVBQUUsSUFBSTt3QkFDZCxLQUFLLEVBQUUsS0FBSzt3QkFDWixRQUFRLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLGFBQWE7NEJBQ25CLE9BQU8sRUFBRSxZQUFZOzRCQUNyQixRQUFRLEVBQUUsSUFBSTs0QkFDZCxVQUFVLEVBQUUsRUFBRTs0QkFDZCxPQUFPLEVBQUUsU0FBUzt5QkFDbkI7d0JBQ0QsV0FBVyxFQUFFLElBQUk7cUJBQ2xCO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxHQUFHO3dCQUNkLFFBQVEsRUFBRSxJQUFJO3dCQUNkLE9BQU8sRUFBRSxJQUFJO3dCQUNiLFFBQVEsRUFBRSxJQUFJO3dCQUNkLEtBQUssRUFBRSxLQUFLO3dCQUNaLFFBQVEsRUFBRTs0QkFDUixJQUFJLEVBQUUsYUFBYTs0QkFDbkIsT0FBTyxFQUFFLFlBQVk7NEJBQ3JCLFFBQVEsRUFBRSxJQUFJOzRCQUNkLFVBQVUsRUFBRSxFQUFFOzRCQUNkLE9BQU8sRUFBRSxTQUFTO3lCQUNuQjt3QkFDRCxXQUFXLEVBQUUsSUFBSTtxQkFDbEI7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLEdBQUc7d0JBQ2QsUUFBUSxFQUFFLE9BQU87d0JBQ2pCLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixRQUFRLEVBQUUsSUFBSTt3QkFDZCxLQUFLLEVBQUUsS0FBSzt3QkFDWixRQUFRLEVBQUUsSUFBSTt3QkFDZCxXQUFXLEVBQUUsSUFBSTtxQkFDbEI7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLEdBQUc7d0JBQ2QsUUFBUSxFQUFFLE9BQU87d0JBQ2pCLE9BQU8sRUFBRSxPQUFPO3dCQUNoQixRQUFRLEVBQUUsSUFBSTt3QkFDZCxLQUFLLEVBQUUsS0FBSzt3QkFDWixRQUFRLEVBQUU7NEJBQ1IsSUFBSSxFQUFFLE1BQU07NEJBQ1osT0FBTyxFQUFFLE1BQU07NEJBQ2YsUUFBUSxFQUFFLElBQUk7NEJBQ2QsVUFBVSxFQUFFLEVBQUU7NEJBQ2QsT0FBTyxFQUFFLFNBQVM7eUJBQ25CO3dCQUNELFdBQVcsRUFBRSxJQUFJO3FCQUNsQjtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsR0FBRzt3QkFDZCxRQUFRLEVBQUUsTUFBTTt3QkFDaEIsT0FBTyxFQUFFLE1BQU07d0JBQ2YsUUFBUSxFQUFFLElBQUk7d0JBQ2QsS0FBSyxFQUFFLEtBQUs7d0JBQ1osUUFBUSxFQUFFOzRCQUNSLElBQUksRUFBRSxNQUFNOzRCQUNaLE9BQU8sRUFBRSxNQUFNOzRCQUNmLFFBQVEsRUFBRSxJQUFJOzRCQUNkLFVBQVUsRUFBRSxFQUFFOzRCQUNkLE9BQU8sRUFBRSxTQUFTO3lCQUNuQjt3QkFDRCxXQUFXLEVBQUUsSUFBSTtxQkFDbEI7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFLEVBQUU7YUFDWjtTQUNGLENBQUM7UUFFRixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWxOLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QixHQUFHLEVBQUUsWUFBWTtZQUNqQixJQUFJLEVBQUU7Z0JBQ0osVUFBVSxFQUFFLHFCQUFxQjtnQkFDakMsVUFBVSxFQUFFLElBQUk7YUFDakI7WUFDRCxJQUFJLEVBQUU7Z0JBQ0osZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLENBQUMsRUFBRSxJQUFJO2dCQUNQLENBQUMsRUFBRSxJQUFJO2dCQUNQLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDO2dCQUNqQyxNQUFNLEVBQUUsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztnQkFDdEMsQ0FBQyxFQUFFLFNBQVM7Z0JBQ1osQ0FBQyxFQUFFLElBQUk7Z0JBQ1AsQ0FBQyxFQUFFLEtBQUs7Z0JBQ1IsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osQ0FBQyxFQUFFLEdBQUc7Z0JBQ04sS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDYixJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2FBQ2pCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFOUosYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEdBQUcsRUFBRSxZQUFZO1lBQ2pCLElBQUksRUFBRTtnQkFDSixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsVUFBVSxFQUFFLHFCQUFxQjthQUNsQztZQUNELElBQUksRUFBRTtnQkFDSixlQUFlLEVBQUUsS0FBSztnQkFDdEIsQ0FBQyxFQUFFLElBQUk7Z0JBQ1AsQ0FBQyxFQUFFLEtBQUs7Z0JBQ1IsQ0FBQyxFQUFFLFNBQVM7Z0JBQ1osTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLENBQUMsRUFBRSxTQUFTO2dCQUNaLENBQUMsRUFBRSxFQUFFO2dCQUNMLENBQUMsRUFBRSxJQUFJO2dCQUNQLEtBQUssRUFBRSxJQUFJO2dCQUNYLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQztnQkFDakMsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDO2dCQUNyQyxDQUFDLEVBQUUsU0FBUztnQkFDWixJQUFJLEVBQUUsU0FBUzthQUNoQjtTQUNGLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1FBRS9DLE1BQU0sUUFBUSxHQUFtRDtZQUMvRCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFdBQVcsRUFBRSxJQUFJO2dCQUNqQixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2YsU0FBUyxFQUFFO29CQUNUO3dCQUNFLElBQUksRUFBRSxhQUFhO3dCQUNuQixPQUFPLEVBQUUsWUFBWTt3QkFDckIsUUFBUSxFQUFFLElBQUk7d0JBQ2QsV0FBVyxFQUFFLElBQUk7d0JBQ2pCLFVBQVUsRUFBRSxFQUFFO3dCQUNkLE9BQU8sRUFBRSxTQUFTO3FCQUNuQjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsYUFBYTt3QkFDbkIsT0FBTyxFQUFFLFlBQVk7d0JBQ3JCLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixVQUFVLEVBQUUsRUFBRTt3QkFDZCxPQUFPLEVBQUUsU0FBUztxQkFDbkI7aUJBQ0Y7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQO3dCQUNFLFNBQVMsRUFBRSxJQUFJO3dCQUNmLFFBQVEsRUFBRSxrQkFBa0I7d0JBQzVCLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLFFBQVEsRUFBRSxLQUFLO3dCQUNmLFFBQVEsRUFBRSxJQUFJO3dCQUNkLFdBQVcsRUFBRSxJQUFJO3dCQUNqQixLQUFLLEVBQUUsS0FBSztxQkFDYjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsRUFBRTthQUNaO1NBQ0YsQ0FBQztRQUVGLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUzRCxhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxFQUFFLElBQUk7WUFDWCxJQUFJLEVBQUUsbUJBQW1CO1lBQ3pCLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsb0JBQW9CLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUxRixhQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsS0FBSyxFQUFFLElBQUk7WUFDWCxJQUFJLEVBQUUsZUFBZTtZQUNyQixjQUFjLEVBQUU7Z0JBQ2QsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNULGtCQUFrQixFQUFFLElBQUk7YUFDekI7U0FDRixDQUFDLENBQUM7SUFFTCxDQUFDLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIn0=