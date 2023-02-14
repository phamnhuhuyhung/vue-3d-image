/* eslint-disable no-undef */

// eslint-disable-next-line no-unused-vars
class Pydnet {
    // eslint-disable-next-line no-unused-vars
    async init(urls) {
        const MODEL = "https://raw.githubusercontent.com/FilippoAleotti/demo_live/master/assets/js/pydnet.json";
        this.model = await tf.loadGraphModel(MODEL);
        this.height = 384;
        this.width = 640;
        return this;
    }

    async predict(img) {
        const [data, resizeInputData] = tf.tidy(() => {
            var raw_input = tf.browser.fromPixels(img);
            var upsampledraw_input = tf.image.resizeBilinear(raw_input, [this.height, this.width]);
            var preprocessedInput = upsampledraw_input.expandDims();
            preprocessedInput = tf.div(preprocessedInput, 255.0);
            var result = this.model.predict(preprocessedInput);
            result = this.prepareOutput(result, img.width, img.height);
            upsampledraw_input = tf.cast(upsampledraw_input, "int32");
            const data = result.dataSync();
            const resizeInputData = upsampledraw_input.dataSync();
            return [data, resizeInputData];
        });
        await tf.nextFrame();
        return [data, resizeInputData];
    }

    // eslint-disable-next-line no-unused-vars
    prepareOutput(tensor, width, height) {
        return tf.tidy(() => {
            tensor = tf.relu(tensor);
            tensor = tf.squeeze(tensor);
            var min_value = tf.min(tensor);
            var max_value = tf.max(tensor);
            tensor = tf.div(tf.sub(tensor, min_value), tf.sub(max_value, min_value));
            tensor = tf.mul(tensor, 255.0);
            tensor = tf.cast(tensor, "int32");
            return tensor;
        });
    }
}

export const tensorflowFunc = async () => {
    // const model = depthEstimation.SupportedModels.ARPortraitDepth;
    // const estimator = await depthEstimation.createEstimator(model);
    var model = await new Pydnet().init();

    const img = document.getElementById('uploadedImage');
    img.crossOrigin = "Anonymous";
    let results = await model.predict(img);
    console.log(results)

    // let canvas = document.getElementById("resultCanvas");
    let canvas = document.createElement('CANVAS');
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let buffer = new Uint8ClampedArray(model.width * model.height * 4);
    var i = 0;
    for (var y = 0; y < model.height; y++) {
        for (var x = 0; x < model.width; x++) {
            var index = y * model.width + x;
            // eslint-disable-next-line no-unused-vars
            var depth = results[0][index];
            buffer[i] = results[0][index];
            buffer[i + 1] = results[0][index];
            buffer[i + 2] = results[0][index];
            buffer[i + 3] = 255.0;
            i += 4;
        }
    }

    const imageData = new ImageData(buffer, model.width, model.height);
    const render = await createImageBitmap(imageData);
    ctx.drawImage(render, 0, 0, img.width, img.height);
    return canvas
}