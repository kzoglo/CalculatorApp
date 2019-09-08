export default function equation(arr) {
	let result = 0;

	for(let i = 0; i < arr.length; i++){
		if(Number(arr[i])){
			result += Number(arr[i]);
		} else if(arr[i] === '+') {
			result += Number(arr[i + 1]);
			i++;
		} else if(arr[i] === '-'){
			result -= Number(arr[i + 1]);
			i++;
		} else if(arr[i] === '/'){
			result /= Number(arr[i + 1]);
			i++;
		} else if(arr[i] === '*'){
			result *= Number(arr[i + 1]);
			i++;
		}
	}
	return result = (String.prototype.split.call(result,'.').length > 1
			? Number(result.toFixed(2))
			: result);
}













