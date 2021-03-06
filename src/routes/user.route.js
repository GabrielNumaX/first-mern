const { Router} = require('express');
const router = Router();
const jwtAuth = require('../middleware/jwtAuth');

const {
    getUser,
    // getUser,
    checkUser, 
    postUser, 
    postUserValidate, 
    putUser, 
    deleteUser,
    // postUserNote,
    // getUserNotes,
    changePassword,
} = require('../controllers/user.controller');

router.get('/', jwtAuth, getUser);

router.post('/', checkUser);

router.post('/login', postUserValidate);

router.post('/signup', postUser);

router.put('/password', jwtAuth, changePassword);

//IMPORTANTE
//con el token NO es necesario para el :id por url
// router.get('/', jwtAuth, getUser);
router.put('/', jwtAuth, putUser);
router.delete('/', jwtAuth, deleteUser);


// router.post('/note', jwtAuth, postUserNote);
// router.get('/note', jwtAuth, getUserNotes);

module.exports = router;