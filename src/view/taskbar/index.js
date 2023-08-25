const { BrowserWindow } = require("electron");
const fs = require("fs");
const { get, set,$path } = require("../../mixin");

const useTaskbar = () => {
	const taskbar = new BrowserWindow({
		frame: false,
		transparent: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		minHeight: 80,
		maxHeight: 80,
	});
	taskbar.setSkipTaskbar(true);
	taskbar.loadFile($path("/view/taskbar/taskbar.html"));
	taskbar.setMovable(true); //可以移动

	get("taskbar", "status") == "隐藏" ? taskbar.hide() : taskbar.show();
	get("taskbar", "static") == "不固定" ? taskbar.setMovable(true) : taskbar.setMovable(false);	
	const file_count = fs.readdirSync($path("/lnk")).length;
	taskbar.setSize(file_count * 80, 80);

	const position = get("taskbar", "position");
	taskbar.setPosition(position.x, position.y);
	taskbar.on("moved", () => {
		set("taskbar", "position", {
			x: taskbar.getPosition()[0],
			y: taskbar.getPosition()[1],
		});
	});

	taskbar.on("close", () => {
		taskbar = null;
	});

	return taskbar;
};

module.exports = useTaskbar;
