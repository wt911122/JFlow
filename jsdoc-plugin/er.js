

function render(diagram) {
    const str = `<div id='jflow_erdiagram' style="height: 500px;border:1px solid #2780E3;"></div>
    <script src="ergraphbundle.js"></script>
    <script>
        const data = ${JSON.stringify(diagram)};
        window.renderErGraph(data, "jflow_erdiagram")
    </script>`;
    return str;
}
module.exports = {
    defineTags(dictionary) {
        dictionary.defineTag('er-diagram', {
            onTagged(doclet, tag) {
                doclet._isERDiagram = true;
            },
        })

        dictionary.defineTag('groupfrom', {
            onTagged(doclet, tag) {
                doclet.groupfrom = tag.value;
            },
        })
    },
    handlers: {
        processingComplete({ doclets }) {
            const documented = doclets.index.documented;
            const classes = [];
            const mixins = [];
            const interfaces = [];
            const modules = [];
            let erDiagram;
            Object.keys(documented).forEach(name => {
                const doclet = documented[name][0];
                if(doclet.kind === 'class') {
                    console.log(doclet.name)
                    //const configs = documented[`${doclet.name}~${doclet.name}Configs`]
                    let configName;
                    if(doclet.params) {
                        const configDoclet = doclet.params.find(p => p.name === 'configs');
                        if(configDoclet) {
                            configName = configDoclet.type.names[0];
                        }
                    }
                    // if(configName) {
                        classes.push({
                            name: doclet.name,
                            extends: doclet.augments ? doclet.augments[0] : undefined,
                            mixins: doclet.mixes,
                            implements: doclet.implements ? doclet.implements[0] : undefined,
                            groupfrom: doclet.groupfrom,
                            configName,
                            kind: 'class'
                        })
                    // }
                }

                if(doclet.kind === 'module') {
                    let configName;
                    if(doclet.properties) {
                        const configDoclet = doclet.properties.find(p => p.name === 'configs');
                        configName = configDoclet.type.names[0];
                    }
                    if(configName) {
                        modules.push({
                            name: doclet.name,
                            configName,
                            kind: 'module'
                        })
                    }
                }

                if(doclet.kind === 'mixin') {
                    mixins.push({
                        name: doclet.name,
                        mixins: doclet.mixes,
                        kind: 'mixin'
                    })
                }
                if(doclet.kind === 'interface') {
                    interfaces.push({
                        name: doclet.name,
                        kind: 'interface'
                    })
                }
                if(doclet._isERDiagram) {
                    erDiagram = doclet;
                }
            });

            modules.forEach(m => {
                classes.forEach(c => {
                    if(m.name.split('-').slice(1).join('') === c.name.toLowerCase() && m.configName === c.configName) {
                        c.module = m;
                    }
                    if(m.name === 'j-group' && m.configName === c.configName){
                        c.module = m;
                    }
                });
            })
            if(erDiagram) {
                console.log(classes)
                const diagram = [...classes, ...mixins, ...interfaces];
                erDiagram.description = render(diagram);
            }
            // console.log(erDiagram)
        }
    }
}