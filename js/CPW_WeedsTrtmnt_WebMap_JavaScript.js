document.addEventListener('DOMContentLoaded', function() {
    /*    Put all of the ArcGIS API stuff in here.  This is what makes the map work.    */

    //ESRI modules to make API features function
    require([
        "dojo/ready",
        "dojo/parser",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dojo/_base/array",
        "dojo/dom",
        "esri/urlUtils",
        "esri/arcgis/utils",
        "esri/map",
        "esri/layers/FeatureLayer",
        "esri/dijit/LayerList",
        "esri/dijit/Scalebar",
        "esri/dijit/BasemapGallery",
        "esri/dijit/HomeButton",
        "esri/dijit/Search", 
        "esri/InfoTemplate",
        "dojo/domReady!"
    ], 
            /////////Call all of the module functionality
            function (
            ready,
             parser,
             BorderContainer,
             ContentPane,
             array,
             dom,
             urlUtils,
             arcgisUtils,
             Map,
             FeatureLayer,
             LayerList,
             Scalebar,
             BasemapGallery,
             HomeButton,
             Search,
             InfoTemplate
            ) 

            {ready(
                function () {

                    parser.parse();

                    /////////Add the ArcGIS Online map service 
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

                        /////////Add the scalebar
                        var scalebar = new Scalebar({
                            map: map,
                            scalebarStyle: "ruler",
                            scalebarUnit: "english"
                        }, dojo.byId("scalebar"));

                        /*/////////Add the legend. Note that we use the utility method getLegendLayers to get
                        //the layers to display in the legend from the createMap response.  
                        /*OPTED FOR LAYER LIST INSTEAD.  ADD MODULES TO USE LEGEND INSTEAD. --> "esri/dijit/Legend", --> Legend,
                        var legendLayers = arcgisUtils.getLegendLayers(response);
                        var legendDijit = new Legend({
                            map: map,
                            layerInfos: legendLayers
                        }, "legend");
                        legendDijit.startup();*/
                        
                        /////////Add the layer list to toggle layers and to in place of a legend.
                        var layerListLayers = arcgisUtils.getLayerList(response);
                        var layerList = new LayerList({
                            map: response.map,
                            layerInfos: layerListLayers,
                            showSubLayers: true, // optional, show sublayers for this layer. Defaults to the widget's 'showSubLayers' property.
                            showLegend: true, // optional, display a legend for the layer items.
                            layers: arcgisUtils.getLayerList(response)
                        },"layerList");
                        layerList.startup();

                        /*//Define new basemap layer for custom black and white imagery to aid colorblind users.  COULD NOT GET MAPBOX TILE LAYER TO PLAY NICE-WOULD NOT DISPLAY.  ABANDONED.

                        var bwBasemapLayer = new esri.dijit.BasemapLayer ({url:"https://api.mapbox.com/styles/v1/mwill521/cjgeoh0yi000y2rqdc5paen3h/wmts?access_token=pk.eyJ1IjoibXdpbGw1MjEiLCJhIjoiY2l3aXFocWdvMDAwNTJ5cGl4cmFxaHJncSJ9.7gTnojeo33J8UVg8vXi3hA"});

                        var bwBasemap = new esri.dijit.Basemap({
                            layers: [bwBasemapLayer],
                            title: "Black&White Satellite Image",
                            thumbnailUrl: "http://frccbcc.maps.arcgis.com/sharing/rest/content/items/734473baa5fa42788a5b10685ca5042d/data"//"images\Basemaps\bwBasemap_thumb.JPG"
                        });
                        //basemaps.push(bwBasemap);*/


                        /////////Add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
                        var basemapGallery = new BasemapGallery({
                            showArcGISBasemaps: true,
                            //basemaps: "oceans",
                            map: map
                        }, "basemapGallery");
                        // This will remove all the extraneous ArcGISBasemaps basemaps other than Imagery, Imagery with Labels, Streets, Topographic, USA Topo Maps, and the USGS National Map in the selector pane of the widgets
                        basemapGallery.on("load", function () {   
                            var baselayers = basemapGallery.basemaps.slice();
                            for (var i = 0; i < baselayers.length; i++) {
                                var layer = baselayers[i];
                                if (layer.title != "USGS National Map" &&layer.title != "USA Topo Maps" &&layer.title != "Imagery with Labels" &&layer.title != "Topographic" && layer.title != "Imagery" && layer.title != "Streets") {
                                    basemapGallery.remove(layer.id);
                                }} 
                        });

                        basemapGallery.startup();

                        basemapGallery.on("error", function(msg) {
                            console.log("basemap gallery error:  ", msg);
                        });

                        /////////Add the Home Button that returns to the original view.
                        var home = new HomeButton({
                            //theme: "HomeButton",
                            map: map
                        }, "homeButton");
                        home.startup();

                        /////////Add the search widget to allow for text search to lacate a desired park.
                        var search = new Search({
                            enableButtonMode: false,
                            enableHighlight: false,
                            sources: [],
                            map: map
                        }, "search");

                        //listen for the load event and set the source properties
                        search.on("load", function () {
                            var sources = search.sources;
                            sources.push({
                                featureLayer: new FeatureLayer ("https://services.arcgis.com/YseQBnl2jq0lrUV5/arcgis/rest/services/COParks_WeedTreat_Tracking/FeatureServer/3"),
                                placeholder: "Park Search",
                                enableLabel: false,
                                searchFields: ["PropName"],
                                displayField: "PropName",
                                exactMatch: false,
                                outFields: ["*"],
                            });
                            //Set the sources above to the search widget
                            search.set("sources", sources);
                        });
                        search.startup();

                    });
                });

            });
});