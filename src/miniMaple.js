class Term {
  constructor(coef, symbol = null, degree = 0) {
    this.coef = coef;
    this.symbol = symbol;
    this.degree = degree;
  }

  isZero() {
    return this.coef === 0;
  }

  derivative(variable) {
    if (this.symbol === variable && this.degree > 0) {
      const newDegree = this.degree - 1;
      if (newDegree === 0) {
        return new Term(this.coef * this.degree, null, 0);
      }
      return new Term(this.coef * this.degree, this.symbol, newDegree);
    }
    return new Term(0, null, 0);
  }

  multiply(other) {
    if (this.isZero() || other.isZero()) return new Term(0, null, 0);

    let coef = this.coef * other.coef;
    let symbol = null;
    let degree = 0;

    if (this.symbol && other.symbol) {
      if (this.symbol !== other.symbol) {
        throw new Error(
          `Multiplication of different variables is not supported: ${this.symbol} * ${other.symbol}`
        );
      }
      symbol = this.symbol;
      degree = this.degree + other.degree;
    } else if (this.symbol) {
      symbol = this.symbol;
      degree = this.degree;
    } else if (other.symbol) {
      symbol = other.symbol;
      degree = other.degree;
    }

    return new Term(coef, symbol, degree);
  }

  negate() {
    return new Term(-this.coef, this.symbol, this.degree);
  }

  toString() {
    if (this.coef === 0) return '0';

    const absCoef = Math.abs(this.coef);
    let str = '';

    if (this.symbol) {
      if (absCoef !== 1 || this.degree === 0) {
        str += absCoef;
        if (this.degree > 0) str += '*';
      }
      str += this.symbol;
      if (this.degree > 1) {
        str += '^' + this.degree;
      }
    } else {
      str += absCoef;
    }

    return this.coef < 0 ? '-' + str : str;
  }
}



function addTerms(poly, term) {
  if (term.isZero()) return;
  for (let t of poly) {
    if (t.symbol === term.symbol && t.degree === term.degree) {
      t.coef += term.coef;
      return;
    }
  }
  poly.push(term);
}

function add(poly1, poly2) {
  const result = poly1.map(t => new Term(t.coef, t.symbol, t.degree));
  for (let term of poly2) {
    addTerms(result, new Term(term.coef, term.symbol, term.degree));
  }
  return result.filter(t => !t.isZero());
}

function sub(poly1, poly2) {
  const negated = poly2.map(t => t.negate());
  return add(poly1, negated);
}

function mul(poly1, poly2) {
  const result = [];
  for (let t1 of poly1) {
    for (let t2 of poly2) {
      const prod = t1.multiply(t2);
      addTerms(result, prod);
    }
  }
  return result.filter(t => !t.isZero());
}

function powPoly(poly, exp) {
  if (!Number.isInteger(exp) || exp < 0) {
    throw new Error('Exponent must be a non-negative integer');
  }
  let result = [new Term(1, null, 0)];
  for (let i = 0; i < exp; i++) {
    result = mul(result, poly);
  }
  return result;
}

function negatePoly(poly) {
  return poly.map(t => t.negate());
}



class Tokenizer {
  constructor(input) {
    this.input = input;
    this.pos = 0;
  }

  peek() {
    this.skipWhitespace();
    if (this.pos >= this.input.length) return null;
    return this.input[this.pos];
  }

  next() {
    this.skipWhitespace();
    if (this.pos >= this.input.length) return null;

    const ch = this.input[this.pos];

    if (this.isDigit(ch)) {
      let num = '';
      while (this.pos < this.input.length && this.isDigit(this.input[this.pos])) {
        num += this.input[this.pos++];
      }
      return { type: 'num', value: parseInt(num, 10) };
    }

    if (this.isLetter(ch)) {
      let name = '';
      while (this.pos < this.input.length && this.isLetter(this.input[this.pos])) {
        name += this.input[this.pos++];
      }
      return { type: 'var', value: name };
    }

    if ('+-*^()'.includes(ch)) {
      this.pos++;
      return { type: 'op', value: ch };
    }

    throw new Error(`Unexpected character: ${ch}`);
  }

  skipWhitespace() {
    while (this.pos < this.input.length && this.isWhitespace(this.input[this.pos])) {
      this.pos++;
    }
  }

  isDigit(ch) {
    return ch >= '0' && ch <= '9';
  }

  isLetter(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  isWhitespace(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
  }
}


class Parser {
  constructor(input, variable) {
    this.tok = new Tokenizer(input);
    this.variable = variable;
    this.current = this.tok.next();
  }

  parse() {
    if (this.current === null) throw new Error('Empty expression');
    const poly = this.parseExpr();
    if (this.current !== null) {
      throw new Error(`Unexpected token: ${JSON.stringify(this.current)}`);
    }
    return poly;
  }

  
  parseExpr() {
    let left = this.parseTerm();
    while (
      this.current &&
      this.current.type === 'op' &&
      (this.current.value === '+' || this.current.value === '-')
    ) {
      const op = this.current.value;
      this.advance();
      const right = this.parseTerm();
      left = op === '+' ? add(left, right) : sub(left, right);
    }
    return left;
  }


  parseTerm() {
    let left = this.parseUnary();
    while (this.current && this.current.type === 'op' && this.current.value === '*') {
      this.advance();
      const right = this.parseUnary();
      left = mul(left, right);
    }
    return left;
  }

  
  parseUnary() {
    if (this.current && this.current.type === 'op' && this.current.value === '-') {
      this.advance();
      return negatePoly(this.parseUnary());
    }
    if (this.current && this.current.type === 'op' && this.current.value === '+') {
      this.advance();
      return this.parseUnary();
    }
    return this.parsePower();
  }

  
  parsePower() {
    let left = this.parsePrimary();
    if (this.current && this.current.type === 'op' && this.current.value === '^') {
      this.advance();
      const right = this.parseUnary();
      if (right.length !== 1 || right[0].symbol !== null || right[0].degree !== 0) {
        throw new Error('Exponent must be a constant integer');
      }
      const exp = right[0].coef;
      left = powPoly(left, exp);
    }
    return left;
  }

 
  parsePrimary() {
    if (this.current === null) throw new Error('Unexpected end of expression');

    if (this.current.type === 'num') {
      const v = this.current.value;
      this.advance();
      return [new Term(v, null, 0)];
    }

    if (this.current.type === 'var') {
      const name = this.current.value;
      this.advance();
      return [new Term(1, name, 1)];
    }

    if (this.current.type === 'op' && this.current.value === '(') {
      this.advance();
      const inner = this.parseExpr();
      if (!(this.current && this.current.type === 'op' && this.current.value === ')')) {
        throw new Error('Expected closing parenthesis');
      }
      this.advance();
      return inner;
    }

    throw new Error(`Unexpected token: ${JSON.stringify(this.current)}`);
  }

  advance() {
    this.current = this.tok.next();
  }
}



class MiniMaple {
  diff(expression, variable) {
    if (typeof expression !== 'string' || typeof variable !== 'string') {
      throw new Error('Expression and variable must be strings');
    }

    for (let i = 0; i < expression.length; i++) {
      const ch = expression[i];
      if (!this.isAllowedChar(ch)) {
        throw new Error(`Unsupported character in expression: ${ch}`);
      }
    }

    if (variable.length === 0) {
      throw new Error('Variable name cannot be empty');
    }
    for (let i = 0; i < variable.length; i++) {
      const ch = variable[i];
      if (!this.isLetter(ch)) {
        throw new Error(`Invalid variable name: ${variable}`);
      }
    }

    const parser = new Parser(expression, variable);
    const poly = parser.parse();

    const derivPoly = poly
      .map(term => term.derivative(variable))
      .filter(t => !t.isZero());

    const combined = [];
    for (let term of derivPoly) {
      addTerms(combined, term);
    }

    combined.sort((a, b) => b.degree - a.degree);

    if (combined.length === 0) return '0';

    let result = '';
    for (let i = 0; i < combined.length; i++) {
      const term = combined[i];
      const termStr = term.toString();
      if (i === 0) {
        result += termStr;
      } else {
        if (term.coef >= 0) {
          result += ' + ' + termStr;
        } else {
          result += ' - ' + termStr.substring(1);
        }
      }
    }
    return result;
  }

  isAllowedChar(ch) {
    return (
      this.isDigit(ch) ||
      this.isLetter(ch) ||
      '+-*^()'.includes(ch) ||
      this.isWhitespace(ch)
    );
  }

  isDigit(ch) {
    return ch >= '0' && ch <= '9';
  }

  isLetter(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  isWhitespace(ch) {
    return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
  }
}

export { MiniMaple };
