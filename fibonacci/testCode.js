function runBenchmark(fibFunction, number, loop) {
  console.log('Running benchmark...');
  fibFunction(number); // warm-up
  var startTime = performance.now();
  for (var i = 0; i < loop; i++) {
    fibFunction(number);
  }
  var endTime = performance.now();
  return ((endTime - startTime) / loop).toFixed(4);
}

function runBenchmarks() {
  var num = 0x28;
  var loop = 10;

  document.getElementById('js-time').innerText = 'Running...';
  document.getElementById('wasm-time').innerText = 'Running...';
  document.getElementById('comparison').innerText = 'Running...';

  const jsTime = runBenchmark(jsFibonacci, num, loop);
  document.getElementById('js-time').innerText = jsTime;

  const wasmTime = runBenchmark(wasmFibonacci, num, loop);
  document.getElementById('wasm-time').innerText = wasmTime;

  const comparison = (jsTime / wasmTime).toFixed(4);
  document.getElementById('comparison').innerText = comparison;
}