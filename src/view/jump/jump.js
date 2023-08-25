const { $all, get } = require("../../mixin");

const article = $all("article");

setInterval(() => {
	article.forEach(item => {
		item.style.height = Math.random() * 50 + 8 + "px";
	});
}, 200);
