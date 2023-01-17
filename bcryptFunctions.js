const bcrypt = require("bcrypt");
const saltRounds = 10;
// const myPlaintextPassword = "leseligpassord";
// const someOtherPlaintextPassword = "not_bacon";

// const hash1 = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// const hash2 = bcrypt.hashSync(myPlaintextPassword, saltRounds);
// const incorrectHash = bcrypt.hashSync("somethingElse", saltRounds);

// console.log(hash1);
// console.log(hash2);
// console.log(incorrectHash);

// console.log(bcrypt.compareSync(myPlaintextPassword, hash1));
// console.log(bcrypt.compareSync(myPlaintextPassword, hash2));

// console.log(bcrypt.compareSync(myPlaintextPassword, incorrectHash));
// console.log(bcrypt.compareSync("somethingElse", hash1));
// console.log(bcrypt.compareSync("somethingElse", incorrectHash));

const hashSomething = (plainPassword) => {
  let hashedSomething = bcrypt.hashSync(plainPassword, saltRounds);
  return hashedSomething;
};

const comparehash = (plainPassword, hash) => {
  let comparedHash = bcrypt.compareSync(plainPassword, hash);
  return comparedHash;
};

module.exports = { hashSomething, comparehash };
// module.exports = { hashSomething };
