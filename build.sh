#!/bin/bash

emcc -O3 -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  wasm-fibonacci.c \
  -Os \
  -s WASM=1 \
  -s "EXPORTED_FUNCTIONS=['_wasmFibonacci']" \
  -o wasm-fibonacci.js