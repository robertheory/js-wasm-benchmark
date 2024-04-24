function jsImageGrayscale(data, width, height) {
  for (var i = 0, il = width * height; i < il; i++) {
    var r = data[i * 4 + 0];
    var g = data[i * 4 + 1];
    var b = data[i * 4 + 2];
    data[i * 4 + 0] = data[i * 4 + 1] = data[i * 4 + 2] =
      (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0;
  }
}

// let module;

// fetch('./wasm-grayscale.wasm')
//   .then(response => response.arrayBuffer())
//   .then(bytes => WebAssembly.instantiate(bytes))
//   .then(results => {
//     module = results.instance.exports;
//     // Now you can call wsImageGrayscale
//   });

setTimeout(() => {

  const image = document.getElementById('duck');
  const width = image.width;
  const height = image.height;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  const jsCanvas = document.getElementById('js_canvas');
  jsCanvas.width = width;
  jsCanvas.height = height;
  const jsContext = canvas.getContext('2d');
  jsContext.drawImage(image, 0, 0);
  const jsImageData = jsContext.getImageData(0, 0, width, height);

  const wsCanvas = document.getElementById('ws_canvas');
  wsCanvas.width = width;
  wsCanvas.height = height;
  const wsContext = canvas.getContext('2d');
  wsContext.drawImage(image, 0, 0);
  const wsImageData = wsContext.getImageData(0, 0, width, height);

  var array0 = imageData.data;
  var array1 = jsImageData.data;
  var array2 = wsImageData.data;

  jsImageGrayscale(array1, width, height);
  jsContext.putImageData(jsImageData, 0, 0);

  wasmGrayscale(array2, width, height);
  wsContext.putImageData(wsImageData, 0, 0);

  function run(func, array, width, height, loop) {
    func(array, array.length); // warm-up
    var elapsedTime = 0.0;
    for (var i = 0; i < loop; i++) {
      var startTime = performance.now();
      func(array, width, height);
      var endTime = performance.now();
      elapsedTime += (endTime - startTime);
    }
    return (elapsedTime / loop).toFixed(4);
  }

  document.getElementById('js-time').innerText = 'Running...';
  document.getElementById('wasm-time').innerText = 'Running...';
  document.getElementById('comparison').innerText = 'Running...';

  const jsTime = run(jsImageGrayscale, array1, width, height, 10);

  document.getElementById('js-time').innerText = jsTime;

  const wasmTime = run(wasmGrayscale, array2, width, height, 10);

  document.getElementById('wasm-time').innerText = wasmTime;

  const comparison = (jsTime / wasmTime).toFixed(4);

  document.getElementById('comparison').innerText = comparison;

}, 500)