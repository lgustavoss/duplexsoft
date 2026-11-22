import sharp from "sharp";

async function knockWhite(input, output, threshold = 240) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);
}

async function recolorOpaque(input, output, rgb) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 10) continue;
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);
}

await knockWhite("identidade_visual/1.png", "public/brand/mark.png");
await recolorOpaque("public/brand/mark.png", "public/brand/mark-bright.png", [
  141, 176, 255,
]);
await knockWhite("identidade_visual/3.png", "public/brand/logo-lockup.png");

console.log("Logos com fundo transparente gerados em public/brand/");
