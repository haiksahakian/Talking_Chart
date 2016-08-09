var talkingChartParameters = {
        // Id of the html object in which to place the hidden talking chart buttons and labels
        containerId: 'talkingChartLocation',     //optional, but if the user did not provide a containerId, it will not dynamically generate html code
        // Whether or not to play both data series one after another, or at the same time
        playVoicesConcurrently: true,            //optional, default value is true
        // Mono or stereo
        separateVoicesInStereo: true,            //optional, default value is true
        // The text label that will be read first when a browser reaches the talking chart
        announcement: 'Press play to hear the chart comparing inflation to the weather over the last ten years',   //optional, default is ""
        //minimum time to play one item
        minNoteDuration: 200,                    //optional, default value is 200
        //volume
        volume: 0.5,                             //optional, default value is 1, 0 is min, 1 is max
        //max Play Time
        maxPlayTimeInMilliseconds : 5000,        //optional, default value is 5000
        //text for the play button
        playButtonText:"play",                   //optional, default is "play"
        //debug mode: to show log in console if they got error
        debugMode: true,                         //optional, default is false
        //voice are required
        // Define data to be played as audio. At least one voice should be defined.
        voice1: {
                // Reference to the data
                data: series1Data,               //required
                // The text label to be read just before the data is played
                announcement: 'The weather',     //optional, default is ""
                playVoiceAsPulse: true,          //optional, default is false
                frequencyLow: 300,               //optional, lower bound frequency
                range: 300                       //optional, defines the frequency range. To work, frequencyLow must be defined
        },
        voice2: {
                data: series2Data,               //required
                announcement: 'The inflation rate',  //optional, default is ""
                playVoiceAsPulse: false,         //optional, default is false
                frequencyLow: 800,               //optional, lower bound frequency
                range: 300                       //optional, defines the frequency range. To work, frequencyLow must be defined
        }
};