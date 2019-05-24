// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: './src/index.ts',
    output: {file: './lib/browser.js', format: 'iife', name: 'linesLogger'},
    plugins: [
        typescript(),
        uglify()
    ]
}
