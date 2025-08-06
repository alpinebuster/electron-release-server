angular.module('app', [
    'app.core',
    'app.admin',
    'app.home',
    'app.releases'
  ])
  .config(['$routeProvider', '$locationProvider', 'NotificationProvider',
    function($routeProvider, $locationProvider, NotificationProvider) {
      $routeProvider.otherwise({
        redirectTo: '/home'
      });

      // Use the HTML5 History API
      $locationProvider.html5Mode(true);

      NotificationProvider.setOptions({
        positionX: 'left',
        positionY: 'bottom'
      });
    }
  ])
  .run(['editableOptions', 'editableThemes',
    function(editableOptions, editableThemes) {
      editableThemes.bs3.inputClass = 'input-sm';
      editableThemes.bs3.buttonsClass = 'btn-sm';
      editableThemes.bs3.controlsTpl = '<div class="editable-controls"></div>';
      editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'


      ///
      var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
      
      function applyTheme(e) {
        if (e.matches) {
          const existing_dark = document.getElementById('dark-theme');
          if (existing_dark) existing_dark.remove();

          const existing_light = document.getElementById('light-theme');
          if (existing_light) return;
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '/styles/importer-light.scss';
          link.id = 'light-theme';
          document.head.appendChild(link);
        } else {
          const existing_light = document.getElementById('light-theme');
          if (existing_light) existing_light.remove();

          const existing_dark = document.getElementById('dark-theme');
          if (existing_dark) return;
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '/styles/importer.scss';
          link.id = 'dark-theme';
          document.head.appendChild(link);
        }
      }

      applyTheme(prefersLight);

      if (prefersLight.addEventListener) {
        prefersLight.addEventListener('change', applyTheme);
      } else if (prefersLight.addListener) {
        // Safari fallback
        prefersLight.addListener(applyTheme);
      }
      ///
    }
  ])
  .controller('MainController', ['$scope', 'AuthService',
    function($scope, AuthService) {
      $scope.isAuthenticated = AuthService.isAuthenticated;
    }
  ]);
