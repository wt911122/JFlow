import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser"; // 压缩插件
// import sourcemaps from 'rollup-plugin-sourcemaps'; // sourcemaps 插件
// import visualizer from 'rollup-plugin-visualizer';  // 构建分析插件
export default [
    {
        input: 'src/index.js', // 入口文件
        output: {
            file: 'dist/jflow.es.min.js',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            resolve(),
            terser(), 
        ], 
    },
    {
        input: 'src/index.js', // 入口文件
        output: {
            exports: 'named',
            file: 'dist/jflow.min.js', // 输出文件
            format: 'umd', // 输出格式
            name: 'jflow', // 全局变量名称，用于在浏览器环境中使用.
            sourcemap: true
        },
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**' 
            }),
            terser(), 
        ], 
    },
    
];