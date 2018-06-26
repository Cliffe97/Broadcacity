'use strict';
const mongoose = require( 'mongoose' );

var onePost = mongoose.Schema( {
  type: String,
  code: String
} );

module.exports = mongoose.model( 'SinglePost', onePost );
