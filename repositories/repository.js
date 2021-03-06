const fs = require('fs');
const { randomBytes } = require('crypto');

class Repository {
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

    async create(attrs){
        attrs.id = this.generateRandomId();
        const records = await this.getAll()

        records.push(attrs)
        await this.writeAll(records)
    
        return attrs;
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

module.exports = Repository