import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

// cjs, umd, esm
let shouldEmitDeclaration, outputFormat, outputFile;
if (process.env.MODULE_TYPE === 'cjs') {
  shouldEmitDeclaration = true;
  outputFormat = 'cjs'
  outputFile = 'lib/index.js';
} else {
  shouldEmitDeclaration = false;
  outputFormat = 'esm';
  outputFile = 'module/index.js';
}

export default {
  input: 'src/index.ts',
  output: {
    file: outputFile,
    format: outputFormat,
  },
  external: ['react'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: shouldEmitDeclaration
        },
      }
    }),
  ]
};
