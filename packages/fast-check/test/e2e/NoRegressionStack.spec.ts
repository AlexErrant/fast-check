import fc from '../../src/fast-check';
import { runWithSanitizedStack } from './__test-helpers__/StackSanitizer';

const settings = { seed: 42, verbose: 0 };

describe(`NoRegressionStack`, () => {
  it('return false', () => {
    expect(
      runWithSanitizedStack(() =>
        fc.assert(
          fc.property(fc.nat(), fc.nat(), (a, b) => {
            return a >= b;
          }),
          settings,
        ),
      ),
    ).toThrowErrorMatchingSnapshot();
  });

  it('return false (with cause)', () => {
    expect(
      runWithSanitizedStack(() =>
        fc.assert(
          fc.property(fc.nat(), fc.nat(), (a, b) => {
            return a >= b;
          }),
          { ...settings, errorWithCause: true },
        ),
      ),
    ).toThrowErrorMatchingSnapshot();
  });
  it('throw', () => {
    expect(
      runWithSanitizedStack(() =>
        fc.assert(
          fc.property(fc.nat(), fc.nat(), (a, b) => {
            if (a < b) {
              throw new Error('a must be >= b');
            }
          }),
          settings,
        ),
      ),
    ).toThrowErrorMatchingSnapshot();
  });

  it('throw (with cause)', () => {
    expect(
      runWithSanitizedStack(() =>
        fc.assert(
          fc.property(fc.nat(), fc.nat(), (a, b) => {
            if (a < b) {
              throw new Error('a must be >= b');
            }
          }),
          { ...settings, errorWithCause: true },
        ),
      ),
    ).toThrowErrorMatchingSnapshot();
  });

  it('not a function', () => {
    expect(
      runWithSanitizedStack(() =>
        fc.assert(
          fc.property(fc.nat(), (v) => {
            (v as any)();
          }),
          settings,
        ),
      ),
    ).toThrowErrorMatchingSnapshot();
  });

  it('not a function (with cause)', () => {
    expect(
      runWithSanitizedStack(() =>
        fc.assert(
          fc.property(fc.nat(), (v) => {
            (v as any)();
          }),
          { ...settings, errorWithCause: true },
        ),
      ),
    ).toThrowErrorMatchingSnapshot();
  });
});
