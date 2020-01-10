"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validators_1 = require("../../bin/lib/validators");
describe('Validators', function () {
    const validators = new validators_1.BuiltInValidators();
    it('should validate strings', function () {
        chai_1.expect(validators.STRING('string value', true, 'correct value', 'command')).to.be.undefined;
        let validationError = null;
        try {
            validators.STRING(true, false, 'incorrect value', 'command');
        }
        catch (error) {
            validationError = error;
        }
        chai_1.expect(validationError).to.not.equal(null);
        chai_1.expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be string.');
    });
    it('should validate numbers', function () {
        chai_1.expect(validators.NUMBER(1000, false, 'correct value', 'command')).to.equal(1000);
        chai_1.expect(validators.NUMBER('2000', true, 'castable string', 'comman d')).to.equal(2000);
        let validationError = null;
        try {
            validators.NUMBER('80s', true, 'incorrect value', 'command');
        }
        catch (error) {
            validationError = error;
        }
        chai_1.expect(validationError).to.not.equal(null);
        chai_1.expect(validationError.message).to.equal('Invalid value for argument incorrect value!\n   Value must be a number.');
    });
    it('should validate booleans', function () {
        chai_1.expect(validators.BOOLEAN(false, true, 'correct value', 'command')).to.equal(false);
        chai_1.expect(validators.BOOLEAN('true', false, 'castable boolean', 'command')).to.equal(true);
        let validationError = null;
        try {
            validators.BOOLEAN(0, false, 'incorrect value', 'command');
        }
        catch (error) {
            validationError = error;
        }
        chai_1.expect(validationError).to.not.equal(null);
        chai_1.expect(validationError.message).to.equal('Invalid value for option incorrect value!\n   Value must be boolean.');
    });
    it('should validate file paths', function () {
        let validationError = null;
        try {
            validationError = null;
            validators.FILE_PATH('package.json', true, 'file', 'command');
        }
        catch (error) {
            validationError = error;
        }
        chai_1.expect(validationError).to.be.null;
        try {
            validationError = null;
            validators.FILE_PATH('this-file-should-not-exist.json', true, 'file', 'command');
        }
        catch (error) {
            validationError = error;
        }
        chai_1.expect(validationError).not.to.be.null;
        chai_1.expect(validationError.message).to.equal(`Invalid file path for argument file!\n   File doesn't exist.`);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5zcGVjLmpzIiwic291cmNlUm9vdCI6InNyYy8iLCJzb3VyY2VzIjpbInZhbGlkYXRvcnMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUE4QjtBQUM5Qix5REFBNkQ7QUFFN0QsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUVyQixNQUFNLFVBQVUsR0FBRyxJQUFJLDhCQUFpQixFQUFFLENBQUM7SUFFM0MsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1FBRTVCLGFBQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFFNUYsSUFBSSxlQUFlLEdBQVUsSUFBSSxDQUFDO1FBRWxDLElBQUk7WUFFRixVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxDQUFDLENBQUE7U0FFN0Q7UUFDRCxPQUFPLEtBQUssRUFBRTtZQUVaLGVBQWUsR0FBRyxLQUFLLENBQUM7U0FFekI7UUFFRCxhQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsYUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLHFFQUFxRSxDQUFDLENBQUM7SUFFbEgsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7UUFFNUIsYUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xGLGFBQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJ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