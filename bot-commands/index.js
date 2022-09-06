const fs = require('fs');
const path = require('path');
const files = new Object;

fs.readdirSync(__dirname).filter((item) => {
	if (path.basename(item).split('.').slice(0, -1).join('.') !== path.basename(__filename).split('.').slice(0, -1).join('.')) {
		if (fs.statSync(path.join(__dirname, item)).isDirectory()) {
			Object.assign(files, { [path.basename(item)]: require(path.join(__dirname, item)) });
		} else {
			return (item.slice(-3).match(/\.(js|ts)/));
		}
	}
}).forEach((file, index) => {
	var file_name = [path.basename(file).split('.').slice(0, -1).join('.')];
	var file_path = require(path.join(__dirname, file));
	Object.assign(files, { [file_name]: file_path });
});

module.exports = files;
