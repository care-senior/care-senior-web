import { getInitials } from './initials';

describe('getInitials', () => {
  it.each([
    ['Juliana Martins', 'JM'],
    ['Maria Aparecida Souza', 'MS'],
    ['  bruno   kanashiro ', 'BK'],
    ['Odete', 'O'],
    ['', ''],
  ])('%j → %j', (name, expected) => {
    expect(getInitials(name)).toBe(expected);
  });
});
