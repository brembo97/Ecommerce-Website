const fs = require('fs');
const {randomBytes, scrypt} = require('crypto');
const util = require('util');
const scryptPromise = util.promisify(scrypt)

class userRepository{
    constructor(filename){
        
        if(!filename){
            throw new Error('No filename specified')
        }
        this.filename = filename;
        
        try{
            fs.accessSync(this.filename);
        }catch(e){
            fs.writeFileSync(this.filename, '[]')
        }
        
    }

    async getAll(){
        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }))
    }

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

    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
    }

    generateRandomId(n = 4){
        return randomBytes(n).toString('hex')
    }

    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id)
    }

    async getOneBy(attrs){
        const records = await this.getAll();
        
        for(let record of records){
            let found = true;
            
            for(let key in attrs){
                if(record[key] !== attrs[key]){
                    found = false;
                }
            }

            if(found === true){
                return record;
            }
        }
    }

    async update(id, attrs){
        const records = await this.getAll();
        let record = records.find(record => record.id === id)

        if(!record){
            throw new Error("A record with that id does not exist.")
        }else{
            Object.assign(record, attrs)
            await this.writeAll(records);
        }
    }

    async delete(id){
        const records = await this.getAll();
        await this.writeAll(records.filter(record => record.id !== id))
    }
}

module.exports = new userRepository('users.json')