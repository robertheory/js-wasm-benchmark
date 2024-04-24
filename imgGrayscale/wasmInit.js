(async function () {

  console.log('Loading wasm module');

  Module.onRuntimeInitialized = async () => {

    window.wasmGrayscale = Module.cwrap('wasmGrayscale', 'number', ['number']);

    console.debug('Wasm module is ready');

  }

})();