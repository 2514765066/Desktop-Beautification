const { app, Tray, ipcMain, Menu, screen } = require("electron");
const useMain = require("./src/view/main");
const useTaskbar = require("./src/view/taskbar");
const useClock = require("./src/view/clock");
const useJump = require("./src/view/jump");
const { set } = require("./src/mixin");
const path = require("path");

let main;
let clock;
let taskbar;
let jump;

app.setLoginItemSettings({
	openAtLogin: true,
});

app.on("ready", () => {
	main = useMain();
	taskbar = useTaskbar();
	clock = useClock();
	jump = useJump();
	const tray = new Tray(path.join(__dirname + "./ico.png"));
	const trayInfo = Menu.buildFromTemplate([
		{
			label: "退出",
			click() {
				app.quit();
			},
		},
	]);

	tray.setToolTip("桌面美化插件");
	tray.setContextMenu(trayInfo);
	tray.on("click", () => {
		main.show();
	});
});

ipcMain.on("render", (e, id, attr, value) => {
	//时钟
	if (id == "clock" && attr == "status") {
		value == "隐藏" ? clock.hide() : clock.show();
	} else if (id == "clock" && attr == "static") {
		value == "不固定" ? clock.setMovable(true) : clock.setMovable(false);
	} else if (id == "clock" && attr == "color") {
		const code = `document.querySelector("div").style.color = '${value}'`;
		clock.webContents.executeJavaScript(code);
	} else if (id == "clock" && attr == "size") {
		const code = `
		document.querySelector("#time").style.fontSize = '${value}px';
		document.querySelector("article").style.fontSize = '${(value / 5) * 2}px';		
		`;
		clock.webContents.executeJavaScript(code);
		clock.setResizable(true);
		clock.setSize(value * 3, value * 1.8);
		clock.setResizable(false);
	} else if (id == "clock" && attr == "bg") {
		const code = `document.querySelector("div").style.backgroundColor = '${value}'`;
		clock.webContents.executeJavaScript(code);
	}

	//任务栏
	if (id == "taskbar" && attr == "status") {
		value == "隐藏" ? taskbar.hide() : taskbar.show();
	} else if (id == "taskbar" && attr == "static") {
		value == "不固定" ? taskbar.setMovable(true) : taskbar.setMovable(false);
	} else if (id == "taskbar" && attr == "center") {
		//获取屏幕宽度
		const { width } = screen.getPrimaryDisplay().workAreaSize;
		taskbar.setPosition(Math.round((width - taskbar.getSize()[0]) / 2), taskbar.getPosition()[1]);
		set("taskbar", "position", {
			x: Math.round((width - taskbar.getSize()[0]) / 2),
			y: taskbar.getPosition()[1],
		});
	} else if (id == "taskbar" && attr == "bg") {
		const code = `document.querySelector("div").style.backgroundColor = '${value}'`;
		taskbar.webContents.executeJavaScript(code);
	}

	//音频跳动
	if (id == "jump" && attr == "status") {
		value == "隐藏" ? jump.hide() : jump.show();
	} else if (id == "jump" && attr == "static") {
		value == "不固定" ? jump.setMovable(true) : jump.setMovable(false);
	}
});
