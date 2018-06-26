'use strict';
const SinglePost = require( '../models/SinglePost' );
console.log("loading the posts Controller")


// this displays all of the skills
exports.getAllPosts = ( req, res ) => {
  console.log('in getAllPosts')
  SinglePost.find( {} )
    .exec()
    .then( ( posts ) => {
      console.log("n getAllPosts ...")
      console.dir(posts)
      res.render( 'post', {
        posts: posts
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'post promise complete' );
    } );
};




exports.savePost = ( req, res ) => {
  console.log("in savePost!")
  //console.dir(req)
  let newPost = new SinglePost( {
    type: req.body.postType,
    code: req.body.code
  } )

  console.log("posts = "+newPost)

  newPost.save()
    .then( () => {
      res.redirect( '/post' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deletePost = (req, res) => {
  console.log("in deletePost")
  let postName = req.body.deleteName
  if (typeof(postName)=='string') {
      SinglePost.deleteOne({_id:postName})
           .exec()
           .then(()=>{res.redirect('/post')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(postName)=='object'){
      SinglePost.deleteMany({_id:{$in:postName}})
           .exec()
           .then(()=>{res.redirect('/post')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(postName)=='undefined'){
      console.log("This is if they didn't select a post")
      res.redirect('/post')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown postName: ${postName}`)
  }

};
