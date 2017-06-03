// Definition of the tweets collection

import { Mongo } from 'meteor/mongo';

// Main Collections
export const Tweets = new Mongo.Collection('tweets');
export const Keywords = new Mongo.Collection('keywords');

// Auxiliary Collections
export const Tag_Map = new Mongo.Collection('tag_map');
export const TagSentiment_Map = new Mongo.Collection('tagSentiment_map');
export const Location_Map = new Mongo.Collection('location_map');
export const Token_Map = new Mongo.Collection('token_map');
export const Language_Map = new Mongo.Collection('language_map');
export const Date_Map = new Mongo.Collection('date_map');
