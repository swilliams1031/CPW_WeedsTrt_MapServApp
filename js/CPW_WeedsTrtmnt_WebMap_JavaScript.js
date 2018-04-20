document.addEventListener('DOMContentLoaded', function() {
    /*
    your code will go here
    this is the event callback function that is called when the document content has been loaded
    we need our map container to be ready before dropping our map in, for example
    *this is new as js bin takes care of this for you

    Put all of the ArcGIS API stuff in here.  This is what makes the map work.
    */

    require([
        "esri/map",
        "esri/dijit/InfoWindowLite",
        "esri/InfoTemplate",
        "esri/layers/FeatureLayer",
        "dojo/dom-construct",
        "dojo/domReady!"
    ],
            function(Map, 
                      InfoWindowLite,
                      InfoTemplate,
                      FeatureLayer,
                      domConstruct
                     ) 
            {

        var map = new Map("map", {
            basemap: "hybrid",
            center: [-105.7821, 39.5501],
            zoom: 7,
            showLabels : true
        });

        var weedTreatments = new FeatureLayer("https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/COParks_WeedTreat_Tracking/FeatureServer/1", {
            outFields: ["*"]
        });
        map.addLayer(weedTreatments);

        var parksPoints = new FeatureLayer("https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/COParks_WeedTreat_Tracking/FeatureServer/0", {
            outFields: ["*"]
        });    
        map.addLayer(parksPoints);

        var parksBoundaries = new FeatureLayer("https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/COParks_WeedTreat_Tracking/FeatureServer/3", {
            outFields: ["*"]
        });
        map.addLayer(parksBoundaries);

        var cpwParkRoads = new FeatureLayer("https://services5.arcgis.com/ttNGmDvKQA7oeDQ3/ArcGIS/rest/services/CPWAdminData/FeatureServer/1", {
            outFields: ["*"],
            minScale: 100000
        });
        map.addLayer(cpwParkRoads);

        var cpwParkTrails = new FeatureLayer("https://services5.arcgis.com/ttNGmDvKQA7oeDQ3/ArcGIS/rest/services/CPWAdminData/FeatureServer/2", {
            outFields: ["*"],
            minScale: 100000
        });
        map.addLayer(cpwParkTrails);

        var cpwFacilities = new FeatureLayer("https://services5.arcgis.com/ttNGmDvKQA7oeDQ3/ArcGIS/rest/services/CPWAdminData/FeatureServer/0", {
            outFields: ["*"],
            minScale: 100000
        });
        map.addLayer(cpwFacilities);

        var parkIndexGrids = new FeatureLayer("https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/COParks_WeedTreat_Tracking/FeatureServer/2", {
            outFields: ["*"]
        });
        map.addLayer(parkIndexGrids);



    });
});