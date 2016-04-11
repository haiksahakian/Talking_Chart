/******************************************

** TalkingChart.js:                                                                                           ***

**                                           get input data as array and ***

**                                           play the audio based on the ***

**                                           input array.                                                        ***

** Author:  Di Ren,                                                                                          ***

**                                           Haik Sahakian                                                    ***

******************************************/

 

/*version 1.1:

bug: it can not run more than 5 times

only work on chrome for now*/

 

/*version 1.2: it works on both firefox and chrome, and it can run more than five times

bug: 1. after around 20 times, it does not work

                2. if you doulbe click the play button, it gose crazy*/

 

/*version 1.3: it works on safari now but still has those two bugs

bug: 1. after 22 times, it does not work

                2. if you doulbe click the play button, it gose crazy*/

 

/*version 1.4: fix bug of if you doulbe click the play button, it gose crazy

bug: 1. after 22 times, it does not work

*/

 

/*version 1.5: make demo, make one tone and tones function

bug: 1. after 22 times, it does not work

*/           

 

/*version 1.6: work with as many tones as you want.

fix bug: after 22 times, it does not work. Now it fixed but have no idea how that fixed

bug: TypeError: Value being assigned to AudioParam.value is not a finite floating-point value.

*/           

 

/*version 2.0: put everything into class

bug: TypeError: Value being assigned to AudioParam.value is not a finite floating-point value.

*/           

 

/*version 2.1: add function: pickUpDataSample, setminNoteDuration, setMaxPlayTimeInMilliseconds, set volume

solve: TypeError: Value being assigned to AudioParam.value is not a finite floating-point value. the problem is the setInterval run one more time than it should be.

*/           

 

/*version 2.2: Change lib name to "Talking chart"

add Parameter as input, change the way to use it

add null into data, and change normalization function

 TODO: deal with more than two tones, now one tone and two tones are hard coded

*/           

 

/*version 2.3: dynamical create a div or some thing which contain this object and also the play button 

 TODO: deal with more than two tones, now one tone and two tones are hard coded

*/           

 

/*version 2.4:   7/30/2014

add: debugModeOn: true,           in each voice add :frequencyLow: 300, range: 300,

change reInit function to fix cannot play more than one time problem, change order of init function to fix problem with only one tone

TODO: deal with more than two tones, now one tone and two tones are hard coded

*/           

 

/*note:

1. to make dynamical create a div work, user have to put this lib after the body tag, because it need id from a tag in the html file, so that tag has to define before this lib

 

*/

 

// Main Talking Chart class         

function TalkingChart (parameters) {

 

                // Parameters that can be set by the user

                this.announcement ="";                                                                               //announcement which is the text before the play button

                this.containerId;                                                                                              //the container id that user gives, for dynamic create html and css code

                this.debugMode= true;                                                                 //debug mode: to show log in console if they got error, default should be false, but here set it to true for first errorLog

                this.maxPlayTimeInMilliseconds = 5000;              //total play time, in ms

                this.minNoteDuration = 200;                                                      //play speed in ms

                this.playButtonText = "Play Chart";                         //text for the play button

                this.playVoicesConcurrently = true;                        //play two voice together

                this.separateVoicesInStereo = true;                       //play difference data in two ears

                this.volume = 1;                                                                                               //volume for all,

                this.condenseDataToFit = true;                                 //when it is true then use pickUpDataSample function, default is true

                this.parameters;                                                                                              // a copy of the input parameter object

                this.voice1FrequencyLowDefault = 700;                //Default value of voice 1 frequency low

                this.frequencyRangeDefault = 300;                         //Default value of frequency range

                this.voice2FrequencyLowDefault = 350;                //Default value of voice 1 frequency low

               

               

                // Private variables

                this.isPlaying;                                                                                                   //true: it is playing, false: it is not playing. to start and stop

                this.audioNode =[];                                                                        //all the audio nodes

                this.inputData =[];                                                                           //all the input data, two for now

                this.inputNormalized =[];                                                            //save normalized input

                this.maxInputLength;                                                                    //length of input data, will set the first input data's length

                this.numberOfInput;                                                     //number of input data

                this.timeIntervalNode;                                                 //for time interval, as global var

                this.pulseRequested = false;                                      // Set in init(). True when any voice has had pulsing turned on.

                this.firstTimePlay;                                                                          //is this the first time play or not, to make sure we need call reInit function or not

                this.dynamicallyCreateHtml;                                     //if containerId is defined, then it is on, if containerId is undefined, then keep this off;

                //TODO: for pro version (kidding), they can set difference voice for difference 

 

                // Create an audio context, if the browser supports it

                this.TalkingChartContext = null;

                if (window.AudioContext) this.TalkingChartContext = new AudioContext();

                if (window.webkitAudioContext) this.TalkingChartContext = new webkitAudioContext();

                if (this.TalkingChartContext == null) {

                                this.errorLog("Browser version error, please use latest version of Chrome, Firefox, or Safari.", "error");

                                return;

                }

                // Call init to initialize the library if a parameters object was passed in to the constructor

                if (parameters) {

                                this.init(parameters);

                }

}

 

//put all data as input, they should be array

TalkingChart.prototype.init= function(parameters) {

                this.parameters = parameters;

                if (!this.parameters) {

                                this.errorLog("No parameters supplied.", "error");

                }

 

                this.firstTimePlay = true;            

                if(typeof this.parameters.debugMode == "undefined"){

                                this.setdebugMode(false);

                }

                else{

                                this.setdebugMode(this.parameters.debugMode);

                }

                //no input

                if( typeof this.parameters.voice1  == "undefined" && typeof this.parameters.voice2 == "undefined"){

                                this.errorLog("input should have voice1","error");

                }

                //put voice2 only, use voice2 instead of voice 1

                else if (typeof this.parameters.voice1  == "undefined" && typeof this.parameters.voice2 != "undefined"){

                                if(typeof this.parameters.voice2.data == "undefined"){

                                                this.errorLog("Voice 2 is defined but input data is missing", "error");

                                }

                                else{

                                               

                                                //number of data

                                                this.numberOfInput = 1;   //only one data input

                                               

                                                this.audioNode[0] = new TalkingChartNode();                   //create each TalkingChartNode

                                                this.inputData[0] = this.parameters.voice2.data.slice(0);

                                                //playVoicesConcurrently, since only one voice, it does not matter, true as default

                                               

                                                //only one voice, so separateVoicesInStereo should be false

                                                this.separateVoicesInStereo = false;

                                                //set for voice 2

                                                if(typeof this.parameters.voice2.playVoiceAsPulse !="undefined"){

                                                                this.audioNode[0].setPlayVoiceAsPulse(this.parameters.voice2.playVoiceAsPulse);

                                                }

                                               

                                                this.isPlaying = false;                     //init is not playing

 

                                                //set volume

                                                if (parameters.volume)

                                                                this.volume = parameters.volume;

                                                this.setVolume(this.volume);

 

                                                //minNoteDuration

                                                if(typeof this.parameters.minNoteDuration != "undefined"){

                                                                this.setminNoteDuration(this.parameters.minNoteDuration);//minNoteDuration as 200 as default, blind people could set to 100-150, (just guess)

                                                }

 

                                                //set maxPlayTimeInMilliseconds

                                                if (typeof this.parameters.maxPlayTimeInMilliseconds != "undefined"){

                                                                if(this.parameters.maxPlayTimeInMilliseconds > 0){

                                                                                this.setMaxPlayTimeInMilliseconds(this.parameters.maxPlayTimeInMilliseconds); //5 sec as default for maxPlayTimeInMilliseconds if input is less than 0, then use default

                                                                }

                                                }

                                               

                                                //set containerId

                                                if(typeof this.parameters.containerId == "undefined"){

                                                                this.containerId = null;

                                                                //no container, so do not dynamically create html

                                                                this.dynamicallyCreateHtml = false;

                                                }

                                                else{

                                                                this.containerId= this.parameters.containerId;

                                                                this.dynamicallyCreateHtml = true;

                                                                if(typeof this.parameters.playButtonText =="undefined"){

                                                                                this.setPlayButtonText("play");                                //set play as default

                                                                }

                                                                else{

                                                                                this.setPlayButtonText(this.parameters.playButtonText);

                                                                }

                                                               

                                                }

                                               

                                                var tempData;

                                                tempData = this.inputData[0].slice(0);

                                                //must clean first and then pick up data

                                                //clean the data

                                                this.cleanData(tempData);

                                               

                                                //set condenseDataToFit

                                                if (typeof this.parameters.condenseDataToFit != "undefined"){

                                                                this.setCondenseDataToFit(this.parameters.condenseDataToFit);

                                                }

                                               

                                                var temp = this.pickUpDataSample(tempData);

                                               

                                                this.inputNormalized[0]= this.normaliztion(temp);  //normalize input data

                                               

                                                this.audioNode[0].TalkingChartContext = this.TalkingChartContext; //pass TalkingChartContext to talking chart node

                                                this.audioNode[0].nodeInit(this.inputNormalized[0]); // TalkingChartNode initialize

                                                //set frequency and range, voice 2

                                                if(typeof this.parameters.voice2.frequencyLow == "undefined" ){

                                                                if(typeof this.parameters.voice2.range == "undefined"){

                                                                                this.audioNode[0].setFrequencyRange(this.voice1FrequencyLowDefault,this.frequencyRangeDefault);                                                             //default value is this.voice1FrequencyLowDefault(700), range this.frequencyRangeDefault(300)

                                                                }

                                                                else{

                                                                                this.audioNode[0].setFrequencyRange(this.voice1FrequencyLowDefault,this.parameters.voice2.range);                                                           //frequency low undefined, range defined

                                                                }

                                                }

                                                //lower frequency set

                                                else{

                                                                if(typeof this.parameters.voice2.range == "undefined"){

                                                                                this.audioNode[0].setFrequencyRange(this.parameters.voice2.frequencyLow,this.frequencyRangeDefault);                                                   //default range is this.frequencyRangeDefault(300)

                                                                }

                                                                else{

                                                                                this.audioNode[0].setFrequencyRange(this.parameters.voice2.frequencyLow,this.parameters.voice2.range);                                                                //frequency low undefined, range defined

                                                                }

                                                }                             

                                                this.audioNode[0].setVolume(this.volume);

                                               

                                                //set name of data

                                                if (typeof this.parameters.voice2.announcement != "undefined"){

                                                                                this.audioNode[0].setDataName(this.parameters.voice2.announcement);//"" for data name as default

                                                }

                                               

                                                                                                //set pulseRequested as false first

                                                this.setPulseRequested(false); //pulseRequested default value is false

                                                for(var i=0; i< this.numberOfInput; i++){

                                                                if(this.audioNode[i].playVoiceAsPulse){

                                                                                //TODO: pulse does not work well on Chrome and Safari, so stop pulse if user use chrome or safari

                                                                                var browserVersion = window.navigator.userAgent;

                                                                                var browserVersionFirefox = browserVersion.indexOf("Firefox");

                                                                                if(browserVersionFirefox>0){

                                                                                                this.setPulseRequested(true);

                                                                                }

                                                                                else{

                                                                                                this.errorLog("for pulse feature, we only support for FireFox for now. Sorry for inconvenience.","info"); 

                                                                                }

                                                                                break;

                                                                }

                                                }

                                               

                                                //connect

                                                this.oneToneSetup();

                                               

                                               

                                }

                               

                }

                //put voice1 only

                else if (typeof this.parameters.voice1  != "undefined" && typeof this.parameters.voice2 == "undefined"){

                                if(typeof this.parameters.voice1.data == "undefined"){

                                                this.errorLog("input data is required","error");

                                }

                                else{

                                                this.audioNode[0] = new TalkingChartNode();                   //create each TalkingChartNode

                                                //number of data

                                                this.numberOfInput = 1;   //only one data input

                                                this.inputData[0] = this.parameters.voice1.data.slice(0);

                                                //playVoicesConcurrently, since only one voice, it does not matter, true as default

                                               

                                                //only one voice, so separateVoicesInStereo should be false

                                                this.separateVoicesInStereo = false;

                                                //set setPlayVoiceAsPulse(on)

                                                if(typeof this.parameters.voice1.playVoiceAsPulse !="undefined"){

                                                                this.audioNode[0].setPlayVoiceAsPulse(this.parameters.voice1.playVoiceAsPulse);

                                                }

                                                               

                                                this.isPlaying = false;                     //init is not playing

                                                //set volume

                                                if (parameters.volume)

                                                                this.volume = parameters.volume;

                                                this.setVolume(this.volume);

 

                                                //minNoteDuration

                                                if(typeof this.parameters.minNoteDuration != "undefined"){

                                                                this.setminNoteDuration(this.parameters.minNoteDuration);//minNoteDuration as 200 as default, blind people could set to 100-150, (just guess)

                                                }

                                                                                               

                                                //set maxPlayTimeInMilliseconds

                                                if (typeof this.parameters.maxPlayTimeInMilliseconds != "undefined"){

                                                                if(this.parameters.maxPlayTimeInMilliseconds > 0){

                                                                                this.setMaxPlayTimeInMilliseconds(this.parameters.maxPlayTimeInMilliseconds);//5 sec as default for maxPlayTimeInMilliseconds if input is less than 0, then use default

                                                                }

                                                }

 

                                                //set containerId

                                                if(typeof this.parameters.containerId == "undefined"){

                                                                this.containerId = null;

                                                                //no container, so do not dynamically create html

                                                                this.dynamicallyCreateHtml = false;

                                                }

                                                else{

                                                                this.containerId= this.parameters.containerId;

                                                                this.dynamicallyCreateHtml = true;

                                                                if(typeof this.parameters.playButtonText == "undefined"){

                                                                                this.setPlayButtonText("play");                                //set play as default

                                                                }

                                                                else{

                                                                                this.setPlayButtonText(this.parameters.playButtonText);

                                                                }

                                                               

                                                }                                             

                                               

                                                var tempData;

                                                tempData = this.inputData[0].slice(0);

                                                //must clean first and then pick up data

                                                //clean the data

                                                this.cleanData(tempData);

                                               

                                                //set condenseDataToFit

                                                if (typeof this.parameters.condenseDataToFit != "undefined"){

                                                                this.setCondenseDataToFit(this.parameters.condenseDataToFit);

                                                }

                                               

                                                var temp = this.pickUpDataSample(tempData);

                                                this.inputNormalized[0]= this.normaliztion(temp);  //normalize input data

                                               

                                                this.audioNode[0].TalkingChartContext = this.TalkingChartContext; //pass TalkingChartContext to talking chart node

                                                this.audioNode[0].nodeInit(this.inputNormalized[0]); // TalkingChartNode initialize

                                                //set frequency and range, voice 1

                                                if(typeof this.parameters.voice1.frequencyLow == "undefined" ){

                                                                if(typeof this.parameters.voice1.range == "undefined"){

                                                                                this.audioNode[0].setFrequencyRange(this.voice1FrequencyLowDefault,this.frequencyRangeDefault);                                                             //default value is this.voice1FrequencyLowDefault(700), range this.frequencyRangeDefault(300)

                                                                }

                                                                else{

                                                                                this.audioNode[0].setFrequencyRange(this.voice1FrequencyLowDefault,this.parameters.voice1.range);                                                           //frequency low undefined, range defined

                                                                }

                                                }

                                                //lower frequency set

                                                else{

                                                                if(typeof this.parameters.voice1.range == "undefined"){

                                                                                this.audioNode[0].setFrequencyRange(this.parameters.voice1.frequencyLow,this.frequencyRangeDefault);                                                   //default range is this.frequencyRangeDefault(300)

                                                                }

                                                                else{

                                                                                this.audioNode[0].setFrequencyRange(this.parameters.voice1.frequencyLow,this.parameters.voice1.range);                                                                //frequency low undefined, range defined

                                                                }

                                                }                             

                                                this.audioNode[0].setVolume(this.volume);

                                               

                                                //set name(announcement) of data

                                                if (typeof this.parameters.voice1.announcement != "undefined"){

                                                                this.audioNode[0].setDataName(this.parameters.voice1.announcement); //"" for data announcement as default

                                                }

                                                                                               

                                                //set pulseRequested as false first

                                                this.setPulseRequested(false); //pulseRequested default value is false

                                                for(var i=0; i< this.numberOfInput; i++){

                                                                if(this.audioNode[i].playVoiceAsPulse){

                                                                                //TODO: pulse does not work well on Chrome and Safari, so stop pulse if user use chrome or safari

                                                                                var browserVersion = window.navigator.userAgent;

                                                                                var browserVersionFirefox = browserVersion.indexOf("Firefox");

                                                                                if(browserVersionFirefox>0){

                                                                                                this.setPulseRequested(true);

                                                                                }

                                                                                else{

                                                                                                this.errorLog("for pulse feature, we only support for FireFox for now. Sorry for inconvenience.","info"); 

                                                                                }

                                                                                break;

                                                                }

                                                }

                                                //connect

                                                this.oneToneSetup();

                                                                                               

                                }

                }

                //have two input

                else if (typeof this.parameters.voice1  != "undefined" && typeof this.parameters.voice2 != "undefined"){

                                if(typeof this.parameters.voice1.data == "undefined" || typeof this.parameters.voice2.data == "undefined"){

                                                this.errorLog("input data is required","error");

                                }

                                else{

                                                //minNoteDuration

                                                if(typeof this.parameters.minNoteDuration != "undefined"){

                                                                this.setminNoteDuration(this.parameters.minNoteDuration);//minNoteDuration as 200 as default, blind people could set to 100-150, (just guess)

                                                }

                                                                                               

                                                //playVoicesConcurrently

                                                if(typeof this.parameters.playVoicesConcurrently != "undefined"){

                                                                this.playVoicesConcurrently = this.parameters.playVoicesConcurrently;//set playVoicesConcurrently to true as default

                                                }

                                               

                                                //separateVoicesInStereo play difference data in difference ears

                                                if(typeof this.parameters.separateVoicesInStereo != "undefined"){

                                                                this.separateVoicesInStereo = this.parameters.separateVoicesInStereo;//set separateVoicesInStereo to true as default

                                                }

                                                this.inputData[0] = this.parameters.voice1.data.slice(0);

                                                this.inputData[1] = this.parameters.voice2.data.slice(0);

                                               

                                                this.maxInputLength = Math.max(this.inputData[0].length,this.inputData[1].length);

                                               

                                                this.isPlaying = false;                     //init is not playing

                                               

                                                //set volume

                                                if (parameters.volume)

                                                                this.volume = parameters.volume;

                                                this.setVolume(this.volume);

 

                                                //number of data

                                                this.numberOfInput = 2;   //only one data input

                                               

                                                //set maxPlayTimeInMilliseconds

                                                if (typeof this.parameters.maxPlayTimeInMilliseconds != "undefined"){

                                                                if(this.parameters.maxPlayTimeInMilliseconds > 0){

                                                                                this.setMaxPlayTimeInMilliseconds(this.parameters.maxPlayTimeInMilliseconds);//5 sec as default for maxPlayTimeInMilliseconds if input is less than 0, then use default

                                                                }

                                                }

                                               

                                                //set containerId

                                                if(typeof this.parameters.containerId == "undefined"){

                                                                this.containerId = null;

                                                                //no container, so do not dynamically create html

                                                                this.dynamicallyCreateHtml = false;

                                                }

                                                else{

                                                                this.containerId= this.parameters.containerId;

                                                                this.dynamicallyCreateHtml = true;

                                                                if(typeof this.parameters.playButtonText == "undefined"){

                                                                                this.setPlayButtonText("play");                                //set play as default

                                                                }

                                                                else{

                                                                                this.setPlayButtonText(this.parameters.playButtonText);

                                                                }

                                                }

                                               

                                                //set condenseDataToFit

                                                if (typeof this.parameters.condenseDataToFit != "undefined"){

                                                                this.setCondenseDataToFit(this.parameters.condenseDataToFit);

                                                }

                                               

                                                var tempData;

                                                for(i=0; i<this.numberOfInput; i++) {

                                                                tempData = this.inputData[i].slice(0);

                                                                //must clean first and then pick up data

                                                                //clean the data

                                                                this.cleanData(tempData);

                                                               

                                                                var temp = this.pickUpDataSample(tempData);                                                

                                                                this.inputNormalized[i]= this.normaliztion(temp);

                                                                this.audioNode[i] = new TalkingChartNode();                    //create each TalkingChartNode

                                                                this.audioNode[i].TalkingChartContext = this.TalkingChartContext; //pass TalkingChartContext to talking chart node

                                                                this.audioNode[i].nodeInit(this.inputNormalized[i]); // TalkingChartNode initialize

                                                                this.audioNode[i].setVolume(this.volume);

                                                }

                                               

                                                //set setPlayVoiceAsPulse(on)

                                                if(typeof this.parameters.voice1.playVoiceAsPulse !="undefined"){

                                                                this.audioNode[0].setPlayVoiceAsPulse(this.parameters.voice1.playVoiceAsPulse);

                                                }

                                               

                                                //set for voice 2

                                                if(typeof this.parameters.voice2.playVoiceAsPulse !="undefined"){

                                                                this.audioNode[1].setPlayVoiceAsPulse(this.parameters.voice2.playVoiceAsPulse);

                                                }

                                               

                                                //set pulseRequested as false first

                                                this.setPulseRequested(false); //pulseRequested default value is false

                                                for(var i=0; i< this.numberOfInput; i++){

                                                                if(this.audioNode[i].playVoiceAsPulse){

                                                                                //TODO: pulse does not work well on Chrome and Safari, so stop pulse if user use chrome or safari

                                                                                var browserVersion = window.navigator.userAgent;

                                                                                var browserVersionFirefox = browserVersion.indexOf("Firefox");

                                                                                if(browserVersionFirefox>0){

                                                                                                this.setPulseRequested(true);

                                                                                }             

                                                                                else{

                                                                                                this.errorLog("for pulse feature, we only support for FireFox for now. Sorry for inconvenience.","info"); 

                                                                                }

                                                                                break;

                                                                }

                                                }

                                                                              

                                                //set frequency and range, voice 1

                                                if(typeof this.parameters.voice1.frequencyLow == "undefined" ){

                                                                if(typeof this.parameters.voice1.range == "undefined"){

                                                                                this.audioNode[0].setFrequencyRange(this.voice1FrequencyLowDefault,this.frequencyRangeDefault);                                                             //default value is this.voice1FrequencyLowDefault(700), range this.frequencyRangeDefault(300)

                                                                }

                                                                else{

                                                                                this.audioNode[0].setFrequencyRange(this.voice1FrequencyLowDefault,this.parameters.voice1.range);                                                           //frequency low undefined, range defined

                                                                }

                                                }

                                                //lower frequency set

                                                else{

                                                                if(typeof this.parameters.voice1.range == "undefined"){

                                                                                this.audioNode[0].setFrequencyRange(this.parameters.voice1.frequencyLow,this.frequencyRangeDefault);                                                   //default range is this.frequencyRangeDefault(300)

                                                                }

                                                                else{

                                                                                this.audioNode[0].setFrequencyRange(this.parameters.voice1.frequencyLow,this.parameters.voice1.range);                                                                //frequency low undefined, range defined

                                                                }

                                                }                                             

                                               

                                                //set frequency and range, voice 2

                                                if(typeof this.parameters.voice2.frequencyLow == "undefined" ){

                                                                if(typeof this.parameters.voice2.range == "undefined"){

                                                                                this.audioNode[1].setFrequencyRange(this.voice2FrequencyLowDefault,this.frequencyRangeDefault);                                                             //default value is 300, range 300

                                                                }

                                                                else{

                                                                                this.audioNode[1].setFrequencyRange(this.voice2FrequencyLowDefault,this.parameters.voice2.range);                                                           //frequency low undefined, range defined

                                                                }

                                                }

                                                //lower frequency set

                                                else{

                                                                if(typeof this.parameters.voice2.range == "undefined"){

                                                                                this.audioNode[1].setFrequencyRange(this.parameters.voice2.frequencyLow,this.frequencyRangeDefault);                                                   //default range is 300

                                                                }

                                                                else{

                                                                                this.audioNode[1].setFrequencyRange(this.parameters.voice2.frequencyLow,this.parameters.voice2.range);                                                                //frequency low undefined, range defined

                                                                }

                                                }             

                                               

                                                //set name (announcement) of data1

                                                if (typeof this.parameters.voice1.announcement != "undefined"){

                                                                this.audioNode[0].setDataName(this.parameters.voice1.announcement); //"" for data name as default

                                                }

                                                //set name of data2

                                                if (typeof this.parameters.voice2.announcement != "undefined"){

                                                                this.audioNode[1].setDataName(this.parameters.voice2.announcement); //"" for data name as default

                                                }

                                                //connect

                                                this.twoToneSetup();

                                }

                               

                }

                //cannot handle this input

                else{

                                this.errorLog("cannot handle this input error","log");

                }

                //for announcement

                if(typeof this.parameters.announcement !="undefined"){

                                this.announcement = this.parameters.announcement; //"" for announcement as default

                }

                               

                //dynamically Create Html

                this.createHtml();          

};

 

//set volume for all, also have a same name function for node. but for difference things

TalkingChart.prototype.setVolume = function(vol){

                if (isNaN(vol)) {

                                errorLog("Non-number passed to setVolume().", "log");

                                return;

                }

               

                if(vol<0){

                                this.volume = 0;

                }

                else if(vol>1){

                                this.volume = 1;

                }

                else{

                                this.volume = vol;

                }

};

 

TalkingChart.prototype.setPlayButtonText = function (text){

                this.playButtonText = text;

};

 

//set Debug Mode

TalkingChart.prototype.setdebugMode= function(on){

                this.debugMode = on;

};

 

//clean input data,for all non-number set as null

TalkingChart.prototype.cleanData = function(data){

                for (var i = 0; i < this.maxInputLength; i ++){

                                //non-number

                                if (typeof data[i] != "number"){

                                                data[i] = null;

                                }

                }

};

 

//re-initialize

TalkingChart.prototype.reInit = function(){

                //if it is not the first time to play then we need re init

                if(!this.firstTimePlay){

                                for(i=0; i<this.numberOfInput; i++) {

                                                //this.audioNode[i] = new TalkingChartNode();                                //create each TalkingChartNode

                                                this.audioNode[i].TalkingChartContext = this.TalkingChartContext;

                                                this.audioNode[i].nodeInit(this.inputNormalized[i]); // TalkingChartNode initialize

                                                this.audioNode[i].setVolume(this.volume);

                                }

                                if (this.numberOfInput == 1){

                                                this.oneToneSetup();

                                }

                                else if(this.numberOfInput == 2){

                                                this.twoToneSetup();

                                }

                                else{

                                                this.errorLog("does not support more than two tones for now ","log");

                                }

                }

};

 

 

//this is for one tone

TalkingChart.prototype.oneToneSetup = function(){

 

                this.audioNode[0].setOscillatorType(0);

               

                this.audioNode[0].volume.connect(this.TalkingChartContext.destination);

 

                this.audioNode[0].setFrequencyRange(this.audioNode[0].frequencyLow,this.audioNode[0].range);

};

 

 

TalkingChart.prototype.createHtml = function(){

                if (this.dynamicallyCreateHtml){

                                //todo:  we may need to give those items id,class, etc.

        var dynamicAddContainer = document.getElementById(this.containerId);

        var dynamicAddDiv = document.createElement("div");

        var dynamicAddP = document.createElement("p");

        //only one data

        if(this.numberOfInput == 1){

            var insertText = document.createTextNode(this.announcement);

            dynamicAddP.appendChild(insertText);

          

        }

        //for two data sets

        else if (this.numberOfInput == 2){

            //concurrently play

            if(this.playVoicesConcurrently == true){

                var insertText = document.createTextNode(this.announcement);

                dynamicAddP.appendChild(insertText);

            }

            //sequentially play

            else{

                var insertText = document.createTextNode(this.announcement);

                dynamicAddP.appendChild(insertText);

            }

        }

        //cannot handle more than two set of data yet

        else{

            this.errorLog("cannot handle more than two set of data","log");

        }

        var dynamicAddPlayButton = document.createElement("button");

                               

                                var that = this;

        this.addButtonClickEvent(

                                                                                                                                dynamicAddPlayButton,

                                                                                                                                'click',

                                                                                                                                function (){

                                                                                                                                                that.StartAndStop();

                                                                                                                                                }

                                                                                                                                );

                                var dynamicAddPlayButtonValue = document.createTextNode(this.playButtonText);

        dynamicAddPlayButton.appendChild(dynamicAddPlayButtonValue);

       

        dynamicAddDiv.appendChild(dynamicAddP);

        dynamicAddDiv.appendChild(dynamicAddPlayButton);

        dynamicAddContainer.appendChild(dynamicAddDiv);

 

                                //css

                                // dynamicAddDiv.style.position = "absolute";

                                // dynamicAddDiv.style.left = "-9000px";

                                // dynamicAddDiv.style.top = "-9000px";

                               

                }

};

 

//dynamically created button click handler.

TalkingChart.prototype.addButtonClickEvent = function(element, event, funct){

                if (element.attachEvent)

        return element.attachEvent('on'+event, funct);

    else

        return element.addEventListener(event, funct, false);

};

 

TalkingChart.prototype.setminNoteDuration= function(time){

                if (time >0){

                                this.minNoteDuration = time;

                }

                else{

                                this.errorLog("the minNoteDuration should be positive number only","log");

                }

};

 

TalkingChart.prototype.setMaxPlayTimeInMilliseconds= function(time){

                if (time > this.minNoteDuration){

                                this.maxPlayTimeInMilliseconds = time;

                }

                else{

                                this.errorLog("the MaxPlayTimeInMilliseconds should longer than minNoteDuration","log");

                }

};

//this is for two tones, if cannot set it up, return false

TalkingChart.prototype.twoToneSetup = function(){

 

                try{

                                if( this.separateVoicesInStereo){ // if separateVoicesInStereo is on

 

                                                this.audioNode[0].panner.coneOuterGain = 0.6;

                                                this.audioNode[0].panner.coneOuterAngle = 180;

                                                this.audioNode[0].panner.coneInnerAngle = 0;

                                               

                                                this.audioNode[0].panner.setPosition(2,0,-0.5);

                                               

                                                this.audioNode[0].setOscillatorType(0);

                                               

                                                this.audioNode[0].volume.connect(this.audioNode[0].panner);

                                                this.audioNode[0].panner.connect(this.TalkingChartContext.destination);

 

                                                this.audioNode[1].panner.coneOuterGain = 1;

                                                this.audioNode[1].panner.coneOuterAngle = 180;

                                                this.audioNode[1].panner.coneInnerAngle = 0;

                                               

                                                this.audioNode[1].panner.setPosition(-2,0,-0.5);

 

                                                this.audioNode[1].setOscillatorType(1);

                                                               

                                                this.audioNode[1].volume.connect(this.audioNode[1].panner);

                                                this.audioNode[1].panner.connect(this.TalkingChartContext.destination);

                                                return true;

                                }

                                else{ //separateVoicesInStereo off

                                               

                                                this.audioNode[0].setOscillatorType(0);

                                               

                                                this.audioNode[0].volume.connect(this.TalkingChartContext.destination);

 

                                                this.audioNode[1].setOscillatorType(1);

                                                               

                                                this.audioNode[1].volume.connect(this.TalkingChartContext.destination);

                                                return true;                                                                                       

                                }

                }catch(err){

                                return false;

                }

               

};

 

//normalization function

TalkingChart.prototype.normaliztion = function(input){

                try {

                                var min = Math.min.apply(null,input);

                                var max = Math.max.apply(null,input);

                                var result = input.slice(0);

                               

                                for (var i = 0 ; i < input.length; i++){

                                                //if it is null keep null, otherwise do it

                                                //keep null

                                                if (input[i] == null){

                                                                result[i] = null;

                                                }

                                               

                                                else{

                                                                if(max >0){

                                                                                result[i] = (input[i]-min) / (max);

                                                                }

                                                                else if( max <= 0){

                                                                                result[i] = (input[i]+ Math.abs(min)) / (max+ Math.abs(min));

                                                                }

                                                }

                                               

                                }

                               

                                return result;

                }catch(err){

                                this.errorLog("input data error","log");

                                return null;                        

                }

};

 

//take a boolean argument, true: mask on, false: mask off

TalkingChart.prototype.setPulseRequested = function(on){

                this.pulseRequested = on;

                //need to change minNoteDuration as well

                if (on){

                                this.minNoteDuration = this.minNoteDuration / 4 ;

                               

                               

                }

};

 

//take a boolean argument, true: pickUpDataSample on, false: pickUpDataSample off

TalkingChart.prototype.setCondenseDataToFit = function(on){

                this.condenseDataToFit = on;

                               

};

 

 

 

//when input data is too big, pick up some sample from it

TalkingChart.prototype.pickUpDataSample = function(input){

                var sum;

                var result = [];

                var selectIncrement;  //pick avg of every selectIncrement number of data

                var dataLength = parseInt(this.maxPlayTimeInMilliseconds / this.minNoteDuration); // this is the data length should be

                var j = 0;

                var i = 0;

                var resultIndex = 0; //for input.length < 1.5*dataLength only,

                var numberOfValidData=0;

                //too much data, need pick up some of them

                if(input.length > dataLength && this.condenseDataToFit){

                                //special case: handle the input data length < 1.5* dataLength?

                                if(input.length < 1.5*dataLength){

                                                //this is the pick up data algorithm I created

                                                //input.length % dataLength, then plus one, say it is x,

                                                //use input.length/ x and round down, get y, then we want get avg of every yth data

                                                //eg: 13 in total, we want 10, 13%10 =3, 3+1 =4, 13/4 =3, so we want combine 3-4, 7-8, 11-12

                                                var mod = input.length  % dataLength;

                                                //mod is the number of combine time,

                                                var skipItme = Math.floor(input.length/(mod+1));

                                                while(i< input.length ){

                                                                for (j =0; j< skipItme; j ++){

                                                                                if(i >= input.length){

                                                                                                break;

                                                                                }

                                                                                sum =0;

                                                                                numberOfValidData=0;

                                                                                //need to combine

                                                                                if(j == skipItme-1){

                                                                               

                                                                                                //get avg of two item

                                                                                                if(typeof input[i] == "number"){

                                                                                                                sum = sum + input[i];    

                                                                                                                numberOfValidData++;

                                                                                                }

                                                                                                //move pointer to next item

                                                                                                i++;

                                                                                                if(typeof input[i] == "number"){

                                                                                                                sum = sum + input[i];    

                                                                                                                numberOfValidData++;

                                                                                                }

                                                                                                //if none of them are valid

                                                                                                if(numberOfValidData ==0){

                                                                                                                result[resultIndex] = null;

                                                                                                }

                                                                                                else{

                                                                                                                result[resultIndex]= sum/numberOfValidData;

                                                                                                                resultIndex++;

                                                                                                }

                                                                                               

                                                                                }

                                                                                else{

                                                                                                result[resultIndex]= input[i];

                                                                                                resultIndex++;

                                                                                }

                                                                                i++;

                                                                }

                                                               

                                                }

                                }

                                else{

                                                selectIncrement = Math.ceil(input.length / dataLength);//round up

                                                for ( i =0; i< dataLength && i * selectIncrement < input.length;  i++){

                                                                sum = 0;

                                                                numberOfValidData =0;

                                                                for (  j=0 ; j < selectIncrement && ((i * selectIncrement +j )< input.length); j++){

                                                                                //if the data is valid

                                                                                if(typeof input[i * selectIncrement +j] == "number"){

                                                                                                sum = sum + input[i * selectIncrement +j];         

                                                                                                numberOfValidData++;

                                                                                }                                                                                             

                                                                }

                                                                //make sure numberOfValidData not 0

                                                                if(numberOfValidData == 0){

                                                                                result[i] = null;

                                                                }

                                                                else{

                                                                                result[i] = sum /numberOfValidData;

                                                                }

                                                }

                                }

                                return result;

                }

                else{

                                //input is good

                                return input;

                }

};

 

//stop function: to stop play

TalkingChart.prototype.stop = function(){

                if(this.isPlaying){//stop

                                //stop oscillator

                                try{

                                                for ( var i=0; i< this.audioNode.length; i++){

                                                                this.audioNode[i].oscillator.stop(0);

                                                }

                                }catch(err){

                                                for ( var i=0; i< this.audioNode.length; i++){

                                                                                this.audioNode[i].oscillator.noteOff(0);

                                                                }

                                }

                                this.isPlaying = false;                     //set it back to not play

                                this.stopInterval();

                                //firstTimePlay set it to false

                                this.firstTimePlay = false;

                }

};

 

TalkingChart.prototype.StartAndStop = function(){

                var thisObject = this;    //for setInterval

                var count = 0;  //to count how many data used, to stop the time interval

                if(this.isPlaying){//stop

                                //stop oscillator

                                try{

                                                for ( var i=0; i< this.audioNode.length; i++){

                                                                this.audioNode[i].oscillator.stop(0);

                                                }

                                }catch(err){

                                                try{

                                                                for ( var i=0; i< this.audioNode.length; i++){

                                                                                this.audioNode[i].oscillator.noteOff(0);

                                                                }

                                                }catch(err){

                                                }

                                }

                                this.isPlaying = false;                     //set it back to not play

                                this.stopInterval();

                                //firstTimePlay set it to false

                                this.firstTimePlay = false;

                }

                else{//start play

                                this.isPlaying = true;     

                                //start all oscillator

                                // re init in case we need to

                                this.reInit();

 

                               

                                if(thisObject.playVoicesConcurrently){

                                                try{

                                                                for(var i =0; i< this.audioNode.length; i++){

                                                                                if(!thisObject.audioNode[i].data[parseInt(count)]){

                                                                                                thisObject.audioNode[i].oscillator.frequency.value =0;              

                                                                                }

                                                                                else{

                                                                               

                                                                                                thisObject.audioNode[i].oscillator.frequency.value =

                                                                                                                parseInt(thisObject.audioNode[i].data[parseInt(count)]*thisObject.audioNode[i].range)+thisObject.audioNode[i].frequencyLow;

                                                                                }

                                                                                this.audioNode[i].oscillator.start(0);

                                                                }

                                                }catch(err){

                                                                for(var i =0; i< this.audioNode.length; i++){

                                                                                if(!thisObject.audioNode[i].data[parseInt(count)]){

                                                                                                thisObject.audioNode[i].oscillator.frequency.value =0;              

                                                                                }

                                                                                else{

                                                                               

                                                                                                thisObject.audioNode[i].oscillator.frequency.value =

                                                                                                                parseInt(thisObject.audioNode[i].data[parseInt(count)]*thisObject.audioNode[i].range)+thisObject.audioNode[i].frequencyLow;

                                                                                }

                                                                                this.audioNode[i].oscillator.noteOn(0);

                                                                }

 

                                                }

                                                //start the interval

                                               

                                                this.timeIntervalNode = setInterval(function(){

                                                                //when it is done

                                                                                if (count == thisObject.audioNode[0].data.length-1){                                                                                   

                                                                                                try{

                                                                                                                for ( var i=0; i< thisObject.audioNode.length; i++){

                                                                                                                                thisObject.audioNode[i].oscillator.stop(0);

                                                                                                                }

                                                                                                }catch(err){

                                                                                                                for ( var i=0; i< thisObject.audioNode.length; i++){

                                                                                                                                                thisObject.audioNode[i].oscillator.noteOff(0);

                                                                                                                                }

                                                                                                }

                                                                                //firstTimePlay set it to false

                                                                                thisObject.firstTimePlay = false;

                                                                               

                                                                                thisObject.isPlaying = false;                       //set it back to not play

                                                                                thisObject.stopInterval();                                            //stop time interval

                                                                }

                                                                if(thisObject.pulseRequested){

                                                                                for ( var i=0; i< thisObject.numberOfInput; i++){

                                                                                               

                                                                                                if (thisObject.audioNode[i].playVoiceAsPulse && count % 0.5 ==0){

                                                                                                                thisObject.audioNode[i].oscillator.frequency.value =0;

                                                                                                }

                                                                                                else{

                                                                                                                //if it is null

                                                                                                                if(!thisObject.audioNode[i].data[parseInt(count)]){

                                                                                                                                thisObject.audioNode[i].oscillator.frequency.value =0;               

                                                                                                                }

                                                                                                                else{

                                                                                                                                thisObject.audioNode[i].oscillator.frequency.value =

                                                                                                                                                parseInt(thisObject.audioNode[i].data[parseInt(count)]*thisObject.audioNode[i].range)+thisObject.audioNode[i].frequencyLow;

                                                                                                                }

                                                                                                }

                                                                                }

                                                                                count = count + 0.25;

                                                                }

                                                                else{

                                                                //keep playing

                                                                                for ( var i=0; i< thisObject.numberOfInput; i++){

                                                                                                //if it is null

                                                                                                if(!thisObject.audioNode[i].data[parseInt(count)]){

                                                                                                                thisObject.audioNode[i].oscillator.frequency.value =0;              

                                                                                                }

                                                                                                else{

                                                                                                                thisObject.audioNode[i].oscillator.frequency.value =

                                                                                                                                parseInt(thisObject.audioNode[i].data[count]*thisObject.audioNode[i].range+thisObject.audioNode[i].frequencyLow);

                                                                                                }

                                                                                }

                                                                                count++;

                                                                }

                                                               

                                                }, thisObject.minNoteDuration);

                                }                             

                                else if(!thisObject.playVoicesConcurrently){

                                                thisObject.audioNode[0].oscillator.frequency.value =0;             

                                                try{

                                                                this.audioNode[0].oscillator.start(0);

                                                }catch(err){

                                                                this.audioNode[0].oscillator.noteOn(0);

 

                                                }

                                                                count=0;

                                                                //start the interval

                                                                this.timeIntervalNode = setInterval(function(){

                                                                                if (count == thisObject.audioNode[0].data.length-1){                                                                                   

                                                                                                                try{

                                                                                                                                thisObject.audioNode[0].oscillator.stop(0);

                                                                                                                }catch(err){

                                                                                                                                thisObject.audioNode[0].oscillator.noteOff(0);

                                                                                                                }

                                                                                                //firstTimePlay set it to false

                                                                                                thisObject.firstTimePlay = false;

                                                                                               

                                                                                                thisObject.stopInterval();                                            //stop time interval

                                                                                               

                                                                                                //set count to 0

                                                                                                count=0;

                                                                                                //TalkingChartContext.pause();

                                                                                                if(thisObject.isPlaying && thisObject.numberOfInput >1){

                                                                                                                //for second set of data

                                                                                                                //start it

                                                                                                                try{

                                                                                                                                //if it is null

                                                                                                                                if(!thisObject.audioNode[1].data[parseInt(count)]){

                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =0;             

                                                                                                                                }

                                                                                                                                else{

                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =

                                                                                                                                                                parseInt(thisObject.audioNode[1].data[parseInt(count)]*thisObject.audioNode[1].range)+thisObject.audioNode[1].frequencyLow;

                                                                                                                                }

                                                                                                                                thisObject.audioNode[1].oscillator.start(0);

                                                                                                                }catch(err){

                                                                                                                                //if it is null

                                                                                                                                if(!thisObject.audioNode[1].data[parseInt(count)]){

                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =0;             

                                                                                                                                }

                                                                                                                                else{

                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =

                                                                                                                                                                parseInt(thisObject.audioNode[1].data[parseInt(count)]*thisObject.audioNode[1].range)+thisObject.audioNode[1].frequencyLow;

                                                                                                                                }

                                                                                                                                thisObject.audioNode[1].oscillator.noteOn(0);

                                                                                                                }

                                                                               

                                                                                                                //interval function

                                                                                                                thisObject.timeIntervalNode = setInterval(function(){

                                                                                                                               

                                                                                                                                if (count == thisObject.audioNode[1].data.length-1){                                                                                   

                                                                                                                                                try{

                                                                                                                                                                thisObject.audioNode[1].oscillator.stop(0);

                                                                                                                                                               

                                                                                                                                                }catch(err){

                                                                                                                                                                thisObject.audioNode[1].oscillator.noteOff(0);

 

                                                                                                                                                }

                                                                                                                                                //firstTimePlay set it to false

                                                                                                                                                thisObject.firstTimePlay = false;

                                                                                                                               

                                                                                                                                                thisObject.isPlaying = false;                       //set it back to not play

                                                                                                                                                thisObject.stopInterval();                                            //stop time interval

                                                                                                                                }

                                                                                                                                if(thisObject.pulseRequested){

                                                                                                               

                                                                                                                                                if (thisObject.audioNode[1].playVoiceAsPulse && (count % 1 !=0  && count % 0.25 == 0)){

                                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =0;

                                                                                                                                                }

                                                                                                                                                else{

                                                                                                                                                                //if it is null

                                                                                                                                                                if(!thisObject.audioNode[1].data[parseInt(count)]){

                                                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =0;             

                                                                                                                                                                }

                                                                                                                                                                else{

                                                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =

                                                                                                                                                                                                parseInt(thisObject.audioNode[1].data[parseInt(count)]*thisObject.audioNode[1].range)+thisObject.audioNode[1].frequencyLow;

                                                                                                                                                                }

                                                                                                                                                }

                                                                                                                                                count = count + 0.25;

                                                                                                                                }

                                                                                                                                else{

                                                                                                                                                //if it is null

                                                                                                                                                if(!thisObject.audioNode[1].data[parseInt(count)]){

                                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =0;             

                                                                                                                                                }

                                                                                                                                                else{

                                                                                                                                                                thisObject.audioNode[1].oscillator.frequency.value =

                                                                                                                                                                parseInt(thisObject.audioNode[1].data[count]*thisObject.audioNode[1].range+thisObject.audioNode[1].frequencyLow);

                                                                                                                                                }

                                                                                                                                                count++;

                                                                                                                                }             

 

                                                                                                                }, thisObject.minNoteDuration);

                                                                                                }

                                                                                }

                                                                                if(thisObject.pulseRequested){

                                                                                               

                                                                                                                if (thisObject.audioNode[0].playVoiceAsPulse && count % 0.5 ==0){

                                                                                                                                thisObject.audioNode[0].oscillator.frequency.value =0;

                                                                                                                }

                                                                                                                else{

                                                                                                                                //if it is null

                                                                                                                                if(!thisObject.audioNode[0].data[parseInt(count)]){

                                                                                                                                                thisObject.audioNode[0].oscillator.frequency.value =0;             

                                                                                                                                }

                                                                                                                                else{

                                                                                                                                                thisObject.audioNode[0].oscillator.frequency.value =

                                                                                                                                                                parseInt(thisObject.audioNode[0].data[parseInt(count)]*thisObject.audioNode[0].range)+thisObject.audioNode[0].frequencyLow;

                                                                                                                                }

                                                                                                                }

                                                                                                count = count + 0.25;

                                                                                }

                                                                                else{

                                                                                //keep playing

                                                                                                //if it is null

                                                                                                if(!thisObject.audioNode[0].data[parseInt(count)]){

                                                                                                                thisObject.audioNode[0].oscillator.frequency.value =0;             

                                                                                                }

                                                                                                else{

                                                                                                                thisObject.audioNode[0].oscillator.frequency.value =

                                                                                                                                parseInt(thisObject.audioNode[0].data[count]*thisObject.audioNode[0].range+thisObject.audioNode[0].frequencyLow);

                                                                                                }

                                                                                               

                                                                                                count++;

                                                                                }             

 

                                                                }, thisObject.minNoteDuration);

                                                                                                                               

                                                                //firstTimePlay set it to false

                                                                this.firstTimePlay = false;

                                }

                                else{//error

                                                this.errorLog("playVoicesConcurrently error, maybe not defined.","log");

                                }                             

                }             

};

 

TalkingChart.prototype.stopInterval = function(){

                clearInterval(this.timeIntervalNode);                                   //stop time interval

};

 

 

TalkingChart.prototype.errorLog=function(error,type){

                //if browser support console

                if (window.console && this.debugMode){

                                if(type =="error"){

                                                console.error("TalkingChart Error: "+error);

                                }

                                else if( type == "info"){

                                                console.info("TalkingChart Info: "+error);

                                }

                                else if( type == "log"){

                                                console.log("TalkingChart Log: "+error);

                                }

                                //use log for any other case

                                else{

                                                console.log("TalkingChart: "+error);

                                }             

                }

};

/******************************************************************************

Audio Chart Node class

*******************************************************************************/

 

//Audio Chart Node class

function TalkingChartNode(){

                this.dataName = "";                        //data name (announcement)

                this.data;                                             //this is input data, normalized

                this.frequencyLow;                         //this is lower frequency of this node

                this.range;                                          //this is frequency range

                this.oscillator;                   //oscillator

                this.panner;                                       //panner, position of coming sound

                this.biquadFilter;            //filter, may not use

                this.volume;                      //gain node for volume               

                this.TalkingChartContext;

                this.playVoiceAsPulse = false;

               

}

 

//it takes one argument, input is the input data

TalkingChartNode.prototype.nodeInit= function(input){

                this.data = input;                                                                                                                                                                             //copy input data

                this.oscillator = this.TalkingChartContext.createOscillator();      //create oscillator

                this.panner = this.TalkingChartContext.createPanner();                                               //create panner

                this.biquadFilter = this.TalkingChartContext.createBiquadFilter();//create biquad filter

                try{

                                this.volume = this.TalkingChartContext.createGain();

                }catch(err){

                                this.volume = this.TalkingChartContext.createGainNode();

                }

                //connect

                this.oscillator.connect(this.volume);

                               

                //TODO: may need set oscillator type, done in two/one ToneSetup, but not for more than two

};

 

//set Frequency Range:  eg: setFrequencyRange(300,200); means start at 300 up to 500hz

TalkingChartNode.prototype.setFrequencyRange = function(frequencylow,range){

                this.frequencyLow = frequencylow;

                this.range = range;

               

};

 

//set data name

TalkingChartNode.prototype.setDataName = function(name){

                this.dataName = name;

               

};

 

//set oscillator type:  eg: 0-3

TalkingChartNode.prototype.setOscillatorType = function(type){

                if (type <0 || type >3 || typeof(type) != "number"){

                                //set as default

                                this.oscillator.type = 0;

                }

                else{

                                this.oscillator.type = parseInt(type);

                }

               

};

 

//set up the volume

TalkingChartNode.prototype.setVolume = function(vol){

                if(vol<0){

                                this.volume.gain.value = 0;

                }

                else if(vol>1){

                                this.volume.gain.value = 1;

                }

                else{

                                this.volume.gain.value = vol;

                }

               

};

 

TalkingChartNode.prototype.setPlayVoiceAsPulse = function(on){

                this.playVoiceAsPulse = on;

};