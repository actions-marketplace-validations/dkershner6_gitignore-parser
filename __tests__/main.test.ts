import * as core from '@actions/core';
import run from '../src/main';

describe('Main', () => {
    const setOutputSpy = jest.spyOn(core, 'setOutput');
    const setFailedSpy = jest.spyOn(core, 'setFailed');

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should return gitignored with two items, no lines_not_included, and all_included true', () => {
        const inputs = {
            path: './__mocks__/normal',
            ignored_includes: 'test,test1234',
        };

        run(inputs);

        const outputCalls = setOutputSpy.mock.calls;

        expect(outputCalls[0]).toEqual(['gitignored', 'test,test1234']);
        expect(outputCalls[1]).toEqual(['lines_not_included', '']);
        expect(outputCalls[2]).toEqual(['all_included', 'true']);
        expect(setFailedSpy).not.toHaveBeenCalled();
    });

    it('Should return blank gitignored, 2 lines_not_included, and all_included false', () => {
        const inputs = {
            path: './__mocks__/blank',
            ignored_includes: 'test,test1234',
        };

        run(inputs);

        const outputCalls = setOutputSpy.mock.calls;

        expect(outputCalls[0]).toEqual(['gitignored', '']);
        expect(outputCalls[1]).toEqual(['lines_not_included', 'test,test1234']);
        expect(outputCalls[2]).toEqual(['all_included', 'false']);
        expect(setFailedSpy).toHaveBeenCalled();
    });

    it('Should return blank gitignored, 2 lines_not_included, and all_included false, but not fail', () => {
        const inputs = {
            path: './__mocks__/blank',
            ignored_includes: 'test,test1234',
            fail_if_not_found: 'false',
        };

        run(inputs);

        const outputCalls = setOutputSpy.mock.calls;

        expect(outputCalls[0]).toEqual(['gitignored', '']);
        expect(outputCalls[1]).toEqual(['lines_not_included', 'test,test1234']);
        expect(outputCalls[2]).toEqual(['all_included', 'false']);
        expect(setFailedSpy).not.toHaveBeenCalled();
    });

    it('Should error if the gitignore doesnt exist', () => {
        const inputs = {
            path: './__mocks__/NOT-HERE',
            ignored_includes: 'test,test1234',
            fail_if_not_found: 'false',
        };

        run(inputs);

        expect(setFailedSpy).toHaveBeenCalledWith(
            "ENOENT: no such file or directory, open '__mocks__/NOT-HERE/.gitignore'"
        );
    });
});