const randomStr = () => require("crypto").randomBytes(32).toString("hex");
console.log(randomStr());
