import { describe, it, expect } from '@jest/globals'
import {dateParser} from './date-parser';

describe('Date Parser', () => {
  it('consumes dates', async () => {
    const input = ['2nd Jun 2021', '5th Oct 1953', '31st May 2940'];
    const output = ['2021-06-02', '1953-10-05', '2940-05-31'];
    expect(dateParser(input)).toEqual(output);
  });
});
