const { BrowserWindow, ipcMain } = require("electron");
const { $path } = require("../../mixin");

let main;

const useMain = () => {
	main = new BrowserWindow({
		frame: false,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		width: 350,
		height: 600,
	});
	main.setResizable(false);
	main.loadFile($path("/view/main/main.html"));
	main.on("close", () => {
		this.main = null;
	});
	return main;
};

ipcMain.on("close", () => {
	main.hide();
});

module.exports = useMain;
