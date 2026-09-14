const validator = require('validator');

const validateSignUp = (req) => {
    const {firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Invalid name");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Create a strong password");
    }
};

const editProfileValidate = (req) => {

    const allowedToEdit = ["firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedToEdit.includes(field)
    );
    return isEditAllowed;
}

module.exports = {validateSignUp,editProfileValidate};