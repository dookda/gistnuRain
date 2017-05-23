angular.module('starter.services', [])
.service('PlaceService', function($http) {
    return {
        getLocation: function(place,code) {
            var pdata = 'http://map.nu.ac.th/rain-api/index.php/location/'+place+'/'+code;
            return $http.get(pdata);
        },
        getProv: function() {
            var pdata = 'http://map.nu.ac.th/rain-api/index.php/prov';
            return $http.get(pdata);
        },
        getAmp: function(pcode) {
            var adata = 'http://map.nu.ac.th/rain-api/index.php/amp/' + pcode;
            return $http.get(adata);
        },
        getTam: function(acode) {
            var tdata = 'http://map.nu.ac.th/rain-api/index.php/tam/' + acode;
            return $http.get(tdata);
        },
        getVill: function(tcode) {
            var vdata = 'http://map.nu.ac.th/rain-api/index.php/vill/' + tcode;
            return $http.get(vdata);
        },
        getRawang: function(plang,rawang) {
            var pdata = 'http://map.nu.ac.th/rain-api/index.php/rawang/'+plang+'/'+rawang;
            return $http.get(pdata);
        }
    }
})

.service('ChartService', function($http){
  return{
    selectedLocation:{}, 
    selectedParcel:{},
    //endPointUrl: 'http://localhost/myapi/news',
    //endPointUrl: alrMap,
    loadRainNow: function(tamcode){
        var rainNow ='http://map.nu.ac.th/rain-api/index.php/rain_now/'+tamcode;                    
        return $http.get(rainNow);
    },
    loadRain30y: function(tamcode){
        var rain30y ='http://map.nu.ac.th/rain-api/index.php/rain30y/'+tamcode;                    
        return $http.get(rain30y);
    },
    loadEvap30y: function(tamcode){
        var evap30y ='http://map.nu.ac.th/rain-api/index.php/evap30y/'+tamcode;                    
        return $http.get(evap30y);
    },
    loadRNow: function(place, code){
        var rain ='http://map.nu.ac.th/rain-api/index.php/RNow/'+place+'/'+code;                    
        return $http.get(rain);
    },
    loadR30y: function(place, code){
        var rain ='http://map.nu.ac.th/rain-api/index.php/R30y/'+place+'/'+code;                    
        return $http.get(rain);
    }    
  }
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
