<?php include('header.php'); ?>
<main class="explore-bg">
  <div class="wrapper">
    <div class="col-xs-12 explore-title">
      <h1>Average deaths per day</h1>
    </div>

    <div class="warInfo">
      <svg class="closeButton" viewbox="0 0 40 40">
        <path class="close-x" d="M 10,10 L 30,30 M 30,10 L 10,30" />
      </svg>
    </div>
    <div class="visualization-container">
      <div id="chart"></div>
      <script src="js/datavisualization.js"></script>
    </div>
  </div>
</main>
<?php include('footer.php'); ?>
