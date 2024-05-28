// using Administrator from '../db/schema';


service adminService {

    // entity administrator as projection on Administrator.Users;

    entity administrators {
        key username        : String;
            name            : String; //this is firstname;
            createdDateTime : String;
            lastname        : String;
            email           : String;
            phone           : String;
            adminType       : String;
            account         : String;
            status          : String

    }


}
