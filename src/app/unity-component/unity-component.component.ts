import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';

declare function createUnityInstance(e,r,t): any;

@Component({
  selector: 'app-unity-component',
  templateUrl: './unity-component.component.html',
  styleUrls: ['./unity-component.component.scss'],
})
export class UnityComponentComponent implements OnInit {

  unityInstance: any;

  constructor(private fbApp: FirebaseApp,) { }

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

    var loaderUrl = '../../assets/js/noCompressionBuild.loader.js';
    var config = {
      dataUrl: '../../assets/js/noCompressionBuild.data',
      frameworkUrl: '../../assets/js/noCompressionBuild.framework.js',
      codeUrl: '../../assets/js/noCompressionBuild.wasm',
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "NexusBoard",
      productVersion: "1.0",
      showBanner: unityShowBanner,
      devicePixelRatio: 1
    };

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      container.className = "unity-mobile";
      config.devicePixelRatio = 1;
      unityShowBanner('WebGL builds are not supported on mobile devices.', '');
    } else {
      canvas.style.width = "70vw";
      canvas.style.height = "80vh";
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

    // firebase setup
    // var fbImport = document.createElement("script");
    // fbImport.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
    // document.body.appendChild(fbImport);
    // var fbImport2 = document.createElement("script");
    // fbImport2.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js";
    // document.body.appendChild(fbImport2);
    // var fbScript = document.createElement("script");
    // fbScript.src = '../../assets/js/firebaseScript.js';
    // document.body.appendChild(fbScript);

    // window.unityInstance.SendMessage('BoardManager', 'FallbackFunc', 'teste de comunicação');
  }

}
