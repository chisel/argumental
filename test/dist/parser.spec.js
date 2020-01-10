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
            argument: null
        });
        chai_1.expect(parser.parseOption('-p --port', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: 'port',
            apiName: 'port',
            description: 'desc',
            required: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('-P --portNumber', 'desc', false)).to.deep.equal({
            shortName: 'P',
            longName: 'portNumber',
            apiName: 'portNumber',
            description: 'desc',
            required: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('-p [port_number]', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: null,
            apiName: null,
            description: 'desc',
            required: false,
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
            argument: null
        });
        chai_1.expect(parser.parseOption('--port-p', 'desc', false)).to.deep.equal({
            shortName: null,
            longName: 'port-p',
            apiName: 'portP',
            description: 'desc',
            required: false,
            argument: null
        });
        chai_1.expect(parser.parseOption('-p', 'desc', false)).to.deep.equal({
            shortName: 'p',
            longName: null,
            apiName: null,
            description: 'desc',
            required: false,
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLnNwZWMuanMiLCJzb3VyY2VSb290Ijoic3JjLyIsInNvdXJjZXMiOlsicGFyc2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLHlEQUE2RDtBQUU3RCxRQUFRLENBQUMsUUFBUSxFQUFFO0lBRWpCLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7SUFDNUIsTUFBTSxVQUFVLEdBQUcsSUFBSSw4QkFBaUIsRUFBRSxDQUFDO0lBRTNDLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtRQUVyQyxhQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDM0UsSUFBSSxFQUFFLFdBQVc7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQy9CLE9BQU8sRUFBRSxTQUFTO1NBQ25CLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDM0YsSUFBSSxFQUFFLFdBQVc7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQy9CLE9BQU8sRUFBRSxjQUFjO1NBQ3hCLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLHNCQUFzQixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzVF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