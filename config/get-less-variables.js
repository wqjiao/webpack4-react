const fs = require('fs');

module.exports = function getLessVariables(file) {
    var themeContent = fs.readFileSync(file, 'utf-8');
    var variables = {};
    
    themeContent.split('\n').forEach(function(item) {
        // 判断是否为注释行
        if (item.indexOf('//') === 0 || item.indexOf('/*') === 0) {
            return
        }

        // 判断该行中是否有注释，做处理
        if (item.indexOf('//') > 0) {
            item = item.substr(0, item.indexOf('//'))
        }
        if (item.indexOf('/*') > 0) {
            item = item.substr(item.indexOf('/*'))
        }
    
        // 注释中不能出现英文冒号 : 
        var _pair = item.split(':');
        if (_pair.length < 2) return;

        var key = _pair[0].replace('\r', '').replace('@', '');
        if (!key) return;

        var value = _pair[1].replace(';', '').replace('\r', '').replace(/^\s+|\s+$/g, '');
        variables[key] = value;
    });
    
    return variables;
}
 