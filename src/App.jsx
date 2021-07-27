import React, { useEffect, useRef, useCallback } from "react";
import { FaceDetection } from "@mediapipe/face_detection";
import { drawRectangle, drawLandmarks } from "@mediapipe/drawing_utils";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const onSsResults = (results) => {
    let activeEffect = "background";
    // console.log(results);
    const canvasCtx = canvasRef.current.getContext("2d");
    // Draw the overlays.
    canvasCtx.save();

    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    canvasCtx.drawImage(
      results.segmentationMask,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = "source-in";
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = "destination-atop";
    if (activeEffect === "background" || activeEffect === "both") {
      // This can be a color or a texture or whatever...
      const bg = new Image();
      bg.src =
        "https://images.wallpaperscraft.com/image/beach_sand_palm_trees_tropical_90404_1280x720.jpg";
      bg.onload = function () {
        canvasCtx.fillStyle = canvasCtx.createPattern(bg, "no-repeat");
      };
      canvasCtx.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    } else {
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    canvasCtx.restore();
  };

  const onResults = (results) => {
    // console.log(results);
    const canvasCtx = canvasRef.current.getContext("2d");
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    if (results.detections.length > 0) {
      drawRectangle(canvasCtx, results.detections[0].boundingBox, {
        color: "blue",
        lineWidth: 1,
        fillColor: "#00000000",
      });
      drawLandmarks(canvasCtx, results.detections[0].landmarks, {
        color: "red",
        radius: 1,
      });
    }
    canvasCtx.restore();
  };

  const start = async () => {
    const faceDetection = new FaceDetection({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`;
      },
    });

    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
      },
    });
    selfieSegmentation.setOptions({
      selfieMode: true,
      modelSelection: 1,
      effect: "background",
    });
    selfieSegmentation.onResults(onSsResults);

    // options.
    const options = {
      selfieMode: true,
      model: "short",
      minDetectionConfidence: 0.5,
    };

    faceDetection.setOptions(options);
    faceDetection.onResults(onResults);
    await selfieSegmentation.initialize();
    await faceDetection.initialize();
    setInterval(async () => {
      // await faceDetection.send({
      //   image: videoRef.current,
      // });
      await selfieSegmentation.send({
        image: videoRef.current,
      });
    }, 60);
  };

  const setVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = stream;

    videoRef.current.play();
    start();
  };
  useEffect(() => {
    // Our input frames will come from here.
    setVideo();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <video style={{ transform: "rotateY(180deg)" }} ref={videoRef}></video>
      <canvas
        style={{ width: "640px", height: "480px" }}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default App;
