const securePassword = require('secure-password');

const pwd = new securePassword();

exports.hashedPassword = async(plainPassword) => {
    try {
        const hashedBuffer = await pwd.hash(Buffer.from(plainPassword));
        return hashedBuffer.toString('base64');
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
}


exports.verifyPassword = async(storedHash, inputPassword) => {
    try {

        // agr input value hi nhi mila to 
        if (!storedHash || !inputPassword) {
            console.error("error in password verification", { storedHash, inputPassword });
            return false;
        }

        const hashedBuffer = Buffer.from(storedHash, 'base64');
        const result = await pwd.verify(Buffer.from(inputPassword), hashedBuffer);

        if (result === securePassword.VALID_NEEDS_REHASH) {
            console.warn("Password is valid but needs rehashing");
        }

        return result === securePassword.VALID || result === securePassword.VALID_NEEDS_REHASH; // boolena value return krega direct

    } catch (e) {
        console.log("verifyPassword catch:", e);
        throw new Error("Password verification failed");
    }
}