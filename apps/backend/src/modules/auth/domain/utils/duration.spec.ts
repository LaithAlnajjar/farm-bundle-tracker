import { parseDurationToMs } from './duration';

describe('parseDurationToMs', () => {
  it('should parse seconds correctly', () => {
    expect(parseDurationToMs('10s')).toBe(10_000);
  });

  it('should parse minutes correctly', () => {
    expect(parseDurationToMs('5m')).toBe(300_000);
  });

  it('should parse hours correctly', () => {
    expect(parseDurationToMs('2h')).toBe(7_200_000);
  });

  it('should parse days correctly', () => {
    expect(parseDurationToMs('1d')).toBe(86_400_000);
  });
});
