sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/airdit/agpp/administrator/admin/test/integration/FirstJourney',
		'com/airdit/agpp/administrator/admin/test/integration/pages/administratorsList',
		'com/airdit/agpp/administrator/admin/test/integration/pages/administratorsObjectPage'
    ],
    function(JourneyRunner, opaJourney, administratorsList, administratorsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/airdit/agpp/administrator/admin') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheadministratorsList: administratorsList,
					onTheadministratorsObjectPage: administratorsObjectPage
                }
            },
            opaJourney.run
        );
    }
);