<!-- INTRODUCTION -->

*   # This is a PSA
<!-- WHY -->
*   # Why do you want metrics?

*   # How we use metrics

*   # Planning

*   # Find Problems

*   # Even the ones we didn't know we had

*   ## Going Down
     <img src="images/something_wrong.png">  

*   # What do you alert on?

*   ## Brainiac Wut
    <img src="images/brainiac-wut.png">

<!-- STATSD -->
<!--
StatsD is simple, which is important because, like testing,
metrics only get done if they're easy to use.
-->
*   ## StatsD
    ### Dead simple

*   ## StatsD
    ### Dead simple
    ### (that's important)

*   ## StatsD
    ### Dead simple
    ### (that's important)
    ### Only counters & timers

*   ## StatsD
    ### Dead simple
    ### (that's important)
    ### Only counters & timers
    ### Talks to Graphite

<!--
Metrics written by Coda Hale at Yammer
-->
*   # Metrics

*   # Metrics (proper noun)

*   # Metrics offers many different metrics

*   ## Gauges
    <img src="images/gauge.jpg">

*   ## Timers
    <img src="images/timer.jpg">

*   ## Counter
    <img src="images/counter.jpg">

*   ## Meter
    <img src="images/meter.jpg">

*   ## Histogram
    <img src="images/histogram.jpg">

*   # How do I count things across requests?
<!-- How it all works flowchart -->

*   ## Metrics from top to bottom
    <img src="images/flowchart.png">

<!-- PHETRIC -->
*   ## Setup Phetric

    ### Phetric_Sender::init( 'localhost', '1420', $prepend );

*   # $prepend = $app . $env;

*   ## All at once or as they come?

    ### Autoflush paramater will send metrics immediately
    ### Useful for long running scripts

<!-- METRIC CATCHER -->
*   ## MetricCatcher
    ### Access to everything in Metrics
    ### Handles persistence
    ### Listens for JSON
    ### Talks to Ganglia and Graphite

*   ## JSON format
        {
            "name":"server.application.section.metric_name",
            "value":7,
            "type":"meter",
            "timestamp":unix_time.millis
        }

<!-- GANGLIA -->
*   ## Ganglia
    ### Drew, explain this

*   ## Cluster Overview
    <img src="images/cluster overview.png">

*   ## Machine Overview
    <img src="images/apw00 overview.png">

*   ## Metric Drilldown
    <img src="images/adm0d cpu drilldown.png">

<!-- GRAPHITE -->
*   # You use Graphite, too?

*   ## GB9k
    <img src="images/GB9k.jpg">

<!-- EXISTING ISSUES -->
*   # What should I graph?

*   # Changing time periods

*   # Drilldown to specific machines

*   # Questions?
    <div class='presenter'>
        <h3>Aaron Jorbin</h3>
        <p><a href="http://aaron.jorb.in">aaron.jorb.in</a></p>
        <p><a href="http://twitter.com/aaronjorbin">@aaronjorbin</a></p>
    </div>
    <div class='presenter'>
        <h3>Drew Stephens</h3>
        <p><a href="http://dinomite.net/">dinomite.net</a></p>
        <p><a href="http://twitter.com/dinomite">@dinomite</a></p>
    </div>
    <div id="joinus">
        <h3>Clearspring is hiring</h3>
        [http://clearspring.com/jobs](http://clearspring.com/jobs)
    <div>
