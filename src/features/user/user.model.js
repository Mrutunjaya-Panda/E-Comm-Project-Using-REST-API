
export default class UserModel{
    constructor(name, email, password, type, id){
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type; //customer or seller
        this.id = id;
    }

    static SignUp(name, email, password, type){
        const newUser = new UserModel(name, email, password, type);
        //newUser.id = users.length + 1; //generating id for new user.
        newUser.id = Date.now().toString(); //generating unique id for new user using current timestamp.
        users.push(newUser);
        return newUser;
    }

    static SignIn(email, password){
        const user = users.find((u) => u.email === email && u.password === password);
        return user;
    }
}

//some default users for testing purpose.
var users = [{
    "id": "1",
    "name": "Seller User",
    "email": "seller@ecom.com",
    "password": "Password1",
    "type": "seller",
 },
]