const { ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

exports.$path = filepath => path.join(__dirname + filepath);

const config_path = this.$path("/config.json")

const obj = JSON.parse(fs.readFileSync(config_path));

function deepProxy(target, handler) {
	// 遍历 target 对象的所有属性
	for (let prop in target) {
		// 获取属性值
		let value = target[prop];
		// 判断属性值是否是一个对象
		if (typeof value === "object" && value !== null) {
			// 如果是，递归调用 deepProxy 函数，并传递相同的 handler 对象
			target[prop] = deepProxy(value, handler);
		}
	}
	// 返回一个 proxy 对象
	return new Proxy(target, handler);
}
//响应式
const config = deepProxy(obj, {
	get(target, prop) {
		return Reflect.get(target, prop);
	},
	set(target, prop, value) {
		const result = Reflect.set(target, prop, value);
		if (result) fs.writeFileSync(config_path, JSON.stringify(obj));
		if (prop != "position") ipcRenderer.send("render", target.id, prop, value);
		return result;
	},
});

exports.set = (browser, attr, value) => {
	config[browser][attr] = value;
};

exports.get = (browser, attr) => config[browser][attr];

exports.$ = El => document.querySelector(El);
exports.$all = El => document.querySelectorAll(El);
