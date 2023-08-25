const { BrowserWindow } = require("electron");
const { get,set, $path } = require("../../mixin");

const useJump = () => {
	const jump = new BrowserWindow({
		frame: false,
		transparent: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
		height: 58,
		width: 170,
	});
	jump.setSkipTaskbar(true);
	jump.loadFile($path("/view/jump/jump.html"));
	jump.setResizable(false); //不可以缩放

	get("jump", "status") == "隐藏" ? jump.hide() : jump.show();
	get("jump", "static") == "不固定" ? jump.setMovable(true) : jump.setMovable(false);
	const position = get("jump", "position");
	jump.setPosition(position.x, position.y);

	jump.on("moved", () => {
		set("jump", "position", {
			x: jump.getPosition()[0],
			y: jump.getPosition()[1],
		});
	});

	jump.on("close", () => {
		jump = null;
	});
	return jump;
};

module.exports = useJump;
