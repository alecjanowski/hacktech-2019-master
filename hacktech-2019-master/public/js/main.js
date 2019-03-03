$(document).ready(function() {
    function stddev(array) {
        var STDEV = 0.0, sum = 0.0, n = array.length, i = 0, x = 0.0;

        while(i < n){
            sum += array[i];
            i++;
        }
        console.log("Sum: " + sum);
        var mean= sum/i;

        for (i = 0; i < n; i++){
            x += Math.pow((array[i] - mean), 2);
        }

        STDEV = Math.sqrt(x/n);
        return STDEV;
    }
    function math(gdpValues, inflationValues, unemploymentValues, debtValues, gdpCurrent) {
        var stdev_gdpchange = stddev(gdpValues);
        console.log("Standard Dev GDP: " + stdev_gdpchange);
        var stdev_inflation = stddev(inflationValues);
        console.log("Standard Dev GDP: " + stdev_inflation);

        var stdev_unemployment = stddev(unemploymentValues);
        console.log("Standard Dev GDP: " + stdev_unemployment);

        var stdev_defgdp = stddev(debtValues);
        console.log("Standard Dev GDP: " + stdev_defgdp);


        var infRate = inflationValues[0];
        console.log("INFLATTTTTTTTTTTTTION: " + infRate);
        var unmRate = unemploymentValues[0];
        console.log("NEXXXXXXXXXXXXTTTTTTTT: " + unmRate);

        var gdpRate = gdpValues[0];
        console.log("NEXTTTTTTTTTTTTTT: " + gdpRate);

        var deficit = debtValues[0];
        console.log("NEXTNEXT: " + deficit);


        var avgstdev = (stdev_gdpchange + stdev_inflation + stdev_unemployment + stdev_defgdp)/4.0;
        console.log("Standard Dev AVG: " + avgstdev);


        //Part 1 calculates weights for each factor

        var wgdp= avgstdev/stdev_gdpchange;
        console.log("Standard Dev WGDP: " + wgdp);

        var winf= avgstdev/stdev_inflation;
        console.log("Standard Dev WINF: " + winf);

        var wunm= avgstdev/stdev_unemployment;
        console.log("Standard Dev WUNM: " + wunm);

        var wdef= avgstdev/stdev_defgdp;
        console.log("Standard Dev WDEF: " + wdef);


        //Part 2 calculates the Weighted EPI for the country

        const wEPI = (100.0 - (winf*(infRate)) - (wunm*(unmRate - 4.75)) - (wdef*((deficit/gdpCurrent)*100.0)) + (wgdp*(gdpRate - 4.75)));
        console.log(winf + "%%%%%%%%" + infRate + "%%%%%%%%%%" + wunm + "%%%%%%%%%" + unmRate + "%%%%%%%%%%%" + wdef + "%%%%%%%" + deficit + "%%%%%%%%" + gdpCurrent + "%%%%%%%%%%%%%%" + wgdp + "%%%%%" + gdpRate);
        console.log(wEPI);


        //Part 3 calculates letter grades based on weighted EPI for the country
        if(wEPI>= 99.0){
            return "A+";
        }
        if (96.0<=wEPI && wEPI<99.0){
            return "A";
        }
        if (95.0<= wEPI && wEPI < 96.0){
            return "A-";
        }
        if (94.0<= wEPI && wEPI < 95.0){
            return "B+";
        }
        if (91.0<= wEPI && wEPI < 94.0){
            return "B";
        }
        if (90.0<= wEPI && wEPI < 91.0){
            return "B-";
        }
        if (87.0<= wEPI && wEPI < 90.0){
            return "C+";
        }
        if (83.0<= wEPI && wEPI < 87.0){
            return "C";
        }
        if (80.0<= wEPI && wEPI < 83.0){
            return "C-";
        }
        if (74.0<= wEPI && wEPI < 80.0){
            return "D+";
        }
        if (66.0<= wEPI && wEPI < 74.0){
            return "D";
        }
        if (60.0<= wEPI && wEPI < 66.0){
            return "D-";
        }
        if (wEPI < 60.0){
            return "Fail";
        }
    }

    $.get('/api/results', function(response) {
        var json = JSON.parse(response).bindings;
        var countryOptions = {};
        var gdpValues = [];
        var debtValues = [];
        var inflationValues = [];
        var unemploymentValues = [];
        var gdpCurrent = 0;

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
            $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_LUR/data.json?api_key=e7Fsxgoafnmxyr2yXxdu", function(response) {


                var dates = response.dataset_data.data;
                unemploymentValues[0] = dates[4][1];
                for (var d = 5; d < dates.length; d++) {
                    var currentDate = dates[d][0];
                    var currentGDP = dates[d][1];

                    unemploymentValues[d - 4] = currentGDP;
                }


                $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_PPPGDP/data.json?api_key=e7Fsxgoafnmxyr2yXxdu", function(response) {


                    var dates = response.dataset_data.data;
                    var gdpRawValues = [];
                    var gdpTemp = [];
                    gdpTemp[0] = 0;
                    gdpRawValues[0] = dates[4][1];
                    for (var d = 5; d < dates.length; d++) {
                        var currentDate = dates[d][0];
                        var currentGDP = dates[d][1];

                        if(currentDate.substr(0, 4) >= startTimes[countryCode].substr(0, 4) - 1) {
                            gdpRawValues[d - 4] = currentGDP;
                        }
                    }

                    for (var i = 0; i < gdpRawValues.length - 1; i++) {
                        gdpTemp[i] = (gdpRawValues[i] - gdpRawValues[i + 1]) / gdpRawValues[i + 1]
                    }
                    gdpTemp[gdpRawValues.length - 1] = 0;
                    gdpCurrent = gdpRawValues[0];
                    gdpValues = gdpTemp;
                    console.log(gdpValues);

                    $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_PCPIPCH/data.json?api_key=e7Fsxgoafnmxyr2yXxdu", function(response) {


                        var dates = response.dataset_data.data;
                        inflationValues[0] = dates[4][1];
                        for (var d = 5; d < dates.length; d++) {
                            var currentDate = dates[d][0];
                            var currentGDP = dates[d][1];

                            if(currentDate.substr(0, 4) >= startTimes[countryCode].substr(0, 4) - 1) {
                                inflationValues[d - 4] = currentGDP;
                            }

                            console.log("The Values We Need: " + inflationValues);
                        }


                        $.get("https://www.quandl.com/api/v3/datasets/ODA/" + countryCode + "_GGXWDG_NGDP/data.json?api_key=e7Fsxgoafnmxyr2yXxdu", function(response) {


                            var dates = response.dataset_data.data;
                            debtValues[0] = dates[4][1];
                            for (var d = 5; d < dates.length; d++) {
                                var currentDate = dates[d][0];
                                var currentGDP = dates[d][1];

                                if(currentDate.substr(0, 4) >= startTimes[countryCode].substr(0, 4) - 1) {
                                    debtValues[d - 4] = currentGDP;
                                }
                            }

                            console.log("GDPPPPPPPPPPPPPPPPPPP:" + gdpValues);
                            math(gdpValues, inflationValues, unemploymentValues, debtValues, gdpCurrent);

                            for (var i = 0; i < json.length; i++) {
                                if (json[i].iso.value == countryCode) {
                                    $(".results").html("<img class='banda' src='"+json[i].image.value+"'></img>" + "<br /><br />" + json[i].hgovernmentLabel.value);
                                }
                            }


                        });




                    });


                });


            });


        });
    });
});