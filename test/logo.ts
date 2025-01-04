import { Export, FontWeight, LazyCanvas, MorphLayer, saveFile, SaveFormat, TextLayer } from '../dist';
import { SvgExportFlag } from "@napi-rs/canvas";

const canvas = new LazyCanvas()
    .create(800, 300)
    .setExportType(Export.SVG)
    .setSvgExportFlag(SvgExportFlag.ConvertTextToPaths);

canvas.layers.add(
    new MorphLayer()
        .setPosition(150, 150)
        .setColor("#ffffff")
        .setSize(200, 200, 100)
        .setShadow('#000000', 10),
    new MorphLayer()
        .setPosition(150, 150)
        .setColor("#ff8a8a")
        .setSize(200, 200, 100)
        .setFilled(false)
        .setStroke(2.5, "round", "round"),
    new TextLayer()
        .setText("LazyCanvas")
        .setPosition(280, 130)
        .setColor("#ff8a8a")
        .setFont("GeistMono", 50, FontWeight.Normal)
        .setMultiline(true, 600, 200)
        .setShadow('#000000', 10),
    new TextLayer()
        .setText("A simple way to interact with canvas in an advanced way!")
        .setPosition(280, 170)
        .setColor("#ff7676")
        .setFont("GeistMono", 20, FontWeight.Light)
        .setMultiline(true, 380, 300)
        .setShadow('#000000', 5),
);

for (let i = 1; i < 9; i += 1) {
    canvas.layers.add(
        new MorphLayer()
            .setPosition(150, 150)
            .setColor("#ff8a8a")
            .setSize(185 - 20 * i, 185 - 20 * i, 47.5 - 5 * i)
            .setFilled(false)
            .setStroke(2.5, "round", "round")
            .setRotate(45 + (15 * i)),
    )
}

canvas.render.render().then(async (buffer) => {
    console.log("Saved")
    await saveFile(buffer, SaveFormat.SVG, "example")
})
