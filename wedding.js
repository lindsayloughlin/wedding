google.maps.event.addDomListener(window, 'load', init);
function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,
        rotateControl: false,
        scrollwheel: false,        
        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(-37.7589655,145.0827501), // Heide 

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2e5d4"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]}]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('heidemap');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);

    // Let's also add a marker while we're at it
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(-37.7589655,145.0827501),
        map: map,
        title: 'Wedding at Heide'
    });
}

// code to do formsubmission

$(document).ready( function() {

    // Setup the url based on the window?
    var earlyout =  false;
    var submitUrl = "http://formspree.io/lindsayloughlin@gmail.com";
    if (earlyout) {
        submitUrl = "http://localhost:8080/rsvp";
    }

    function rsvpSuccess() {
        console.log('rsvpSuccess');
        $('#rsvpthanks').show();
        $('#submitrsvp').removeClass('rsvpbutton');
        $('#submitrsvp').addClass('rsvbsent');
        
        $('#submitrsvp').html('RSVP Sent');
        $('#submitrsvp').attr('disabled','disabled');

        // if ga has been defined 
        if (ga !== undefined) {
            var attenName = $("input[name='attendname']").val();
            var attendEmail = $("input[name='attendemail']").val();
            ga('send', 'event', 'RSVP', 'succes', attenName + attendEmail);
        }
    }

    function rsvpError(arg) {
         //console.log('rsvpError' + arg);
         $('#rsvpthanks').hide();
        $('#submitrsvp').removeClass('disabledbutton');
    }   
    $("#rsvpform").submit(function (e) {
        e.preventDefault();
        //console.log('submitclicked');
        $('#submitrsvp').addClass('disabledbutton');
        var jsonData = JSON.parse(JSON.stringify($('#rsvpform').serializeArray()));
        var messageStr = '';
        var formJson = {};
        for (var i =0; i < jsonData.length; ++i) {
            formJson[jsonData[i].name] = jsonData[i].value;
        }
        if (submitUrl.indexOf('localhost:8080') > -1) {
            console.log(formJson);
            rsvpSuccess();
            //console.log('early out because of localhost');
            return;
        }

        $.ajax({           
            url: submitUrl,
            method: 'POST',
            data: formJson,
            success: rsvpSuccess,
            error: rsvpError,
            dataType: 'json',
        });    
    });
});