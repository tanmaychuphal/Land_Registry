function validate(){
    // var input= document.getElementsByTagName("input")
    var input= document.getElementsByClassName("form-control")
    
    for(var i=0;i<input.length;i++){
        if(input[i].value==""){
        alert("fill all the fields")

     return false
    }
}

// ethereum.request({
//     method:'eth_requestAccounts'
// }).then(result=>{
//     console.log(result)
// })

alert("payment request...")
}
