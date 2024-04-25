function jsImageGrayscale(data, width, height) {
  for (var i = 0, il = width * height; i < il; i++) {
    var r = data[i * 4 + 0];
    var g = data[i * 4 + 1];
    var b = data[i * 4 + 2];
    data[i * 4 + 0] = data[i * 4 + 1] = data[i * 4 + 2] =
      (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0;
  }
}

console.log('Loading wasm module');

let wsImageGrayscale;

Module.onRuntimeInitialized = () => {

  wsImageGrayscale = Module.cwrap('wasmGrayscale', null, ['number', 'number', 'number']);
  console.log('wsImageGrayscale', wsImageGrayscale)

  console.debug('Wasm module is ready');

  document.getElementById('runButton').disabled = false;

}

const runTests = () => {

  document.getElementById('runButton').disabled = true;
  console.log('Running...');

  const image = document.getElementById('duck');
  const width = image.width;
  const height = image.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, width, height)

  const jsCanvas = document.getElementById('js_canvas');
  jsCanvas.width = width;
  jsCanvas.height = height;
  const jsContext = jsCanvas.getContext('2d');
  const jsImageData = jsContext.getImageData(0, 0, width, height);

  const wsCanvas = document.getElementById('ws_canvas');
  wsCanvas.width = width;
  wsCanvas.height = height;
  const wsContext = wsCanvas.getContext('2d');
  const wsImageData = wsContext.getImageData(0, 0, width, height);

  const array0 = imageData.data;
  const array1 = jsImageData.data;
  const array2 = wsImageData.data;

  function copyArray(src, res) {
    for (var i = 0, il = src.length; i < il; i++) {
      res[i] = src[i];
    }
  }

  copyArray(array0, array1);
  jsImageGrayscale(array1, width, height);
  const jsGrayImage = new ImageData(array1, width, height);
  jsContext.putImageData(jsGrayImage, 0, 0);

  copyArray(array0, array2);
  wsImageGrayscale(array2, width, height);
  const wsGrayImage = new ImageData(array2, width, height);
  wsContext.putImageData(wsGrayImage, 0, 0);

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

  const jsTime = run(jsImageGrayscale, array1, width, height, 10);

  document.getElementById('js-time').innerText = jsTime;

  const wasmTime = run(wsImageGrayscale, array2, width, height, 10);

  document.getElementById('wasm-time').innerText = wasmTime;

  const comparison = (jsTime / wasmTime).toFixed(4);

  document.getElementById('comparison').innerText = comparison;

  document.getElementById('runButton').disabled = false;

  document.getElementById("results").style.display = "flex";
}


// Module.onRuntimeInitialized = () => {

//   const wsImageGrayscale = Module.cwrap('wasmGrayscale', null, ['number', 'number', 'number']);

//   console.debug('Wasm module is ready');

//   const image = document.getElementById('duck');
//   const width = image.width;
//   const height = image.height;

//   const canvas = document.createElement('canvas');
//   canvas.width = width;
//   canvas.height = height;
//   const context = canvas.getContext('2d');
//   context.drawImage(image, 0, 0);
//   const imageData = context.getImageData(0, 0, width, height);

//   const jsCanvas = document.getElementById('js_canvas');
//   jsCanvas.width = width;
//   jsCanvas.height = height;
//   const jsContext = jsCanvas.getContext('2d');
//   const jsImageData = jsContext.getImageData(0, 0, width, height);

//   const wsCanvas = document.getElementById('ws_canvas');
//   wsCanvas.width = width;
//   wsCanvas.height = height;
//   const wsContext = wsCanvas.getContext('2d');
//   const wsImageData = wsContext.getImageData(0, 0, width, height);

//   const array0 = imageData.data;
//   const array1 = jsImageData.data;
//   const array2 = wsImageData.data;

//   function copyArray(src, res) {
//     for (var i = 0, il = src.length; i < il; i++) {
//       res[i] = src[i];
//     }
//   }

//   copyArray(array0, array1);
//   copyArray(array0, array2);
//   jsImageGrayscale(array1, width, height);
//   wsImageGrayscale(array2, width, height);

//   const jsGrayImage = new ImageData(array1, width, height);
//   const wsGrayImage = new ImageData(array2, width, height);
//   console.log('wsGrayImage', wsGrayImage)

//   jsContext.putImageData(jsGrayImage, 0, 0);
//   wsContext.putImageData(wsGrayImage, 0, 0);

//   function run(func, array, width, height, loop) {
//     func(array, array.length); // warm-up
//     var elapsedTime = 0.0;
//     for (var i = 0; i < loop; i++) {
//       var startTime = performance.now();
//       func(array, width, height);
//       var endTime = performance.now();
//       elapsedTime += (endTime - startTime);
//     }
//     return (elapsedTime / loop).toFixed(4);
//   }

//   document.getElementById('js-time').innerText = 'Running...';
//   document.getElementById('wasm-time').innerText = 'Running...';
//   document.getElementById('comparison').innerText = 'Running...';

//   const jsTime = run(jsImageGrayscale, array1, width, height, 10);

//   document.getElementById('js-time').innerText = jsTime;

//   const wasmTime = run(wsImageGrayscale, array2, width, height, 10);


//   document.getElementById('wasm-time').innerText = wasmTime;

//   const comparison = (jsTime / wasmTime).toFixed(4);

//   document.getElementById('comparison').innerText = comparison;

// }
