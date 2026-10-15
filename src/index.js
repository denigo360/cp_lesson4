import { MiniMaple } from './MiniMaple.js';

document.addEventListener('DOMContentLoaded', setup);

function setup() {
  const inputText = document.getElementById('input_text');
  const inputVar = document.getElementById('input_var');
  const diffButton = document.getElementById('diffButton');
  const clearButton = document.getElementById('clearButton');
  const resText = document.getElementById('result');
  const errText = document.getElementById('error');
  const container = document.getElementById('container');

  const maple = new MiniMaple();

  function runDiff() {
    errText.innerText = '';
    try {
      const expr = inputText.value;
      const v = inputVar.value.trim();

      if (!expr.trim()) throw new Error('Введите выражение');
      if (!v) throw new Error('Введите переменную');

      const result = maple.diff(expr, v);
      resText.innerText = result;

      const log = document.createElement('div');
      log.classList.add('generated');
      log.innerText = `d/d${v} (${expr}) = ${result}`;
      container.appendChild(log);
    } catch (e) {
      resText.innerText = '—';
      errText.innerText = e.message;
    }
  }

  diffButton.addEventListener('click', runDiff);

  clearButton.addEventListener('click', () => {
    inputText.value = '';
    inputVar.value = 'x';
    resText.innerText = '—';
    errText.innerText = '';
    container.innerHTML = '';
    inputText.focus();
  });

  [inputText, inputVar].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runDiff();
      }
    });
  });
}
