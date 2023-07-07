const name = 'rollup-packagejson-version-inject-plugin'
const VIRTUAL_MODULE_ID = `\0${name}`;
const version = require('./package.json').version;
let generated = false;
export default function () {
    return {
        name,
        transform(code) {
            if(generated) {
                return code;
            }
            const t = code + `
window.$jflow_version = "${version}";
            `;
            generated = true;
            return t;
        },
    }
}