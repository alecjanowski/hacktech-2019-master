$(document).ready(function() {
    $.get('/api/results', function(response) {
        var json = JSON.parse(response).bindings;
        var countryOptions = {};
        var gdpValues = [];
        var debtValues = [];
        var inflationValues = [];
        var unemploymentValues = [];

        var startTimes = {};
        for (var i = 0; i < json.length; i++) {
            startTimes[json[i].iso.value] = json[i].start_time.value;
        }

        for (var i = 0; i < json.length; i++) {
            countryOptions[json[i].countryLabel.value] = json[i].iso.value;
        }
        var countryOptionsHTML = "";
        for (var i = 0; i < json.length; i++) {
            countryOptionsHTML += "<option value='"+json[i].iso.value+"'>"+json[i].countryLabel.value+"</option>";
        }
        $("select").html(countryOptionsHTML);
        $("select").change(function() {
            var countryCode = $(this).val();
            var start = startTimes[countryCode];
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_LUR/data.json", function(response) {


                var dates = response.dataset_data.data;
                unemploymentValues[0] = dates[4][1];
                for (var d = 5; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];

                    unemploymentValues[d - 4] = currentGDP;
                }




            });
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_PPPGDP/data.json", function(response) {


                var dates = response.dataset_data.data;
                gdpValues[0] = dates[4][1];
                for (var d = 5; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];

                    gdpValues[d - 4] = currentGDP;
                }




            });
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_NGDP_D/data.json", function(response) {


                var dates = response.dataset_data.data;
                inflationValues[0] = dates[4][1];
                for (var d = 5; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];

                    inflationValues[d - 4] = currentGDP;
                }




            });
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_GGXWDG_NGDP/data.json", function(response) {


                var dates = response.dataset_data.data;
                debtValues[0] = dates[4][1];
                for (var d = 5; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];

                    debtValues[d - 4] = currentGDP;
                }

                for (var i = 0; i < json.length; i++) {
                    if (json[i].iso.value == countryCode) {
                        $(".results").html("<img class='banda' src='"+json[i].image.value+"'></img>" + "<br /><br />" + json[i].hgovernmentLabel.value);
                    }
                }


            });
        });
    });
});