const { createClient } = require('@supabase/supabase-js');
var express = require('express');
var router = express.Router();
require('dotenv').config()


const service_role_key = process.env.service_role_key
const supabase_url = process.env.supabase_url
const anon_key = process.env.anon_key

const supabaseAdmin = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Access auth admin api
const adminAuthClient = supabaseAdmin.auth.admin


const supabase = createClient(supabase_url, anon_key)



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




//---------- MANAGE USERS --------------------------------
// get all
router.get('/users', async function(req, res, next) {
  try {
    const { data: { users }, error } = await adminAuthClient.listUsers()
    if(error) throw error
    res.json({users}) 
  } catch (error) {
    res.json({error})
  }
});

// user create
router.post('/user/', async function(req, res, next) {
  try {    
    const { data, error } = await adminAuthClient.createUser({
      email: 'halo1@halo.com',
      password: 'password',
      email_confirm: true
    })
    if(error) throw error
    res.json({data}) 
  } catch (error) {
    res.json({error})
  }
});

// update user
router.put('/user/:id', async function(req, res, next) {
  try {
    const { data: user, error } = await adminAuthClient.updateUserById(
      req.params.id,
      { password: req.password }
    )
    if(error) throw error
    res.json(user)
  } catch (error) {
    res.json({error})
  }
});

// delete user
router.delete('/user/:id', async function(req, res, next) {  
  try {
    const { data, error } = await adminAuthClient.deleteUser(
      req.params.id
    )
    if(error) throw error
    res.json({data})
  } catch (error) {
    res.json({error})
  }
});

// get user by id
router.get('/user/:id', async function(req, res, next) {
  try {
    const { data, error } = await adminAuthClient.getUserById(req.params.id)
    if(error) throw error
    
    res.json({data}) 
  } catch (error) {
    res.json({error})
  }
});
//-------------------------------------------


router.post('/auth/signin', async function(req, res, next) {
  try {
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: req.email,
      password: req.password,
    })
    if(error) {
      throw error
    }

    res.json({data})
  } catch (error) {
    res.json({error})
  }  
});



module.exports = router;
