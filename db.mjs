const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');

const Storage = new mongoose.Schema({
    // user: ,
    name: String,
    type: String,
    items: [Object]
});

const Display = new mongoose.Schema({
    cards: [Card],
    //storages: // references to storages
    accessories: [Accessory]
});

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
}