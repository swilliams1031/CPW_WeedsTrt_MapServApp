document.addEventListener('DOMContentLoaded', function() {
    /*    Put all of the ArcGIS API stuff in here.  This is what makes the map work.    */

    //ESRI modules to make API features function
    require([
        "dojo/parser",
        "dojo/ready",
        "esri/layers/FeatureLayer",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/dom",
        "esri/map",
        "esri/urlUtils",
        "esri/arcgis/utils",
        "esri/dijit/Legend",
        "esri/dijit/Scalebar",
        "esri/dijit/BasemapGallery",
        "dojo/domReady!"
    ], 
            function (
            parser,
             ready,
             FeatureLayer,
             BorderContainer,
             ContentPane,
             dom,
             Map,
             urlUtils,
             arcgisUtils,
             Legend,
             Scalebar,
             BasemapGallery
            ) 
            {ready(function () {

                parser.parse();

                //if accessing webmap from a portal outside of ArcGIS Online, uncomment and replace path with portal URL
                //arcgisUtils.arcgisUrl = "https://pathto/portal/sharing/content/items";
                arcgisUtils.createMap("8809446956814e65993a7295b328b706", "map").then(function (response) {
                    //update the app
                    dom.byId("title").innerHTML = response.itemInfo.item.title;
                    dom.byId("subtitle").innerHTML = response.itemInfo.item.snippet;

                    var map = response.map;
                    /* //Could have added additional layers independently, but this would make the client work and made sybolizing more difficult more so it was done in the map service instead.

                    var cpwParkRoads = new FeatureLayer("https://services5.arcgis.com/ttNGmDvKQA7oeDQ3/ArcGIS/rest/services/CPWAdminData/FeatureServer/1", {
                    outFields: ["*"],
                    minScale: 100000
                    });
                    map.addLayer(cpwParkRoads);*/


                    //add the scalebar
                    var scalebar = new Scalebar({
                        map: map,
                        scalebarStyle: "ruler",
                        scalebarUnit: "english"
                    }, dojo.byId("scalebar"));

                    //add the legend. Note that we use the utility method getLegendLayers to get
                    //the layers to display in the legend from the createMap response.
                    var legendLayers = arcgisUtils.getLegendLayers(response);
                    var legendDijit = new Legend({
                        map: map,
                        layerInfos: legendLayers
                    }, "legend");
                    legendDijit.startup();

                    //add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
                    var basemapGallery = new BasemapGallery({
                        showArcGISBasemaps: true,
                        map: map
                    }, "basemapGallery");
                    basemapGallery.startup();

                    basemapGallery.on("error", function(msg) {
                        console.log("basemap gallery error:  ", msg);
                    });


                });



            });

            });
});