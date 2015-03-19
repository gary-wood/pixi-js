function RGB2Color(r,g,b) { return '0x' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b); }
function byte2Hex(n) {
	var nybHexString = "0123456789ABCDEF";
	return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

var colourList = [];
function makeColorGradient(frequency1, frequency2, frequency3, phase1, phase2, phase3, center, width, len) {
	if (center == undefined)   center = 128;
	if (width == undefined)    width = 127;
	if (len == undefined)      len = 50;

	for (var i = 0; i < len; ++i) {
		var red = Math.sin(frequency1*i + phase1) * width + center;
		var grn = Math.sin(frequency2*i + phase2) * width + center;
		var blu = Math.sin(frequency3*i + phase3) * width + center;
		
		colourList.push(RGB2Color(red,grn,blu));
	}
}
makeColorGradient(.3,.3,.3,0,2,4);