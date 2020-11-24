const {randomBytes, scrypt} = require('crypto');
const util = require('util');

const Repository = require('./repository');

const scryptPromise = util.promisify(scrypt)

class userRepository extends Repository{

    async createUser(attrs){
        attrs.id = this.generateRandomId();
        const records = await this.getAll()

        const salt =  randomBytes(8).toString('hex');
        const hashedBuff = await scryptPromise(attrs.password, salt, 64);
        const hashed = hashedBuff.toString('hex');

        const record = {
            ...attrs,
            password: `${hashed}.${salt}`
        }

        records.push(record)
        await this.writeAll(records)
    
        return record;
    }

    async comparePasswords(saved, supplied){
        const [hash, salt] = saved.split('.');
        const suppliedBuf = await scryptPromise(supplied, salt, 64);

        return hash === suppliedBuf.toString('hex') 
    }
}

module.exports = new userRepository('users.json')