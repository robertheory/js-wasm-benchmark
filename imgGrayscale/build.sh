#!/bin/bash

emcc -O3 -s EXPORTED_RUNTIME_METHODS='["cwrap"]' \
  wasm-grayscale.c \
  -Os \
  -s WASM=1 \
  -s "EXPORTED_FUNCTIONS=['_wasmGrayscale']" \
  -o wasm-grayscale.js
