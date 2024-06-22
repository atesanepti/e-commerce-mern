//External Dependencies
const {rateLimit }= require("express-rate-limit");


const routerLimiter = (time,limit)=>{
    const limiter = rateLimit({
      windowMs: time * 600 * 1000, //time
      limit,
    
    });
    return limiter;
}


module.exports = routerLimiter;