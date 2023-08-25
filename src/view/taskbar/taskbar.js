const { get, $, $path } = require("../../mixin");
const { shell } = require("electron");
const fileIcon = require("extract-file-icon");
const fs = require("fs");

const container = $("div");

fs.readdir($path("/lnk"), (e, files) => {
	files.forEach(item => {
		//每一个文件的路径
		const filepath = $path(`/lnk/${item}`);
		//读取出来图标的buffer
		const icon = fileIcon(filepath, 48);
		//图标的base64
		const base64 = icon.toString("base64");
		//拼接base64
		const src = "data:image/png;base64," + base64;
		//创建img标签
		const img = document.createElement("img");
		img.src = src;
		img.draggable = false;
		img.title = item.split(".")[0];
		img.addEventListener("click", () => {
			shell.openPath(filepath);
		});
		container.appendChild(img);
	});
});

container.style.backgroundColor = get("taskbar", "bg");
