import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pane } from "tweakpane";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({ scroller: ".mainContainer" })

async function setupViewer() {

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas'),
        useRgbm: false,
        isAntialiased: true
    })

    viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1);

    const data = {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
    }

    const pane = new Pane()




    const manager = await viewer.addPlugin(AssetManagerPlugin)


    await addBasePlugins(viewer)

    const importer = manager.importer;


    importer.addEventListener("onProgress", (ev) => {
        const progressRatio = ev.loaded / ev.total;
        document.querySelector(".progress")?.setAttribute("style", `transform:scaleX(${progressRatio})`)
    })

    importer.addEventListener("onLoad", (ev) => {
        introAnimation()
    })



    viewer.renderer.refreshPipeline()

    const modal = await manager.addFromPath("./assets/scene1.glb")

    const object3d = modal[0].modelObject;
    const modalRotation = object3d.rotation;
    const modalPosition = object3d.position;
    const loaderElement = document.querySelector(".loader")

    function introAnimation() {
        const introTL = gsap.timeline()
        introTL
            .to(".loader", {
                x: "150%",
                duration: 0.8,
                ease: "power4.inOut",
                delay: 1,
                onComplete: setupScrollanimation,
            })
    }




    pane.addInput(data, "position", {
        x: { step: 0.01 },
        y: { step: 0.01 },
        z: { step: 0.01 },
    });
    pane.addInput(data, "rotation", {
        x: { min: -6.28319, max: 6.28319, step: 0.01 },
        y: { min: -6.28319, max: 6.28319, step: 0.01 },
        z: { min: -6.28319, max: 6.28319, step: 0.01 },
    });

    pane.on("change", (e) => {
        if (e.presetKey === 'rotation') {
            const { x, y, z } = e.value;
            modalRotation.set(x, y, z)
        }
        else {
            const { x, y, z } = e.value;
            modalPosition.set(x, y, z)
        }
        onUpdate();
    })

    function setupScrollanimation() {
        document.body.removeChild(loaderElement)
        const tl = gsap.timeline()
        tl.to(modalPosition, {
            x: 0,
            y: 0,
            z: 0,
            scrollTrigger: {
                trigger: ".first",
                start: "top top",
                end: "top top",
                scrub: 0.2,
                immediateRender: false,
                markers: true
            },
            onUpdate
        })

            .to(modalPosition, {
                x: 0,
                y: 0,
                z: 0,
                scrollTrigger: {
                    trigger: ".second",
                    start: "top bottom",
                    end: "top top",
                    scrub: 0.2,
                    immediateRender: false,
                    markers: true
                },
                onUpdate
            })

            .to(modalRotation, {
                x: 0,
                y: 0,
                z: -1.57,
                scrollTrigger: {
                    trigger: ".second",
                    start: "top bottom",
                    end: "top top",
                    scrub: 0.2,
                    immediateRender: false,
                },
            })
            .to(modalPosition, {
                x: 0.97,
                y: -0.39,
                z: -1.31,
                scrollTrigger: {
                    trigger: ".third",
                    start: "top bottom",
                    end: "top top",
                    scrub: 0.2,
                    immediateRender: false,
                    markers: true
                },
                onUpdate
            })

            .to(modalRotation, {
                x: 0.232,
                y: 0.984,
                z: -0.231,
                scrollTrigger: {
                    trigger: ".third",
                    start: "top bottom",
                    end: "top top",
                    scrub: 0.2,
                    immediateRender: false,
                },
            })
    }
    function onUpdate() {
        viewer.setDirty();
        console.log('zaid nagori')
    }




    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

}

setupViewer()
