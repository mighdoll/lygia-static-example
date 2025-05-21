/// <reference types="wesl-plugin/suffixes" />
import appCode from "../shaders/app.wesl?static";

main();

async function main(): Promise<void> {
  displayShaderCode(appCode);

  launchShader(appCode);
}

function displayShaderCode(wgslSrc: string): void {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (app) {
    app.innerHTML = `<pre>${wgslSrc}<pre>`;
  }
}

async function launchShader(code: string): Promise<void> {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter?.requestDevice();
  if (!device) {
    console.error("Failed to create GPU device");
    return;
  }
  const module = device.createShaderModule({ code });

  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: { module },
  });

  const commands = device.createCommandEncoder();
  const pass = commands.beginComputePass();
  pass.setPipeline(pipeline);
  pass.dispatchWorkgroups(1, 1, 1);
  pass.end();
  device.queue.submit([commands.finish()]);
}
