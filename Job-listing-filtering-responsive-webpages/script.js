$(document).ready(function () {
  $.getJSON("data.json", function (data) {


    //---------------Condition for filtering the job and putting filter job in a an array-------------------
    var filters = [];

    function filterJobs() {
      var filteredJobs = data.filter(function (job) {
        return filters.every(function (filter) {
          return (
            job.languages.includes(filter) ||
            job.tools.includes(filter) ||
            job.role === filter ||
            job.level === filter
          );
        });
      });

      //-------------filtered jobs appear everythime a new filter is addded

      // Clear existing job divs evertime a new filter is added
      $(".job-main").remove();

      // Create job div for filtered jobs
      filteredJobs.forEach(function (jobData) {
        var jobElement = $('<div class="job-main">');
        jobElement.append('<img src="' + jobData.logo + '">');

        var jobDescription = $('<div class="job-description">');

        var jobTitle = $('<div class="job-title">');

        jobTitle.append(
          '<label class="company">' +
            jobData.company +
            "</label>" +
            (jobData.new ? '<label class="new">NEW!</label>' : "") +
            (jobData.featured ? '<label class="featured">FEATURED</label>' : "")
        );

        jobDescription.append(jobTitle);

        jobDescription.append(
          '<label class="job-name">' + jobData.position + "</label>"
        );

        var details = $('<div class="details">');

        details.append(
          '<label class="time-posted">' +
            jobData.postedAt +
            " . </label>" +
            '<label class="job-duration">' +
            jobData.contract +
            " . </label>" +
            '<label class="job-location">' +
            jobData.location +
            "</label>"
        );

        jobDescription.append(details);
        jobElement.append(jobDescription);

        var filtersDiv = $('<div class="filters">');

        filtersDiv.append(
          '<button class="job-button" data-filter="' +
            jobData.role +
            '">' +
            jobData.role +
            "</button>",
          '<button class="job-button" data-filter="' +
            jobData.level +
            '">' +
            jobData.level +
            "</button>"
        );

        jobData.languages.forEach(function (language) {
          filtersDiv.append(
            '<button class="job-button" data-filter="' +
              language +
              '">' +
              language +
              "</button>"
          );
        });

        jobData.tools.forEach(function (tool) {
          filtersDiv.append(
            '<button class="job-button" data-filter="' +
              tool +
              '">' +
              tool +
              "</button>"
          );
        });

        filtersDiv.append('<button class="delete-job-button">X</button>');

        jobElement.append(filtersDiv);
        $(".main").append(jobElement);
      });
    }

    //------------------filter update in the top filter box----------------------

    function updateFilters() {
      // toggles filter in the hanging bar by clearing existing filter button
      $(".filter-button").remove();

      // Create filter buttons for active filters
      filters.forEach(function (filter) {
        var filterButton = $('<div class="filter-button">');

        filterButton.append(
          '<label class="filter-label">' + filter + "</label>"
        );
        filterButton.append('<button class="filter-cross">X</button>');

        // Click event to remove the filter
        filterButton.on("click", function () {
          // Remove filter from active filters array
          filters = filters.filter(function (item) {
            return item !== filter;
          });

          // Update job list based on remaining filters
          filterJobs();
          // Update filter buttons in the filter box
          updateFilters();
        });

        // Append filter button to the filter box
        $(".filter-box").append(filterButton);
      });
    }

    $(".main").on("click", ".job-button", function () {
      var filter = $(this).data("filter");

      // Toggle filter in the active filters array
      if (filters.includes(filter)) {
        filters = filters.filter(function (item) {
          return item !== filter;
        });
      } else {
        filters.push(filter);
      }
      // Update job list based on active filters
      filterJobs();
      // Update filter buttons in the filter box
      updateFilters();
    });

    //--------------------delete button----------------------

    $(".main").on("click", ".delete-job-button", function () {
      // Find the job element's siblings to identify the job to delete
      var jobElement = $(this).closest(".job-main");

      // Remove the job element from the DOM
      jobElement.remove();

      // Update filter buttons and filters
      updateFilters();
    });

    //-----------------------pop-up--------------------------

    $(".main").on("click", ".job-name", function () {
      var jobTitle = $(this).text();
      var comp = $(this).siblings(".job-title").find(".company").text();
      var jobId;

      for (var i = 0; i < data.length; i++) {
        if (data[i].position === jobTitle && data[i].company === comp) {
          jobId = i;
          break;
        }
      }

      var d = data[jobId];

      alert(
        "Company Name: " +
          d.company +
          "\n" +
          "Position: " +
          d.position +
          "\n" +
          "Role: " +
          d.role +
          "\n" +
          "Level: " +
          d.level +
          "\n" +
          "Posted At: " +
          d.postedAt +
          "\n" +
          "Contract: " +
          d.contract +
          "\n" +
          "Languages: " +
          d.languages +
          "\n" +
          "Tools: " +
          d.tools
      );
    });

    // Initial load to display all jobs
    filterJobs();
  });
});
