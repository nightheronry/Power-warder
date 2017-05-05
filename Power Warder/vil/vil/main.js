$.ajaxSetup({async: false});

var map, cunli;

$.getJSON('vil.json', function (data) {
    PowerTW = data;
});
function initialize() {

    /*map setting*/
    $('#map-canvas').height(window.outerHeight /2 );

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: {lat: 25.0177365, lng: 121.5307542,}
    });

    $.getJSON('cunli.json', function (data) {
        cunli = map.data.addGeoJson(topojson.feature(data, data.objects.cunli));
    });

    var areas = [];
    cunli.forEach(function (value) {
        var V_Name = value.getProperty('V_Name'),
                countyN = value.getProperty('C_Name'),
                townN = value.getProperty('T_Name');
        PowerTW.forEach(function (val) {
            if(val.FIELD4.trim() === V_Name ){
                value.setProperty('pow', val.FIELD5);
            }
        })

        if(!areas[countyN]) {
            areas[countyN] = value.getProperty('C_Name');
        }
        if(!areas[townN]) {
            areas[townN] = value.getProperty('C_Name') + value.getProperty('T_Name');
        }
    });

    map.data.setStyle(function (feature) {
        color = ColorBar(feature.getProperty('pow'));
        return {
            fillColor: color,
            fillOpacity: 0.6,
            strokeColor: 'gray',
            strokeWeight: 1
        }
    });

    map.data.addListener('mouseover', function (event) {
        var Cunli = event.feature.getProperty('C_Name') + event.feature.getProperty('T_Name') + event.feature.getProperty('V_Name');
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {fillColor: 'white'});
        $('#content').html('<div>' + Cunli + ' ：' + event.feature.getProperty('pow') + ' 度</div>').removeClass('text-muted');
    });

    map.data.addListener('mouseout', function (event) {
        map.data.revertStyle();
        $('#content').html('在地圖上滑動或點選以顯示數據').addClass('text-muted');
    });

    map.data.addListener('click', function (event) {
        var Cunli = event.feature.getProperty('VILLAGE_ID');
        var CunliTitle = event.feature.getProperty('C_Name') + event.feature.getProperty('T_Name') + event.feature.getProperty('V_Name');
        if ($('#myTab a[name|="' + Cunli + '"]').tab('show').length === 0) {
            $('#myTab').append('<li><a name="' + Cunli + '" href="#' + Cunli + '" data-toggle="tab">' + CunliTitle +
                    '<button class="close" onclick="closeTab(this.parentNode)">×</button></a></li>');
            $('#myTabContent').append('<div class="tab-pane fade" id="' + Cunli + '"><div></div></div>');
            $('#myTab a:last').tab('show');
            createStockChart(Cunli, cunli);
            $('#myTab li a:last').click(function (e) {
                $(window).trigger('resize');
            });
        }
    });
}


function closeTab(node) {
    var nodename = node.name;
    node.parentNode.remove();
    $('#' + nodename).remove();
    $('#myTab a:first').tab('show');
}

google.maps.event.addDomListener(window, 'load', initialize);