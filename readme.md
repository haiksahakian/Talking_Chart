<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>TalkingChart.js</title>
</head>

<body>
<h1>Talking Chart</h1>
<h2>Overview</h2>
<p>Talking Chart is a JavaScript library that provides an audio representation of a chart.It can be used by non-visual users of the internet to summarize a chart's message. The library uses the oscillator features in HTML 5's Web Audio API, which are available in the latest versions of the Chrome, Safari, and Firefox browsers. To use the library, create a TalkingChart object and pass in a JavaScript reference to the chart's data. The library is open source and free to use under the MIT license.</p>
<h2>Examples</h2>
<h3>Simple Example</h3>
<pre>var talkingChartParameters = {</pre>
<pre>  containerId: 'talkingChartLocation',</pre>
<pre>  announcement: 'Press play to hear the chart showing the average daily temperature in your area over the last 12 months',</pre>
<pre>  voice1: {</pre>
<pre>    data: myXmlDataSource.data</pre>
<pre>  }</pre>
<pre>};</pre>
<pre>var talkingChart = new TalkingChart(talkingChartParameters);
</pre>
<h3>More Detailed Examples</h3>
<ul type="disc">
  <li><a href="examples/demo-highcharts.html" target="_blank">Integration with HighCharts</a></li>
  <li><a href="examples/script-example.js" target="_blank">Script example of using the configuration parameters below</a></li>
</ul>
<h2>Configuration Parameters</h2>
<h3>Top-level Configuration Parameters</h3>
<table border="0" cellpadding="10" width="1100">
  <tbody>
    <tr>
      <td width="170"><p><strong>Parameter</strong></p></td>
      <td><p><strong>Type</strong></p></td>
      <td><p><strong>Default Value</strong></p></td>
      <td><p><strong>Role</strong></p></td>
    </tr>
    <tr>
      <td width="170"><p>announcement</p></td>
      <td><p>String</p></td>
      <td><p>Optional, defaults to an empty string.</p></td>
      <td><p>The text label that will be read first when a browser reaches the talking chart.</p></td>
    </tr>
    <tr>
      <td width="170"><p>containerId</p></td>
      <td><p>String</p></td>
      <td><p>Required.</p></td>
      <td><p>ID of the html container in which the library will place insert its hidden buttons and labels.</p></td>
    </tr>
    <tr>
      <td width="170"><p>debugMode</p></td>
      <td><p>Boolean</p></td>
      <td><p>Optional, defaults to false.</p></td>
      <td><p>When true, warnings and errors will display in the browser's console window.</p></td>
    </tr>
    <tr>
      <td width="170"><p>maxPlayTimeInMilliseconds</p></td>
      <td><p>Integer</p></td>
      <td><p>Optional, defaults to 5000.</p></td>
      <td><p>The longest amount of time the audio will play, in milliseconds.</p></td>
    </tr>
    <tr>
      <td width="170"><p>minNoteDuration</p></td>
      <td><p>Integer</p></td>
      <td><p>Optional, defaults to 200.</p></td>
      <td><p>The shortest amount of time an individual note can play. Values under 50 milliseconds are unreliable.</p></td>
    </tr>
    <tr>
      <td width="170"><p>playButtonText</p></td>
      <td><p>String</p></td>
      <td><p>Optional, defaults to "Play chart as audio".</p></td>
      <td><p>The text of the hidden button to play the chart audio.</p></td>
    </tr>
    <tr>
      <td width="170"><p>playVoicesConcurrently</p></td>
      <td><p>Boolean</p></td>
      <td><p>Optional, defaults to true.</p></td>
      <td><p>Whether to play audio for both data series at the same time (true), or one after another (false). Only used when two series of data are present.</p></td>
    </tr>
    <tr>
      <td width="170"><p>separateVoicesInStereo</p></td>
      <td><p>Boolean</p></td>
      <td><p>Optional, defaults to true.</p></td>
      <td><p>Whether to play each voice in a separate speaker. Only used when two series of data are present.</p></td>
    </tr>
    <tr>
      <td width="170"><p>voice1</p></td>
      <td><p>Object</p></td>
      <td><p>Required.</p></td>
      <td><p>Settings to play the first data series. See table below.</p></td>
    </tr>
    <tr>
      <td width="170"><p>voice2</p></td>
      <td><p>Object</p></td>
      <td><p>Optional, defaults to null.</p></td>
      <td><p>Settings to play a second data series. See table below.</p></td>
    </tr>
    <tr>
      <td width="170"><p>volume</p></td>
      <td><p>Float</p></td>
      <td><p>Optional, defaults to 1.</p></td>
      <td><p>Global volume setting for both voices. The value can range from 0 to 1.</p></td>
    </tr>
  </tbody>
</table>
<h3>Voice Object Configuration Parameters</h3>
<table border="0" cellpadding="10" width="1100">
  <tbody>
    <tr>
      <td width="170"><p><strong>Parameter</strong></p></td>
      <td><p><strong>Type</strong></p></td>
      <td><p><strong>Default Value</strong></p></td>
      <td><p><strong>Role</strong></p></td>
    </tr>
    <tr>
      <td width="170"><p>data</p></td>
      <td><p>Array</p></td>
      <td><p>Required.</p></td>
      <td><p>A reference to the data to be played as audio. This is intended to be the same data that is used to generate the graphical chart.</p></td>
    </tr>
    <tr>
      <td width="170"><p>minFrequency</p></td>
      <td><p>Integer</p></td>
      <td><p>Optional, defaults to 300 for voice1 and 800 for voice2.</p></td>
      <td><p>The lowest frequency sound that can be played in a voice.</p></td>
    </tr>
    <tr>
      <td width="170"><p>frequencyRange</p></td>
      <td><p>Integer</p></td>
      <td><p>Optional, defaults to 300.</p></td>
      <td><p>The distance between the highest and lowest frequencies that can be played in a voice.</p></td>
    </tr>
    <tr>
      <td width="170"><p>playVoiceAsPulse</p></td>
      <td><p>Boolean</p></td>
      <td><p>Optional, defaults to true for voice1 and false for voice2.</p></td>
      <td><p>Whether the audio is played as a pulse rather than a steady tone. Having one voice played as a pulse can help the listener differentiate between two concurrently playing voices.</p></td>
    </tr>
  </tbody>
</table>
<h2>Screen Reader Support</h2>
<p>Talking Chart has been tested with NV Access's NVDA, Freedom Scientific's Jaws 12.0, and Apple's VoiceOver.</p>
<h2>License</h2>
<p>Talking Chart is a free library, under the MIT license. Details <a href="LICENSE.txt">here</a>. Its code is open source and available on Github.</p>
<h2>Support</h2>
<p>The library is provided as-is and is generally not supported, but you can post questions on Github.</p>
<h2>Developers</h2>
<p>The library was written by <a href="https://github.com/rd6668">Di Ren</a> and <a href="https://github.com/haiksahakian">Haik Sahakian</a>.</p>
</body>
</html>
