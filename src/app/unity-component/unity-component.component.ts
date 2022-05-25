import { Component, OnInit } from '@angular/core';

declare function createUnityInstance(e,r,t): any;

@Component({
  selector: 'app-unity-component',
  templateUrl: './unity-component.component.html',
  styleUrls: ['./unity-component.component.scss'],
})
export class UnityComponentComponent implements OnInit {

  

  constructor() { 
    
  }

  ngOnInit() {
    let container = document.getElementById("unity-container");
    let canvas = document.getElementById("unity-canvas");
    let loadingBar = document.getElementById("unity-loading-bar");
    let progressBarFull = document.getElementById("unity-progress-bar-full");
    let fullscreenButton = document.getElementById("unity-fullscreen-button");
    let warningBanner = document.getElementById("unity-warning");

    function unityShowBanner(msg, type) {
      function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
      }
      var div = document.createElement('div');
      div.innerHTML = msg;
      warningBanner.appendChild(div);
      if (type == 'error') div.setAttribute('style', 'background: red; padding: 10px;');
      else {
        if (type == 'warning') div.setAttribute('style', 'background: yellow; padding: 10px;');
        setTimeout(function() {
          warningBanner.removeChild(div);
          updateBannerVisibility();
        }, 5000);
      }
      updateBannerVisibility();
    }

    var loaderUrl = '../../assets/js/buildteste.loader.js';
    var config = {
      dataUrl: '../../assets/js/buildteste.data.br',
      frameworkUrl: '../../assets/js/buildteste.framework.js.br',
      codeUrl: '../../assets/js/buildteste.wasm.br',
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "NexusBoard",
      productVersion: "1.0",
      showBanner: unityShowBanner,
      devicePixelRatio: 1
    };

    // By default Unity keeps WebGL canvas render target size matched with
    // the DOM size of the canvas element (scaled by window.devicePixelRatio)
    // Set this to false if you want to decouple this synchronization from
    // happening inside the engine, and you would instead like to size up
    // the canvas DOM size and WebGL render target sizes yourself.
    // config.matchWebGLToCanvasSize = false;

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      container.className = "unity-mobile";
      // Avoid draining fillrate performance on mobile devices,
      // and default/override low DPI mode on mobile browsers.
      config.devicePixelRatio = 1;
      unityShowBanner('WebGL builds are not supported on mobile devices.', '');
    } else {
      canvas.style.width = "960px";
      canvas.style.height = "600px";
    }
    loadingBar.style.display = "block";

    var script = document.createElement("script");
    script.src = loaderUrl;
    script.onload = () => {
      createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
      }).then((unityInstance) => {
        window.unityInstance = unityInstance;
        loadingBar.style.display = "none";
        fullscreenButton.onclick = () => {
          unityInstance.SetFullscreen(1);
        };
      }).catch((message) => {
        alert(message);
      });
    };
    document.body.appendChild(script);
  }

}
