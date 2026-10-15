import { MiniMaple } from '../src/MiniMaple.js';

describe('MiniMaple.diff', () => {
  let maple;

  beforeEach(() => {
    maple = new MiniMaple();
  });

  

  test('4*x^3 по x => 12*x^2', () => {
    expect(maple.diff('4*x^3', 'x')).toBe('12*x^2');
  });

  test('4*x^3 по y => 0', () => {
    expect(maple.diff('4*x^3', 'y')).toBe('0');
  });

  test('4*x^3-x^2 по x => 12*x^2 - 2*x', () => {
    expect(maple.diff('4*x^3-x^2', 'x')).toBe('12*x^2 - 2*x');
  });

  test('4*x^3 - x^2 по x (с пробелами) => 12*x^2 - 2*x', () => {
    expect(maple.diff('4*x^3 - x^2', 'x')).toBe('12*x^2 - 2*x');
  });

 

  test('константа => 0', () => {
    expect(maple.diff('5', 'x')).toBe('0');
  });

  test('x по x => 1', () => {
    expect(maple.diff('x', 'x')).toBe('1');
  });

  test('x по y => 0', () => {
    expect(maple.diff('x', 'y')).toBe('0');
  });

  test('y по y => 1', () => {
    expect(maple.diff('y', 'y')).toBe('1');
  });

  test('-x по x => -1', () => {
    expect(maple.diff('-x', 'x')).toBe('-1');
  });

  test('+x по x => 1', () => {
    expect(maple.diff('+x', 'x')).toBe('1');
  });



  test('x^2 по x => 2*x', () => {
    expect(maple.diff('x^2', 'x')).toBe('2*x');
  });

  test('x^3 по x => 3*x^2', () => {
    expect(maple.diff('x^3', 'x')).toBe('3*x^2');
  });

  test('x^1 по x => 1', () => {
    expect(maple.diff('x^1', 'x')).toBe('1');
  });

  test('x^0 по x => 0', () => {
    expect(maple.diff('x^0', 'x')).toBe('0');
  });

  test('5*x^4 по x => 20*x^3', () => {
    expect(maple.diff('5*x^4', 'x')).toBe('20*x^3');
  });

  test('y^5 по y => 5*y^4', () => {
    expect(maple.diff('y^5', 'y')).toBe('5*y^4');
  });

  

  test('x + 1 по x => 1', () => {
    expect(maple.diff('x + 1', 'x')).toBe('1');
  });

  test('x^2 + x по x => 2*x + 1', () => {
    expect(maple.diff('x^2 + x', 'x')).toBe('2*x + 1');
  });

  test('2*x^2 + 3*x + 1 по x => 4*x + 3', () => {
    expect(maple.diff('2*x^2 + 3*x + 1', 'x')).toBe('4*x + 3');
  });

  test('3*x^2 - 2*x + 5 по x => 6*x - 2', () => {
    expect(maple.diff('3*x^2 - 2*x + 5', 'x')).toBe('6*x - 2');
  });

  test('x^3 - x^2 - x по x => 3*x^2 - 2*x - 1', () => {
    expect(maple.diff('x^3 - x^2 - x', 'x')).toBe('3*x^2 - 2*x - 1');
  });

 

  test('(x+1)^2 по x => 2*x + 2', () => {
    expect(maple.diff('(x+1)^2', 'x')).toBe('2*x + 2');
  });

  test('(x+1)^3 по x => 3*x^2 + 6*x + 3', () => {
    expect(maple.diff('(x+1)^3', 'x')).toBe('3*x^2 + 6*x + 3');
  });

  test('(x^2 + x)^2 по x => 4*x^3 + 6*x^2 + 2*x', () => {
    expect(maple.diff('(x^2 + x)^2', 'x')).toBe('4*x^3 + 6*x^2 + 2*x');
  });

  test('(2*x)^2 по x => 8*x', () => {
    expect(maple.diff('(2*x)^2', 'x')).toBe('8*x');
  });

  

  test('x + x по x => 2', () => {
    expect(maple.diff('x + x', 'x')).toBe('2');
  });

  test('x^2 + x^2 по x => 4*x', () => {
    expect(maple.diff('x^2 + x^2', 'x')).toBe('4*x');
  });

  test('x - x по x => 0', () => {
    expect(maple.diff('x - x', 'x')).toBe('0');
  });

  test('x^2 + x - x^2 по x => 1', () => {
    expect(maple.diff('x^2 + x - x^2', 'x')).toBe('1');
  });

  

  test('пробелы игнорируются', () => {
    expect(maple.diff('  4 * x ^ 3  ', 'x')).toBe('12*x^2');
  });

  test('табы и перевод строки игнорируются', () => {
    expect(maple.diff('\t4*x^3\n', 'x')).toBe('12*x^2');
  });

  

  test('переменная foo', () => {
    expect(maple.diff('foo^2', 'foo')).toBe('2*foo');
  });

  test('разные многосимвольные переменные', () => {
    expect(maple.diff('bar^3', 'foo')).toBe('0');
  });

  

  test('ошибка при нестроковом выражении', () => {
    expect(() => maple.diff(123, 'x')).toThrow();
  });

  test('ошибка при нестроковой переменной', () => {
    expect(() => maple.diff('x', 123)).toThrow();
  });

  test('ошибка при пустом имени переменной', () => {
    expect(() => maple.diff('x', '')).toThrow();
  });

  test('ошибка при переменной с цифрой', () => {
    expect(() => maple.diff('x', 'x1')).toThrow();
  });

  test('ошибка при недопустимом символе', () => {
    expect(() => maple.diff('x/y', 'x')).toThrow();
  });

  test('ошибка при знаке /', () => {
    expect(() => maple.diff('1/x', 'x')).toThrow();
  });

  test('ошибка при sin(x)', () => {
    expect(() => maple.diff('sin(x)', 'x')).toThrow();
  });

  test('ошибка при пустом выражении', () => {
    expect(() => maple.diff('', 'x')).toThrow();
  });

  test('ошибка при незакрытой скобке', () => {
    expect(() => maple.diff('(x+1', 'x')).toThrow();
  });

  test('ошибка при лишней закрывающей скобке', () => {
    expect(() => maple.diff('x+1)', 'x')).toThrow();
  });

  test('ошибка при нецелой степени', () => {
    expect(() => maple.diff('x^y', 'x')).toThrow();
  });

  test('ошибка при отрицательной степени', () => {
    expect(() => maple.diff('x^-2', 'x')).toThrow();
  });

  test('ошибка при умножении разных переменных в основании степени', () => {
    expect(() => maple.diff('(x*y)^2', 'x')).toThrow();
  });

  

  test('первый член отрицательный => -2*x', () => {
    expect(maple.diff('-x^2', 'x')).toBe('-2*x');
  });

  test('результат 0 при взятии производной по отсутствующей переменной', () => {
    expect(maple.diff('x^5 + x^3 + 1', 'y')).toBe('0');
  });
});
