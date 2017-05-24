angular.module('starter.controllers', ['ui-leaflet', 'ngCordova', 'ng-echarts'])

  .controller('MapCtrl', function ($scope, $ionicModal, $cordovaGeolocation, $http, $timeout, leafletData, PlaceService) {
    angular.extend($scope, {
      center: {
        lat: 16.426,
        lng: 99.760,
        zoom: 7
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
            visible: true,
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
            visible: true,
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

    // get lat lon
    leafletData.getMap().then(function (map) {
      map.on('click', function (e) {
        console.log("Latitude : " + e.latlng.lat + " Longitude :  " + e.latlng.lng);
      });
    });

    // geolocation
    $scope.locate = function () {
      $cordovaGeolocation
        .getCurrentPosition()
        .then(function (position) {
          $scope.center.lat = position.coords.latitude;
          $scope.center.lng = position.coords.longitude;
          $scope.center.zoom = 15;

          $scope.markers.now = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            message: "You Are Here",
            focus: true,
            draggable: true
          };

        }, function (err) {
          // error
          console.log("Location error!");
          console.log(err);
        });
    };

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

  .controller('ChatsCtrl', function ($scope, $ionicLoading, Chats, RainCurrentWeekService) {

    $scope.loadRainCurrentWeek = function () {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> <br/> กำลังโหลดข้อมูล...'
      });
      RainCurrentWeekService.loadRainCurrentWeek()
        .success(function (response) {
          $scope.rainCurrentWeek = response;
          //console.log(data);  
          $ionicLoading.hide();
        })
        .error(function (error) {
          console.error("error");
        })
    };

    $scope.loadRainCurrentWeek();

    //$scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };

    $scope.getAddress = function (tam, amp, prov) {
      RainCurrentWeekService.selectedAddress = {
        tam: tam,
        amp: amp,
        prov: prov
      }
    }

  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, $ionicLoading, $http, $timeout, leafletData, ChartService, RainCurrentWeekService, ) {

    //console.log(tamcode);
    $scope.address = RainCurrentWeekService.selectedAddress;

    // map
    angular.extend($scope, {
      center: {
        //lat: 16.426,
        //lng: 99.760,
        //zoom: 7
      },
      markers: {
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
            visible: true,
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
            visible: true,
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

    // get date
    $scope.ndate = new Date();

    // load rain data
    $scope.rainNow = [];
    $scope.rain30y = [];
    $scope.chartSer = [];

    $scope.loadRain = function (place, code) {
      // load rain now
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> <br/> กำลังโหลดข้อมูล...'
      });
      ChartService.loadRNow(place, code)
        .success(function (response) {
          for (var prop in response[0]) {
            for (var i = 1; i <= 52; i++) {
              var w = 'w' + i;
              if (prop == w) {

                $scope.chartSer.push(prop);

                if (Number(response[0][prop]) >= 0) {
                  $scope.rainNow.push((Number(response[0][prop])).toFixed(2));
                  //console.log('ok');
                } else {
                  $scope.rainNow.push(null);
                  //console.log('null')
                }
              }
            }
          }

          //load map    
          $scope.featureSelection('alr:ln9p_tam', 'tam_code', $stateParams.chatId);
   
          $ionicLoading.hide();
        })
        .error(function (error) {
          console.error("error");
        });

      ChartService.loadR30y(place, code)
        .success(function (response) {
          for (var prop in response[0]) {
            for (var i = 1; i <= 52; i++) {
              var w = 'w' + i;
              if (prop == w) {
                if (Number(response[0][prop]) >= 0) {
                  $scope.rain30y.push((Number(response[0][prop])).toFixed(2));
                  //console.log('ok');
                } else {
                  $scope.rain30y.push(null);
                  //console.log('null')
                }
              }
            }
          }
        })
        .error(function (error) {
          console.error("error");
        });
    };

    $scope.loadRain('tambon', $stateParams.chatId);

    $scope.loadRainCurrent = function (type, tamcode) {
      RainCurrentWeekService.loadRainCurrent("sum", tamcode)
        .success(function (response) {
          $scope.sumRain = response;
        })
        .error(function (error) {
          console.error("error");
        })

      RainCurrentWeekService.loadRainCurrent("current", tamcode)
        .success(function (response) {
          $scope.currentRain = response;
        })
        .error(function (error) {
          console.error("error");
        })
    }

    $scope.rainCurrentWeekd = $scope.loadRainCurrent('sum', $stateParams.chatId);
    //console.log($scope.rainCurrentWeekd);

    //ng-echarts
    function onClick(params) {
      console.log(params);
    };
    var series1 = "น้ำฝนปัจจุบัน";
    var series2 = "น้ำฝนเฉลี่ย 10 ปี";

    $scope.lineConfig = {
      theme: 'default',
      event: [{ click: onClick }],
      dataLoaded: true
    };

    $scope.lineOption = {
      title: {
        text: 'น้ำฝน',
        subtext: 'มม.'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: [series1, series2]
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          // dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          //restore: { show: true },
          // saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: $scope.chartSer,
        }
      ],
      yAxis: [
        {
          type: 'value',
          //axisLabel: {formatter: '{value} °C'}
        }
      ],
      series: [
        {
          name: series1,
          type: 'line',
          data: $scope.rainNow,  //[11, 11, 15, 13, 12, 13, 10],
          markPoint: {
            data: [
              { type: 'max', name: 'max' },
              { type: 'min', name: 'min' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'average' }
            ]
          }
        },
        {
          name: series2,
          type: 'line',
          data: $scope.rain30y, //[1, -2, 2, 5, 3, 2, 0],
          markPoint: {
            data: [
              { name: 'name sr2', value: -2, xAxis: 1, yAxis: -1.5 }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'av' }
            ]
          }
        }
      ]
    };

    


  })


  .controller('StatCtrl', function ($scope, $interval, $timeout, ChartService) {
    $scope.settings = {
      enableFriends: true
    };

    // load rain data
    $scope.rainNow = [];
    $scope.rain30y = [];
    $scope.chartSer = [];

    $scope.loadRain = function (place, code) {
      // load rain now
      ChartService.loadRNow(place, code)
        .success(function (data) {
          for (var prop in data[0]) {
            for (var i = 1; i <= 52; i++) {
              var w = 'w' + i;
              if (prop == w) {

                $scope.chartSer.push(prop);

                if (Number(data[0][prop]) >= 0) {
                  $scope.rainNow.push((Number(data[0][prop])).toFixed(2));
                  //console.log('ok');
                } else {
                  $scope.rainNow.push(null);
                  //console.log('null')
                }
              }
            }
          }
        })
        .error(function (error) {
          console.error("error");
        });

      ChartService.loadR30y(place, code)
        .success(function (data) {
          for (var prop in data[0]) {
            for (var i = 1; i <= 52; i++) {
              var w = 'w' + i;
              if (prop == w) {
                if (Number(data[0][prop]) >= 0) {
                  $scope.rain30y.push((Number(data[0][prop])).toFixed(2));
                  //console.log('ok');
                } else {
                  $scope.rain30y.push(null);
                  //console.log('null')
                }
              }
            }
          }
        })
        .error(function (error) {
          console.error("error");
        });
    };

    $scope.loadRain('province', '53');

    //ng-echarts
    function onClick(params) {
      console.log(params);
    };

    $scope.lineConfig = {
      theme: 'default',
      event: [{ click: onClick }],
      dataLoaded: true
    };

    $scope.lineOption = {
      title: {
        text: 'title',
        subtext: 'subtext'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['series1', 'series2']
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          // dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          // saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: $scope.chartSer, //['A', 'B', 'C', 'D', 'E', 'F', 'G']
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            //formatter: '{value} °C'
          }
        }
      ],
      series: [
        {
          name: 'series1',
          type: 'line',
          data: $scope.rainNow,  //[11, 11, 15, 13, 12, 13, 10],
          markPoint: {
            data: [
              { type: 'max', name: 'max' },
              { type: 'min', name: 'min' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'average' }
            ]
          }
        },
        {
          name: 'series2',
          type: 'line',
          data: $scope.rain30y, //[1, -2, 2, 5, 3, 2, 0],
          markPoint: {
            data: [
              { name: 'name sr2', value: -2, xAxis: 1, yAxis: -1.5 }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'av' }
            ]
          }
        }
      ]
    };


  });
