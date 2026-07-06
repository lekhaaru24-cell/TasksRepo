/* let and const are block scoped,they can't be accessed outside blocks of
the same function whereas var can access outside the block but inside same function */


(function (){
if(true){
    let a=10;
    var b=20;
    const c=a+b;
}
// console.log(a);
console.log(b);
// console.log(c);

})();

//output--> a and c not defined
const data=function(){
for(var i=0;i<3;i++){ // var shares one variable
    setTimeout(()=>{
        console.log(i);
    },1000);
}

for(let i=0;i<3;i++){ //let creates a new variable
    setTimeout(()=>{
        console.log(i);
    },1000);


}
}
data();