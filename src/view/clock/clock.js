const { get, $ } = require("../../mixin");

const time = $("#time");
const day = $("#day");
const month = $("#month");

setInterval(() => {
	const date = new Date();
	const month_name = ["January", "February", "March ", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	//小时
	let hour = date.getHours();
	//分钟
	let min = date.getMinutes();

	if (hour < 10) {
		hour = "0" + hour;
	}
	if (min < 10) {
		min = "0" + min;
	}
	time.innerHTML = hour + ":" + min;
	day.innerHTML = date.getDate();
	month.innerHTML = month_name[date.getMonth()];
}, 1000);

$("div").style.backgroundColor = get("clock", "bg");
$("div").style.color = get("clock", "color");
time.style.fontSize = get("clock", "size") + "px";
$("article").style.fontSize = (get("clock", "size") / 5) * 2 + "px";
