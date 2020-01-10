"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const argumental_1 = require("../../bin/lib/argumental");
const validators_1 = require("../../bin/lib/validators");
describe('Argumental App', function () {
    const app = new argumental_1.ArgumentalApp();
    const validators = new validators_1.BuiltInValidators();
    it('should define app correctly', function () {
        let lastActionFlag = [];
        app
            .version('1.0.0')
            .global
            .argument('[global_argument]', 'A global argument')
            .option('-l --log [level]', 'Enables logging', false, /^verbose$|^info$|^warn$|^error$/i, 'info')
            .action(() => {
            lastActionFlag.push('global_first');
        })
            .command('script new', 'Uploads a new script')
            .alias('newScript')
            .alias('sn')
            .argument('<script_type>', 'Script type', /^scraper$|^processor$|^validator$|^reporter$|^deployer$/i)
            .argument('<file_path>', 'Relative path to the script file', validators.FILE_PATH)
            .option('--override-name -o <script_name>', 'Overrides the script name')
            .option('--overwrite -O', 'Overwrites any scripts with the same type and name', true)
            .option('-c --clean [force]', 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)', false, validators.BOOLEAN)
            .action(() => {
            lastActionFlag.push('direct_first');
        })
            .action(() => {
            lastActionFlag.push('direct_second');
        })
            .global
            .action(() => {
            lastActionFlag.push('global_second');
        });
        const commands = app._commands;
        const newScriptCommand = commands['script new'];
        chai_1.expect(commands.hasOwnProperty('script new')).to.be.true;
        chai_1.expect(newScriptCommand.name).to.equal('script new');
        chai_1.expect(newScriptCommand.description).to.equal('Uploads a new script');
        chai_1.expect(newScriptCommand.aliases).to.deep.equal(['newScript', 'sn']);
        chai_1.expect(newScriptCommand.actions.length).to.equal(4);
        chai_1.expect(newScriptCommand.arguments).to.deep.equal([
            {
                name: 'global_argument',
                apiName: 'globalArgument',
                description: 'A global argument',
                required: false,
                validators: [],
                default: undefined
            },
            {
                name: 'script_type',
                apiName: 'scriptType',
                description: 'Script type',
                required: true,
                validators: [/^scraper$|^processor$|^validator$|^reporter$|^deployer$/i],
                default: undefined
            },
            {
                name: 'file_path',
                apiName: 'filePath',
                description: 'Relative path to the script file',
                required: true,
                validators: [validators.FILE_PATH],
                default: undefined
            }
        ]);
        chai_1.expect(newScriptCommand.options).to.deep.equal([
            {
                shortName: 'l',
                longName: 'log',
                apiName: 'log',
                description: 'Enables logging',
                required: false,
                argument: {
                    name: 'level',
                    apiName: 'level',
                    required: false,
                    default: 'info',
                    validators: [/^verbose$|^info$|^warn$|^error$/i]
                }
            },
            {
                shortName: 'o',
                longName: 'override-name',
                apiName: 'overrideName',
                description: 'Overrides the script name',
                required: false,
                argument: {
                    name: 'script_name',
                    apiName: 'scriptName',
                    required: true,
                    default: undefined,
                    validators: []
                }
            },
            {
                shortName: 'O',
                longName: 'overwrite',
                apiName: 'overwrite',
                description: 'Overwrites any scripts with the same type and name',
                required: true,
                argument: null
            },
            {
                shortName: 'c',
                longName: 'clean',
                apiName: 'clean',
                description: 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)',
                required: false,
                argument: {
                    name: 'force',
                    apiName: 'force',
                    required: false,
                    default: undefined,
                    validators: [validators.BOOLEAN]
                }
            }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJndW1lbnRhbC5zcGVjLmpzIiwic291cmNlUm9vdCI6InNyYy8iLCJzb3VyY2VzIjpbImFyZ3VtZW50YWwuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5Qix5REFBeUQ7QUFDekQseURBQTZEO0FBRTdELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUV6QixNQUFNLEdBQUcsR0FBRyxJQUFJLDBCQUFhLEVBQUUsQ0FBQztJQUNoQyxNQUFNLFVBQVUsR0FBRyxJQUFJLDhCQUFpQixFQUFFLENBQUM7SUFFM0MsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBRWhDLElBQUksY0FBYyxHQUFhLEVBQUUsQ0FBQztRQUVsQyxHQUFHO2FBQ0YsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUNoQixNQUFNO2FBQ04sUUFBUSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDO2FBQ2xELE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxDQUFDO2FBQ2hHLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFFWCxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXRDLENBQUMsQ0FBQzthQUNELE9BQU8sQ0FBQyxZQUFZLEVBQUUsc0JBQXNCLENBQUM7YUFDN0MsS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDO2FBQ1gsUUFBUSxDQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsMERBQTBELENBQUM7YUFDcEcsUUFBUSxDQUFDLGFBQWEsRUFBRSxrQ0FBa0MsRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDO2FBQ2pGLE1BQU0sQ0FBQyxrQ0FBa0MsRUFBRSwyQkFBMkIsQ0FBQzthQUN2RSxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsb0RBQW9ELEVBQUUsSUFBSSxDQUFDO2FBQ3BGLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSw2RkFBNkYsRUFBRSxLQUFLLEVB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