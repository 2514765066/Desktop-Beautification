const { BrowserWindow } = require("electron");
const { get, set, $path } = require("../../mixin");
const path = require("path");

const useClock = () => {
	const clock = new BrowserWindow({
		frame: false,
		transparent: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	clock.setSkipTaskbar(true);
	clock.loadFile($path("/view/clock/clock.html"));

	get("clock", "status") == "隐藏" ? clock.hide() : clock.show();
	get("clock", "static") == "不固定" ? clock.setMovable(true) : clock.setMovable(false);

	const position = get("clock", "position");
	clock.setPosition(position.x, position.y);

	const size = get("clock", "size");
	clock.setSize(size * 3, size * 1.8);

	clock.setResizable(false);

	clock.on("moved", () => {
		set("clock", "position", {
			x: clock.getPosition()[0],
			y: clock.getPosition()[1],
		});
	});

	clock.on("close", () => {
		clock = null;
	});
	return clock;
};

module.exports = useClock;
