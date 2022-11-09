import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

const { Schema } = mongoose;

const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: {type: String, required: true}, 
    email: {type: String, required: true},
    password: {type: String, unique: true, required: true}
});

const StorageSchema = new Schema({
    // user: ,
    name: String,
    type: String,
    items: [Object]
});

const DisplaySchema = new Schema({
    /*cards: [Card],
    //storages: // references to storages
    accessories: [Accessory]*/
});
/*
function Card(name, game, set, rarity, condition, price, language, note, img = null) {
    this.name = name;
    this.game = game;
    this.set = set;
    this.rarity = rarity;
    this.condition = condition;
    this.price = price;
    this.language = language;
    this.note = note;
    this.img = img;
    this.id = IDCount; IDCount++; // IDCount is user var which increases each time a card, bulk, or accessory is created
}
function Bulk(name, game, size, language, note) {
    this.name = name;
    this.game = game;
    this.size = size;
    this.language = language;
    this.note = note;
    this.id = IDCount; IDCount++; // IDCount is user var which increases each time a card, bulk, or accessory is created
}
function Accessory(name, type, brand, note) {
    this.name = name;
    this.type = type;
    this.brand = brand;
    this.note = note;
    this.id = IDCount; IDCount++; // IDCount is user var which increases each time a card, bulk, or accessory is created
}*/

DisplaySchema.plugin(mongooseSlugPlugin, {tmpl: '<%=name%>'});

mongoose.model('User', UserSchema);
mongoose.model('Storage', StorageSchema);
mongoose.model('Display', DisplaySchema);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/YOUR_DATABASE_NAME_HERE';
}

mongoose.connect(dbconf);