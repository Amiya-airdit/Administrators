service adminService {

    entity administrators {
        key username        : String;
            name            : String; //this is firstname;
            createdDateTime : String;
            lastname        : String;
            email           : String;
            phone           : String;
            adminType       : String;
            departments     : String; //account   this is array of object
            status          : String

    }

    entity userTypes {
        key name : String;
    }

    entity deptName {
        key name : String;
    }
}
