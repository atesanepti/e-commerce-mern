
const reduceToBandwidth = (q, type)=>{
    if(type === "kb"){
        return q * 1024 
    }
    else if(type === "mb"){
        return q * 1024 *1024 
    }
    else if(type === "gb"){
        return q * 1024 * 1024 *1024 
    }
    else if(type === "tb"){
        return q * 1024 * 1024 * 1024 *1024 
    }
}

const reduceToTime = (q, type)=>{
    if(type === "m"){
        return q * 60 * 1000;
    }
    else if(type === "h"){
        return q * 60 * 60 * 1000;
    }
    else if(type === "d"){
        return q * 24 * 60 * 60 * 1000;
    }
    else{
        console.log("dev error : invalid reduce type");
        return 0
  
        
    }

}
const reduceTo = (value)=>{
    if(typeof value === "string"){
        //2mb
        const index = value.search(/[a-zA-Z]/);
        const q = +value.slice(0,index)
        const type = value.slice(index).toLocaleLowerCase();
        const bandWidth = ["kb", "mb", "gb", "tb"];
        const time = ["m", "h", "d"];
        if(bandWidth.includes(type)){
        const q = +value.slice(0,index)
            return reduceToBandwidth(q,type)
        }
        else if(time.includes(type)){
            return reduceToTime(q,type)
        }
    }
    else if(typeof value === "number"){
        return value;
    }
    else{
        return 0
    }
}


module.exports = {
    reduceTo
}