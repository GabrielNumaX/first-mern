const userModel = require('../models/user.model');
const notesModel = require('../models/notes.model');

//this is to PUT user password
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userController = {};

// userController.getUsers = async (req, res) => {

//     const users = await userModel.find();

//     res.json(users)
// }

userController.postUserValidate = async (req, res) => {
        
    const {email, password} = req.body;

    // const response = await userModel.find(req.body);

    // res.json(response);

    // attempt to authenticate user
    await userModel.getAuthenticated(email, password, function(err, user, reason) {
        if(err) {
            throw err;
        }

        // login was successful if we have a user
        if(user) {

            const token = user.generateAuthToken();

            res.header('x-notex-token', token).send({login: true, _id: user._id});

            return;
        }
        
        // otherwise we can determine why we failed
        const reasons = userModel.failedLogin;
        //aca estaba es ERROR
        switch (reason) {
            case reasons.NOT_FOUND:
                res.json({
                    login: false,
                    message: 'Invalid User or Password'
                });
                break;
            case reasons.PASSWORD_INCORRECT:
                res.json({ 
                    login: false, 
                    message: 'Invalid User or Password',
                    });
                // console.log('wrong password');
                break;
            case reasons.MAX_ATTEMPTS:
                res.json({
                    login: false,
                    message: 'You have reached maximum attempts, your account is locked',
                });
                break;
        }
    });
};

// userController.getUser =  async (req, res) => {

//     const id = req.user._id;

//     const user = await userModel
//                             .findById(id)
//                             .populate('notes');

//     res.json(user);
// }


userController.postUser = async (req, res) => {

    const {user, email, password} = req.body;

    const userCheck = await userModel.findOne({user: user});

    if(userCheck) {
        return res.send('User NOT available');
    }
    
    const emailCheck = await userModel.findOne({email: email})

    if(emailCheck) {
        return res.send('Email Already Registered');
    }

    const newUser = new userModel ({
        user,
        email,
        password
    });

    await newUser.save();

    res.json({
        user: 'User created'
    });
};



userController.putUser =  async (req, res) => {

    const id = req.user._id;

    const {user, email} = req.body;

    const userCheck = await userModel.findOne({user: user});

    if(userCheck) {

        return res.send('User NOT Available');

    }

    const mailCheck = await userModel.findOne({email: email});

    if(mailCheck) {

        return res.send('Email NOT Available');
    }

    if(!user && !email) {
        return res.send('No Empty Changes');
    }

    if(!user && email){
    
        const updatedUser = await userModel.findByIdAndUpdate({_id: id}, {
            email
        }, {new: true});

        res.json({
            email: updatedUser.email
        });
    }
    else if(!email && user){
    
        const updatedUser = await userModel.findByIdAndUpdate({_id: id}, {
            user
        }, {new: true});

        res.json({
            user: updatedUser.user
        });
    }
    else {
        
        const updatedUser = await userModel.findByIdAndUpdate({_id: id}, {
            user,
            email
        }, {new: true});

        res.json({
            user: updatedUser.user,
            email: updatedUser.email
        })
    }
};

userController.deleteUser = async (req, res) => {

    const id = req.user._id;

    await userModel.findByIdAndDelete(id);

    res.json({
        user: 'User Deleted'
    });

};

userController.changePassword = async (req, res) => {

    const id = req.user._id;
    let { password } = req.body;

    if(!password) {
        return res.send('Enter Password');
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)

    password = await bcrypt.hash(password, salt)

    await userModel.findByIdAndUpdate({_id: id}, {
        password: password
    });

    res.send('Password Successfully Changed');

}

// //this gives and EMBEDED REFERENCE ON USERS

// userController.postUserNote = async (req, res) => {

//     const id = req.user._id;

//     // console.log(req.body.note);

//     //creates new note
//     //esto crea new notesModel({note: req.body.note})
//     const newNote = new notesModel(req.body);
//     //get user
//     const user = await userModel.findById(id);
//     //asign reference relationship
//     newNote.author = user;
//     //save note
//     await newNote.save();
//     //add note to user
//     user.notes.push(newNote._id);
//     //save user
//     await user.save();

//     res.json({note: newNote.note, date: newNote.date});
//     // res.send('post user note');
// }

// userController.getUserNotes = async (req, res) => {

//     const id = req.user._id;

//     const user = await userModel.findById(id)
//                                 .populate('notes')
                                

//     res.json(user.notes);

// }

module.exports = userController;