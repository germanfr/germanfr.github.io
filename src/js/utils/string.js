
export function reverse(string) {
	let reversedString = "";
	let stringLength = string.length - 1;
	for (let i = stringLength; i >= 0; i--) {
		reversedString += string[i];
	}
	return reversedString;
}
