import {Export, FontWeight, Group, LazyCanvas, MorphLayer, saveFile, SaveFormat, TextLayer} from '../src';
import { SvgExportFlag } from "@napi-rs/canvas";

const canvas = new LazyCanvas()
    .create(210, 210)
    .setExportType(Export.SVG)
    .setSvgExportFlag(SvgExportFlag.ConvertTextToPaths);

canvas.layers.add(
    new Group()
        .setVisible(true)
        .setZIndex(2)
        .add(
            new MorphLayer()
                .setPosition(105, 105)
                .setColor("#ffffff")
                .setSize(200, 200, 100)
                .setShadow('#000000', 10),
            new MorphLayer()
                .setPosition(105, 105)
                .setColor("#ff8a8a")
                .setSize(200, 200, 100)
                .setFilled(false)
                .setStroke(2.5, "round", "round"),
        )
);

for (let i = 1; i < 9; i += 1) {
    canvas.layers.add(
        new MorphLayer()
            .setPosition(105, 105)
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
