"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const argumental_1 = require("../../bin/lib/argumental");
const validators_1 = require("../../bin/lib/validators");
describe('App', function () {
    const app = new argumental_1.ArgumentalApp();
    const validators = new validators_1.BuiltInValidators();
    it('should define app correctly', function () {
        let lastActionFlag = [];
        app
            .version('1.0.0')
            .global
            .argument('[global_argument]', 'A global argument')
            .option('-l --log [level]', 'Enables logging', false, /^verbose$|^info$|^warn$|^error$/i, true, 'info')
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
                multi: true,
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
                multi: false,
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
                multi: false,
                argument: null
            },
            {
                shortName: 'c',
                longName: 'clean',
                apiName: 'clean',
                description: 'Cleans the scripts directory (if force is true, kills any script processes before cleaning)',
                required: false,
                multi: false,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJndW1lbnRhbC5zcGVjLmpzIiwic291cmNlUm9vdCI6InNyYy8iLCJzb3VyY2VzIjpbImFyZ3VtZW50YWwuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5Qix5REFBeUQ7QUFDekQseURBQTZEO0FBRTdELFFBQVEsQ0FBQyxLQUFLLEVBQUU7SUFFZCxNQUFNLEdBQUcsR0FBRyxJQUFJLDBCQUFhLEVBQUUsQ0FBQztJQUNoQyxNQUFNLFVBQVUsR0FBRyxJQUFJLDhCQUFpQixFQUFFLENBQUM7SUFFM0MsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1FBRWhDLElBQUksY0FBYyxHQUFhLEVBQUUsQ0FBQztRQUVsQyxHQUFHO2FBQ0YsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUNoQixNQUFNO2FBQ04sUUFBUSxDQUFDLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDO2FBQ2xELE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsa0NBQWtDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQzthQUN0RyxNQUFNLENBQUMsR0FBRyxFQUFFO1lBRVgsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV0QyxDQUFDLENBQUM7YUFDRCxPQUFPLENBQUMsWUFBWSxFQUFFLHNCQUFzQixDQUFDO2FBQzdDLEtBQUssQ0FBQyxXQUFXLENBQUM7YUFDbEIsS0FBSyxDQUFDLElBQUksQ0FBQzthQUNYLFFBQVEsQ0FBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLDBEQUEwRCxDQUFDO2FBQ3BHLFFBQVEsQ0FBQyxhQUFhLEVBQUUsa0NBQWtDLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQzthQUNqRixNQUFNLENBQUMsa0NBQWtDLEVBQUUsMkJBQTJCLENBQUM7YUFDdkUsTUFBTSxDQUFDLGdCQUFnQixFQUFFLG9EQUFvRCxFQUFFLElBQUksQ0FBQzthQUNwRixNQUFNLENBQUMsb0JBQW9CLEVBQUUsNkZBQTZGLEVBQUUs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