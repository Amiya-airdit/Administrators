namespace Administrator;

entity Users {
    name                              : String;
    email                             : String;
    phone                             : String;
    // departments                       : Association to many Departments
    // on departments.ID = $self.departments.ID;
    isDeleted                         : Boolean;
    adminType                         : Integer;
    // privilege                        : Privilege;
    imageurl                          : String;
    isUserLocatorActive               : Boolean;
    selectedGroupList                 : array of String;
    isUserUpdatePermissionActive      : Boolean;
    admingroup                        : String;
    assignedLayers                    : array of String;
    zone                              : String;
    vender                            : String;
    adminlist                         : array of String;
    createdBy                         : String;
    createdByMailID                   : String;
    isFirstLogin                      : Boolean;
    deviceDetails                     : array of String;
    lastLoggedInTime                  : DateTime;
    username                          : String;
    type                              : Integer;
    password                          : String;
    doj                               : DateTime;
    dob                               : DateTime;
    createdDateTime                   : DateTime;
    accountLockedOn                   : DateTime;
    numberOfAttemptsWithWrongPassword : Integer;
    isAccountLocked                   : Boolean;
}
