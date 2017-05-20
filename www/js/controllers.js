angular.module('starter.controllers', ['ui-leaflet'])

  .controller('DashCtrl', function ($scope, $ionicModal, $http, $timeout, leafletData, PlaceService) {
    angular.extend($scope, {
      center: {
        lat: 15.026,
        lng: 100.260,
        zoom: 6
      },
      markers: {
        taipei: {
          lat: 25.0391667,
          lng: 121.525,
        }
      },
      layers: {
        baselayers: {
          cycle: {
            name: 'OpenCycleMap',
            type: 'xyz',
            url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true
            }
          },
          osm: {
            name: 'OpenStreetMap',
            type: 'xyz',
            url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            layerOptions: {
              subdomains: ['a', 'b', 'c'],
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              continuousWorld: true
            }
          },
          imagery: {
            name: "Imagery",
            type: "agsBase",
            layer: "Imagery",
            visible: false
          }
        },
        overlays: {
          navigation: {
            name: "World Navigation Charts",
            type: "agsTiled",
            url: "http://services.arcgisonline.com/ArcGIS/rest/services/Specialty/World_Navigation_Charts/MapServer",
            visible: false,
            zIndex: 1
          },

          weather: {
            name: "test",
            type: "wms",
            visible: false,
            url: "http://idpgis.ncep.noaa.gov/arcgis/services/NWS_Observations/radar_base_reflectivity/MapServer/WmsServer",
            layerOptions: {
					            layers: [1],
				                opacity: 1,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        },
            zIndex: 1
          },

          weather2: {
            name: "weather2",
            type: "wms",
            visible: false,
            url: "http://idpgis.ncep.noaa.gov/arcgis/services/NWS_Climate_Outlooks/cpc_6_10_day_outlk/MapServer/WmsServer",
            layerOptions: {
					            layers: [1],
				                opacity: 1,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        },
            zIndex: 1
          },

          landsat8: {
            name: "landsat",
            type: "wms",
            visible: false,
            url: "ionic",
            layerOptions: {
					            layers: [0],
				                opacity: 1,
				                attribution: "Copyright:© 2014 Esri, DeLorme, HERE, TomTom"
					        },
            zIndex: 1
          },

          rainwms: {
            name: 'ปริมาณน้ำฝนรายวัน',
            type: 'wms',
            visible: true,
            url: 'http://map.nu.ac.th/gs-alr2/ows?',
            layerParams: {
              layers: 'alrmap:rainsplinegrid',
              format: 'image/png',
              transparent: true,
              zIndex: 2
            }
          },
          province: {
            name: 'ขอบเขตจังหวัด',
            type: 'wms',
            visible: true,
            url: 'http://map.nu.ac.th/gs-alr2/ows?',
            layerParams: {
              layers: 'alr:ln9p_prov',
              format: 'image/png',
              transparent: true,
              zIndex: 3
            }
          },
          amphoe: {
            name: 'ขอบเขตอำเภอ',
            type: 'wms',
            visible: false,
            url: 'http://map.nu.ac.th/gs-alr2/ows?',
            layerParams: {
              layers: 'alr:ln9p_amp',
              format: 'image/png',
              transparent: true,
              zIndex: 4
            }
          },
          tambon: {
            name: 'ขอบเขตตำบล',
            type: 'wms',
            visible: false,
            url: 'http://map.nu.ac.th/gs-alr2/ows?',
            layerParams: {
              layers: 'alr:ln9p_tam',
              format: 'image/png',
              transparent: true,
              zIndex: 5
            }
          },
          village: {
            name: 'หมู่บ้าน',
            type: 'wms',
            visible: false,
            url: 'http://map.nu.ac.th/gs-alr2/ows?',
            layerParams: {
              layers: 'alr:ln9p_vill',
              format: 'image/png',
              transparent: true,
              zIndex: 6
            }
          }

        }
      }
    });

    // fix baselayers change
    $scope.$on('leafletDirectiveMap.baselayerchange', function (ev, layer) {
      console.log('base layer changed to %s', layer.leafletEvent.name);
      angular.forEach($scope.layers.overlays, function (overlay) {
        if (overlay.visible) overlay.doRefresh = true;
      });
    });

    // modal
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };
    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });


    // get everything
    $scope.dat = {
      prov: '',
      amp: '',
      tam: '',
      vill: ''
    };

    $scope.getProv = function () {
      PlaceService.getProv()
        .then(function (response) {
          $scope.province = response.data;
        })
    };
    $scope.getProv();

    $scope.getAmp = function () {
      PlaceService.getAmp($scope.dat.prov)
        .then(function (response) {
          $scope.amphoe = response.data;
          $scope.tambon = [];
          $scope.village = [];
          $scope.featureSelection('alr:ln9p_prov', 'prov_code', $scope.dat.prov);
        });
      // $scope.findLocation("province", $scope.dat.prov);
    };

    $scope.getTam = function () {
      PlaceService.getTam($scope.dat.amp)
        .then(function (response) {
          $scope.tambon = response.data;
          $scope.village = [];
          $scope.featureSelection('alr:ln9p_amp', 'amp_code', $scope.dat.amp);
        });
      // $scope.findLocation("amphoe", $scope.dat.amp);
    };

    $scope.getVill = function () {
      PlaceService.getVill($scope.dat.tam)
        .then(function (response) {
          $scope.village = response.data;
          $scope.featureSelection('alr:ln9p_tam', 'tam_code', $scope.dat.tam);
        })
      // $scope.findLocation("tambon", $scope.dat.tam);
    };

    $scope.getVillLocation = function () {
      //$scope.featureSelection('alr:ln9p_vill', 'vill_code', $scope.dat.vill);
      //$scope.findLocation("village", $scope.dat.vill);
      $scope.changeLocation('36.8899:-121.8008:12');
      console.log($scope.dat.vill);
    };


    $scope.findLocation = function (xplace, xcode) {
      PlaceService.getLocation(xplace, xcode)
        .then(function (response) {
          $scope.center = {
            lat: response.data[0].c_y,
            lng: response.data[0].c_x,
            zoom: 22
          };


          console.log(response.data[0].vill_code);

        })
      // $scope.init();
    };


    //update select feature
    $scope.centerJSON = function () {
      leafletData.getMap().then(function (map) {
        var latlngs = [];
        for (var i in $scope.geojson.data.features[0].geometry.coordinates) {
          var coord = $scope.geojson.data.features[0].geometry.coordinates[i];
          for (var j in coord) {
            var points = coord[j];
            for (var k in points) {
              latlngs.push(L.GeoJSON.coordsToLatLng(points[k]));
            }
          }
        }
        map.fitBounds(latlngs);
      });
    };

    $scope.featureSelection = function (layer, field, code) {
      $http.get('http://map.nu.ac.th/gs-alr2/ows?' +
        'service=WFS&version=1.0.0' +
        '&request=GetFeature' +
        '&typeName=' + layer +
        '&CQL_FILTER=' + field + '=%27' + code + '%27' +
        '&outputFormat=application%2Fjson')
        .then(function (data, status) {
          angular.extend($scope, {
            geojson: {
              data: data.data,
              style: {
                fillColor: "red",
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
              }
            }
          });
        });

      $timeout(function () {
        $scope.centerJSON();
        //console.log($scope.geojson);
      }, 1400);

      // $scope.centerJSON();
    };






  }) // end controller

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });
