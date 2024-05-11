      import * as THREE from "three";
      import { OrbitControls } from "three/addons/controls/OrbitControls.js";
      import { GUI } from "three/addons/libs/lil-gui.module.min.js";
      import WEBGL from "three/addons/capabilities/WebGL.js";
      import ShaderLoader from './shaderloader.js';

      const shaderloader = new ShaderLoader();
      const trueAnaglyph_frag = shaderloader.load('./shaders/Anaglyph/trueAnaglyph.frag.glsl');
      const grayAnaglyph_frag = shaderloader.load('./shaders/Anaglyph/grayAnaglyph.frag.glsl');
      const halfAnaglyph_frag = shaderloader.load('./shaders/Anaglyph/halfAnaglyph.frag.glsl');
      const optimizedAnaglyph_frag = shaderloader.load('./shaders/Anaglyph/optimizedAnaglyph.frag.glsl');
      const colorAnaglyph_frag = shaderloader.load('./shaders/Anaglyph/colorAnaglyph.frag.glsl');
      const gaussianfilter_frag = shaderloader.load('./shaders/gaussian.frag.glsl');
      const Laplacianfilter_frag = shaderloader.load('./shaders/Laplacian.frag.glsl');
      const SeparablefilterH_frag = shaderloader.load('./shaders/SeparableH.frag.glsl');
      const Medianfilter_frag = shaderloader.load('./shaders/Median.frag.glsl');
      const GaussianLaplacian_frag = shaderloader.load('./shaders/GaussianLaplacian.frag.glsl');

      function IVimageProcessing(height, width, imageProcessingMaterial) {
        this.height = height;
        this.width = width;

        //3 rtt setup
        this.scene = new THREE.Scene();
        this.orthoCamera = new THREE.OrthographicCamera(
          -1,
          1,
          1,
          -1,
          1 / Math.pow(2, 53),
          1
        );

        //4 create a target texture
        var options = {
          minFilter: THREE.NearestFilter,
          magFilter: THREE.NearestFilter,
          format: THREE.RGBAFormat,
          //            type:THREE.FloatType
          type: THREE.UnsignedByteType,
        };
        this.rtt = new THREE.WebGLRenderTarget(width, height, options);

        var geom = new THREE.BufferGeometry();
        geom.setAttribute(
          "position",
          new THREE.BufferAttribute(
            new Float32Array([
              -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
            ]),
            3
          )
        );
        geom.setAttribute(
          "uv",
          new THREE.BufferAttribute(
            new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]),
            2
          )
        );
        this.scene.add(new THREE.Mesh(geom, imageProcessingMaterial));
      }

      function IVprocess(imageProcessing, renderer) {
        renderer.setRenderTarget(imageProcessing.rtt);
        renderer.render(imageProcessing.scene, imageProcessing.orthoCamera);
        renderer.setRenderTarget(null);
      }

      var camera, controls, scene, renderer, container;
      var plan;

      // VIDEO AND THE ASSOCIATED TEXTURE
      var video, videoTexture;

      var imageProcessing, imageProcessingMaterial;
      var imageProcessing2, imageProcessingMaterial2;

      // GUI
      var gui;

      init();
      animate();

      function init() {
        container = document.createElement("div");
        document.body.appendChild(container);

        // Scene
        scene = new THREE.Scene();

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.autoClear = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = false;

        container.appendChild(renderer.domElement);

        // Camera 
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.001,
          10
        );
        camera.position.z = 1.0;

        // Controls 
        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 0.005;
        controls.maxDistance = 2.0;
        controls.enableRotate = false;
        controls.enablePan = true;
        controls.addEventListener("change", render);
        controls.update();

        video = document.createElement("video");
        video.src = "sanFrancisco.mp4";
        video.load();
        video.muted = true;
        video.loop = true;

        video.onloadeddata = function () {
          videoTexture = new THREE.VideoTexture(video);
          videoTexture.minFilter = THREE.NearestFilter;
          videoTexture.magFilter = THREE.NearestFilter;
          videoTexture.generateMipmaps = false;
          videoTexture.format = THREE.RGBAFormat;

          // Shader Material which has video texture without filtering 
          imageProcessingMaterial = new THREE.ShaderMaterial({
            uniforms: {
              sigma: {value: 1.0 },
              kernelSize: {value: 3 },

              image: { type: "t", value: videoTexture },
              resolution: {
                type: "2f",
                value: new THREE.Vector2(video.videoWidth, video.videoHeight),
              },
            },
            vertexShader: document.getElementById("vertShader").text,
            fragmentShader: gaussianfilter_frag
          });

          // Shader Material which has filtered video texture
          imageProcessingMaterial2 = new THREE.ShaderMaterial({
            uniforms: {
              sigma: {value: 1.0 },
              kernelSize: {value: 3 },

              image: { type: "t", value: null },
              resolution: {
                type: "2f",
                value: new THREE.Vector2(video.videoWidth, video.videoHeight),
              },
            },
            vertexShader: document.getElementById("vertShader").text,
            fragmentShader: trueAnaglyph_frag
          });

          // Image processing Instance for Filtering
          imageProcessing = new IVimageProcessing(
            video.videoHeight,
            video.videoWidth,
            imageProcessingMaterial
          );

          // Image processing Instance for Anaglyph
          imageProcessing2 = new IVimageProcessing(
            video.videoHeight,
            video.videoWidth,
            imageProcessingMaterial2
          );

          console.log(imageProcessing.width);

          var pausePlayObj = {
            pausePlay: function () {
              if (!video.paused) {
                console.log("pause");
                video.pause();
              } else {
                console.log("play");
                video.play();
              }
            },
            add10sec: function () {
              video.currentTime = video.currentTime + 10;
              console.log(video.currentTime);
            },
          };

            var filters = {
              Gaussian: gaussianfilter_frag,
              Laplacian: Laplacianfilter_frag,
              Separable: SeparablefilterH_frag,
              Median: Medianfilter_frag,
              GaussianLaplacian: GaussianLaplacian_frag
            }

            var Anaglyph = {
              True: trueAnaglyph_frag,
              Gray: grayAnaglyph_frag,
            Color: colorAnaglyph_frag,
              Half: halfAnaglyph_frag,
              Optimized: optimizedAnaglyph_frag,
            }

            // Create a variable to store  filter and Anaglyph.
              var configs = {
              filter: 'Gaussian', Anaglyph: 'True'
            }

            function switchFilter(value) {
                imageProcessingMaterial.fragmentShader = filters[value];
                imageProcessingMaterial.needsUpdate = true;
            }

            function switchAnaglyph(value) {
              imageProcessingMaterial2.fragmentShader = Anaglyph[value];
              imageProcessingMaterial2.needsUpdate = true;
            }

          gui = new GUI();

          // Add a GUI control
          gui.add(configs, "filter", Object.keys(filters)).name("Select Filter").onChange(switchFilter);
          gui.add(configs, "Anaglyph", Object.keys(Anaglyph)).name("Select Anaglyph").onChange(switchAnaglyph);

          gui
            .add(imageProcessingMaterial.uniforms.sigma, "value", 0.1, 10.)
            .name("Sigma")
            .step(0.1);

          gui
            .add(imageProcessingMaterial.uniforms.kernelSize, "value", 1, 20)
            .name("Kernel size")
            .step(1);

          gui.add(pausePlayObj, "pausePlay").name("Pause/play video");
          gui.add(pausePlayObj, "add10sec").name("Add 10 seconds");

          video.play();
        };

        window.addEventListener("resize", onWindowResize, false);
      }

      function render() {
        renderer.clear();

        if (typeof imageProcessing !== "undefined") {
          IVprocess(imageProcessing, renderer);
          imageProcessingMaterial2.uniforms.image.value = imageProcessing.rtt.texture;
          IVprocess(imageProcessing2, renderer);
          
          if (plan == null) {
            var geometry = new THREE.PlaneGeometry(
            1,
            video.videoHeight / video.videoWidth
          );
          var material = new THREE.MeshBasicMaterial({
            map: imageProcessing2.rtt.texture,
            side: THREE.DoubleSide,
          });
          plan = new THREE.Mesh(geometry, material);
          plan.position.z = 0.15;
          plan.receiveShadow = false;
          plan.castShadow = false;
          scene.add(plan);
        }

        }
        renderer.render(scene, camera);
      }

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        render();
      }
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
      }