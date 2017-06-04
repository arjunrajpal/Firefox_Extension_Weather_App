/**
 * Created by arjunrajpal on 04/06/17.
 */

var count = 0;
var cityList = [];
var c = "";

$(document).ready(function () {

    function removeCity(cityName) {

        return function () {
            var name = cityName.replace(/["'` ]/g,'_');
            $('#weather_' + name).remove();
            var temp = []
            for (var i = 0; i < cityList.length; i++)
                if (cityList[i] != cityName) {
                    temp.push(cityList[i]);
                }

            cityList = temp;

        }

    }

    function callback(i) {
        return function () {
            addCity(cities[i].name);
        }
    }

    var tobeCloned = $('#Hurzuf').clone();
    $('#Hurzuf').click(callback(0));

    for (var i = 1; i < 100; i++) {
        var name = cities[i].name.replace(/["' ]/g,'_');
        var clone = tobeCloned.clone();
        clone.attr('id', name);
        clone.click(callback(i));
        clone.find('a').html(cities[i].name + ',' + cities[i].country);
        clone.appendTo('#dropdown-cities');

    }

    function addCity(cityName) {

        if(cityList.length == 5)
        {
            // $('.modal-body').html("Maximum 5 cities allowed, Please remove a city !");
            // $('#myModal').modal();
            return;
        }

        var location = cityName;
        var found = 0;

        var position = cityList.indexOf(location);

        if (position == -1) {
            for (var i = 0; i < cities.length; i++)
                if (cities[i].name == location) {
                    cityList.push(cities[i].name);
                    found = 1;
                    break;
                }
        }
        else {
            $('.modal-body').html("City already added");
            $('#myModal').modal();
        }

        if (position == -1) {
            if (found == 1) {

                $.ajax({

                    url: 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(cities[i].name) + ',' + cities[i].country.toLowerCase() + '&appid=099115cd6bb8889ca32bd0fe8ebc3bce',
                    success: function (message) {

                        var flag = "http://openweathermap.org/images/flags/" + encodeURIComponent(message.sys.country.toLowerCase()) + ".png";
                        var weather_icon = "http://openweathermap.org/img/w/" + encodeURIComponent(message.weather[0].icon) + ".png";
                        var cloud_type = message.weather[0].description;
                        var temp = Math.round(10 * (message.main.temp - 273.15)) / 10;
                        var tmin = Math.round(10 * (message.main.temp_min - 273.15)) / 10;
                        var tmax = Math.round(10 * (message.main.temp_max - 273.15)) / 10;
                        var gust = message.wind.speed;
                        var pressure = message.main.pressure;
                        var cloud = message.clouds.all;

                        var name = cities[i].name.replace(/["' ]/g,'_');

                        if (count == 0) {
                            c = $('#city_row').clone();
                            $('#city_row').attr('id', 'weather_' + name);
                            $('#weather_' + name).css('visibility', 'visible');
                            $('#weather_' + name).find('#location').html(location);
                            $('#weather_' + name).find('#weather_icon').attr('src', weather_icon);
                            $('#weather_' + name).find('#flag_icon').attr('src', flag);
                            $('#weather_' + name).find('i').html(cloud_type);
                            $('#weather_' + name).find('.badge badge-info').html(temp + "°С ");
                            $('#weather_' + name).find('p').html("<span class='badge badge-info'>" + temp + "°С </span>temperature from " + tmin + " to " + tmax + "°С, wind " + gust + "m/s. clouds " + cloud + "%, " + pressure + "hpa");
                            $('#weather_' + name).find('button').attr('id', 'close_' + name);
                            $('#close_' + name).on('click',removeCity(cityName));
                            $('#weather_' + name).appendTo('#weather_city_tables');

                            count++;
                        }
                        else {
                            var clone = c.clone();
                            clone.attr('id', 'weather_' + name);
                            clone.css('visibility', 'visible');
                            clone.find('#location').html(location);
                            clone.find('#weather_icon').attr('src', weather_icon);
                            clone.find('#flag_icon').attr('src', flag);
                            clone.find('i').html(cloud_type);
                            clone.find('.badge badge-info').html(temp + "°С ");
                            clone.find('p').html("<span class='badge badge-info'>" + temp + "°С </span>temperature from " + tmin + " to " + tmax + "°С, wind " + gust + "m/s. clouds " + cloud + "%, " + pressure + "hpa");
                            clone.find('button').attr('id', 'close_' + name).on('click',removeCity(cityName));
                            clone.appendTo('#weather_city_tables');

                        }
                    }
                });
            }
            else {
                $('.modal-body').html("City not found");
                $('#myModal').modal();
            }
        }

    }

});
