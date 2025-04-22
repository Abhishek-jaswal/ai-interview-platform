let array = [1,2,3,4,5,6];
let reversedArray = array.reverse();
console.log(reversedArray);

//*Find the Maximum eelemeny;
let arra = [1,5,9,7,5,6,2,4,8,7];
let max = Math.max(...arra);
console.log(max);

//remove duplicates
let aar1 = [1,5,7,4,2,3,6,4];
let arr1 = [1,2,3,4,5,678,4];
let unique = [...new Set(arr1,aar1)];
console.log(unique);

// check palindrom 
function isPalindrome(str){
    let reversed = str.split('').reverse().join();
    return str === reversed
;}
console.log(isPalindrome('yes'));

function isPalindrom(str) {
    return str === str.split("").reverse().join("");
  }
  console.log(isPalindrom("madam")); // true
  

  //reverse string
  let  naam = "abhishek";
  let reversedString = naam.split("").reverse().join("");
  console.log(reversedString);

  //DSA part 3
  // recursion means when any sunction cALL ITSELF
  function factorial(n){
    if(n===0){
        return  1;

    }
    return n* factorial(n-1);

  }
  console.log(factorial(5));


//Fabonacci series
function fibonacci(n){
    if(n<=1){
        return n;
    }
    return fibonacci(n-1)+ fibonacci(n-2);
    }
console.log(fibonacci(7));