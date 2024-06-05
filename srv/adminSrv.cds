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
            status          : String;
            type            : Integer     //this is for 1,7,10 users

    }

    entity userTypes {
        key name : String;
            type : Integer;
    }

    entity deptName {
        key name : String;
    }
}
