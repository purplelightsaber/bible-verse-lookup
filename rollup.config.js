import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'

export default {
    input: './client/index.js',
    name: 'Lookup',
    plugins: [
        commonjs(),
        resolve(),
        json(),
    ],
    output: { 
        file: './public/javascripts/build.js', 
        format: 'iife' 
    },
}