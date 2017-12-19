import expect from 'expect'
import { decrement } from './08';

// Best kept React secret: you can declare state changes separately from the component classes
// Declaring state updates as pure functions makes it a breeze to test complex state transitions.
// Even no need for shallow rendering!

describe('decrement', () => {
  it('should decrement by one', () => {
    expect(decrement({count: 10})).toEqual({"count": 9});
  });

  it('should not decrease less than zero', () => {
    expect(decrement({count: 0})).toEqual(undefined);
  });
});