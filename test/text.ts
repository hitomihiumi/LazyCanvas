import {LazyCanvas, TextLayer, saveFile, SaveFormat, Export, TextAlign, FontWeight} from "../src";
import { SvgExportFlag } from "@napi-rs/canvas";

const canvas = new LazyCanvas()
    .create(300, 100)
    .setExportType(Export.SVG)
    .setSvgExportFlag(SvgExportFlag.ConvertTextToPaths);

canvas.layers.add(
    new TextLayer()
    .setText("NMMTY")
    .setPosition(150, 85)
    .setColor("#ff8a8a")
    .setFont("GeistMono", 100, FontWeight.Bold)
    .setAlign(TextAlign.Center)
)

canvas.render.render().then(async (buffer) => {
    console.log("Saved")
    await saveFile(buffer, SaveFormat.SVG, "example")
})
