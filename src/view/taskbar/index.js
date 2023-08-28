const { BrowserWindow, ipcMain, screen } = require("electron");
const fs = require("fs");
const { get, set, $path } = require("../../mixin");

let taskbar;

const useTaskbar = () => {
	taskbar = new BrowserWindow({
		frame: false,
		transparent: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	taskbar.setSkipTaskbar(true);
	taskbar.loadFile($path("/view/taskbar/taskbar.html"));

	//初始化数据
	get("taskbar", "status") == "隐藏" ? taskbar.hide() : taskbar.show(); //隐藏/显示
	get("taskbar", "static") == "不固定" ? taskbar.setMovable(true) : taskbar.setMovable(false); //固定/不固定
	const file_count = fs.readdirSync($path("/lnk")).length; //文件夹中的内容
	taskbar.setSize(file_count * 80, 80); //设置长宽
	taskbar.setResizable(false); //禁止伸缩
	const position = get("taskbar", "position"); //得到位置
	taskbar.setPosition(position.x, position.y); //设置位置

	//监听moved
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

const center = () => {
	//屏幕宽度
	const { width } = screen.getPrimaryDisplay().workAreaSize;
	taskbar.setPosition(Math.round((width - taskbar.getSize()[0]) / 2), taskbar.getPosition()[1]);
	set("taskbar", "position", {
		x: Math.round((width - taskbar.getSize()[0]) / 2),
		y: taskbar.getPosition()[1],
	});
};
ipcMain.on("center", center);

//监听lnk中的内容改变
fs.watch($path("/lnk"), () => {
	taskbar.reload();
	const file_count = fs.readdirSync($path("/lnk")).length;
	taskbar.setResizable(true);
	taskbar.setSize(file_count * 80, 80);
	taskbar.setResizable(false);
	center();
});

module.exports = useTaskbar;
