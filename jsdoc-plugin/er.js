

function render(diagram) {
    const str = `<div id='jflow_erdiagram' style="height: 500px;border:1px solid #EB6864;"></div>
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
    },
    handlers: {
        processingComplete({ doclets }) {
            const documented = doclets.index.documented;
            const classes = [];
            const mixins = [];
            const interfaces = [];
            let erDiagram;
            Object.keys(documented).forEach(name => {
                const doclet = documented[name][0];
                if(doclet.kind === 'class') {
                    classes.push({
                        name: doclet.name,
                        extends: doclet.augments ? doclet.augments[0] : undefined,
                        mixins: doclet.mixes,
                        implements: doclet.implements ? doclet.implements[0] : undefined,
                    })
                }

                if(doclet.kind === 'mixin') {
                    mixins.push({
                        name: doclet.name,
                        mixins: doclet.mixes,
                    })
                }
                if(doclet.kind === 'interface') {
                    interfaces.push({
                        name: doclet.name,
                    })
                }
                if(doclet._isERDiagram) {
                    erDiagram = doclet;
                }
            });

        
            const diagram = [...classes, ...mixins, ...interfaces];
            erDiagram.description = render(diagram);
            console.log(erDiagram)
        }
    }
}