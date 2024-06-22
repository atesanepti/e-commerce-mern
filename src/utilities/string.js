

const slugfy = (string)=>{
    if(typeof string === "string"){
        let str = string.trim().toLocaleLowerCase();
       
        const regex = /[ ]/g;
        while(regex.test(str)){
            str = str.replace(regex,"-")

        }
        return str;
    }
    else {
        console.log("dev error : only string can be slugfy");
        return "hello-word"
    }
}

const lastName = (fullName)=>{
    if(!fullName || typeof fullName !== "string")return "";
    const nameSegments = fullName.split(" ");
    const lastName = nameSegments[nameSegments.length - 1];
    return lastName
}


module.exports = {
    slugfy,
    lastName
}