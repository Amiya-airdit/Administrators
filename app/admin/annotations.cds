using adminService as service from '../../srv/adminSrv';

annotate service.administrators with @(

    UI.HeaderInfo                : {

        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'User',
        TypeNamePlural: 'Users'

    },

    UI.SelectionFields           : [
        // userId,
        username,
        adminType,
        status
    ],

    UI.FieldGroup #GeneratedGroup: {

        $Type: 'UI.FieldGroupType',

        Data : [

            // {

            //     $Type: 'UI.DataField',
            //     Label: 'ID',
            //     Value: id

            // },

            {

                $Type: 'UI.DataField',
                Label: 'User Name',
                Value: username

            },

            

            

            {

                $Type: 'UI.DataField',
                Label: 'Email',
                Value: email

            },
            {

                $Type: 'UI.DataField',
                Label: 'Mobile No.',
                Value: phone

            },
            {

                $Type: 'UI.DataField',
                Label: 'Admin Type',
                Value: adminType

            },

            {

                $Type: 'UI.DataField',
                Label: 'Status',
                Value: status

            },

            // {

            //     $Type: 'UI.DataField',

            //     Label: 'User Id',

            //     Value: userId

            // },

            

        // {

        //     $Type: 'UI.DataField',

        //     Label: 'mailVerified',

        //     Value: mailVerified

        // }

        ]

    },

    UI.Facets                    : [{

        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup'

    }],

    UI.LineItem                  : [

        // {

        //     $Type: 'UI.DataField',

        //     Label: 'User ID',

        //     Value: userId

        // },

        {

            $Type: 'UI.DataField',
            Label: 'User Name',
            Value: username

        },

        {

            $Type: 'UI.DataField',
            Label: 'Email ID',
            Value: email,

        },

        {

            $Type: 'UI.DataField',
            Label: 'Mobile No.',
            Value: phone,

        },

        {

            $Type: 'UI.DataField',
            Label: 'Admin Type',
            Value: adminType,

        },

        {

            $Type      : 'UI.DataField',
            Label      : 'Account Status',
            Value      : status,
            Criticality: 3,

        },

    ]

);

annotate service.administrators with {

    username @Common.Label: 'User Name'

};

// annotate service.administrators with {

//     userId @Common.Label: 'User ID'

// };

annotate service.administrators with {

    adminType @Common.Label: 'User Category'

};

annotate service.administrators with {

    status @Common.Label: 'Status'

};



annotate service.administrators with {

    username @(

        Common.ValueList               : {

            $Type         : 'Common.ValueListType',
            CollectionPath: 'administrators',

            Parameters    : [{

                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: username,
                ValueListProperty: 'username',

            }, ],

            Label         : 'User Name',

        },

    )

};

annotate service.administrators with {

    adminType @(

        Common.ValueList               : {

            $Type         : 'Common.ValueListType',
            CollectionPath: 'administrators',

            Parameters    : [{

                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: adminType,
                ValueListProperty: 'adminType',

            }, ],

            Label         : 'User Category',

        },

        Common.ValueListWithFixedValues: true

    )

};

annotate service.administrators with {
    status @(
        Common.ValueList               : {
            $Type         : 'Common.ValueListType',
            CollectionPath: 'administrators',
            Parameters    : [{
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: status,
                ValueListProperty: 'status',
            }, ],

            Label         : 'Status',

        },

        Common.ValueListWithFixedValues: true

    )

};
