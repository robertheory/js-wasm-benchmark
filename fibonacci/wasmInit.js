(async function () {

  console.log('Loading wasm module');

  Module.onRuntimeInitialized = async () => {

    // Import the function from the wasm module
    // make it available in the global scope

    window.wasmFibonacci = Module.cwrap('wasmFibonacci', 'number', ['number']);

    console.debug('Wasm module is ready');

  }

})();