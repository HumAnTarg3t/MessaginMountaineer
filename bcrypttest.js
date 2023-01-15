const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "leseligpassord";
const someOtherPlaintextPassword = "not_bacon";

const someHash = "$2b$10$.RHFImhuggpafsMS2G6hHeD.giHn5x/bUmES6/MlU6//0EHUIKjDa";

const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
console.log(hash);
console.log(bcrypt.compareSync(myPlaintextPassword, hash));
console.log(bcrypt.compareSync(myPlaintextPassword, someHash));
