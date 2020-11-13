const fs = require('fs');
const crypto = require('crypto');

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
        records.push(attrs)
        
        await this.writeAll(records)
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
    }

    generateRandomId(n = 4){
        return crypto.randomBytes(n).toString('hex')
    }
}

const repo = new userRepository('users.json');
repo.createUser({email: "asfasdfas", password: "holabb"});
repo.getAll()