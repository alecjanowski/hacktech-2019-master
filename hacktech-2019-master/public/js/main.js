$(document).ready(function() {
    $.get('/api/results', function(response) {
        var json = JSON.parse(response).bindings;
        var countryOptions = {};
        var gdpValues = [];
        var debtValues = [];
        var inflationValues = [];
        var unemploymentValues = [];

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
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_LUR/data.json", function(response) {


                var dates = response.dataset_data.data;
                for (var d = 0; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];
                }




            });
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_PPPGDP/data.json", function(response) {


                var dates = response.dataset_data.data;
                for (var d = 0; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];
                }




            });
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_NGDP_D/data.json", function(response) {


                var dates = response.dataset_data.data;
                for (var d = 0; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];
                }




            });
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_GGXWDG_NGDP/data.json", function(response) {


                var dates = response.dataset_data.data;
                for (var d = 0; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];
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