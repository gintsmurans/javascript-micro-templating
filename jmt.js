// Simple JavaScript Templating
// Gints Murans, https://github.com/gintsmurans/jmt
// John Resig - http://ejohn.org/ - MIT Licensed

export default class Jmt {
    constructor(str, ES6 = false) {
        if (('cache' in Jmt) === false) {
            Jmt.cache = {};
        }

        if (/\W/.test(str)) {
            this.templateStr = str;
        } else {
            this.templateStr = document.getElementById(str).innerHTML;
        }

        if (ES6) { // Lets wait for IE 11 support drop
            // eslint-disable-next-line no-new-func
            this.fn = new Function(
                'templateData',
                `var p=[],print=function(){p.push.apply(p,arguments);};

                // Introduce the data as local variables using with(){}
                with(templateData){
                    // Convert the template into pure JavaScript
                    p.push(\`${this.templateStr
                        .split('<%')
                            .join('\t')
                        .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                        .replace(/\t=(.*?)%>/g, '${$1}')
                        .split('\t')
                            .join('`);')
                        .split('%>')
                            .join('p.push(`')
                        .split('\r')
                            .join('\\`')}\`);
                }
                return p.join('');`
            );
        } else {
            // eslint-disable-next-line no-new-func
            this.fn = new Function(
                'templateData',
                `var p=[],print=function(){p.push.apply(p,arguments);};

                // Introduce the data as local variables using with(){}
                with(templateData){
                    // Convert the template into pure JavaScript
                    p.push('${this.templateStr
                        .replace(/[\r\t\n]/g, " ")
                        .split('<%')
                            .join('\t')
                        .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                        .replace(/\t=(.*?)%>/g, '\',$1,\'')
                        .split('\t')
                            .join('\');')
                        .split('%>')
                            .join('p.push(\'')
                        .split('\r')
                            .join('\\\'')}');
                }
                return p.join('');`
            );
        }
    }

    html(data) {
        const templateData = (data == null ? {} : data);
        return this.fn(templateData);
    }
}
