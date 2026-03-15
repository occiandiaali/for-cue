<script>
  import { onMount } from 'svelte';
  import * as pdfjsLib from 'pdfjs-dist';

  import {Document, Packer} from 'docx';

  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  /** @type {string|ArrayBuffer}*/
  let text = "Upload a script to start...";

  let fontSize = 28;
  let color = "#ffffff";
  let speed = 2;
  let scrolling = false;
  let scrollPos = 0;

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === "txt") {
        const reader = new FileReader();
        reader.onload = (e) => {
          text = formatScript(e.target.result);
        };
        reader.readAsText(file);
    } else if (ext === "pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        
        // @ts-ignore
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let content = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const txt = await page.getTextContent();
          // @ts-ignore
          content += txt.items.map(item => item.str || "").join(" ") + "\n";
        }
        text = formatScript(content);
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === "docx") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const zip = await import("jszip");
        const jszip = await zip.default.loadAsync(arrayBuffer);
        const docXml = await jszip.file("word/document.xml").async("string");
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(docXml, "application/xml");
        const paragraphs = xmlDoc.getElementsByTagName("w:t");
        let content = "";
        for (let p of paragraphs) {
          content += p.textContent + " ";
        }
        text = formatScript(content);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type");
    }

  }

  function formatScript(raw) {
  // Normalize whitespace
  let clean = raw
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n\n")
    .trim();

  // Split into words
  const words = clean.split(/\s+/);
  let lines = [];
  let buffer = [];

  words.forEach((word, i) => {
    buffer.push(word);
    if (buffer.join(" ").length > 60 || word.endsWith(".") || word.endsWith("?")) {
      lines.push(buffer.join(" "));
      buffer = [];
    }
  });
  if (buffer.length) lines.push(buffer.join(" "));

  // Add cue spacing (extra newlines between chunks)
  return lines.join("\n\n");
}

  function startScroll() { scrolling = true; }
  function pauseScroll() { scrolling = false; }
  function resetScroll() { scrollPos = 0; scrolling = false; }

  onMount(() => {
    const interval = setInterval(() => {
      if (scrolling) scrollPos += speed;
    }, 50);
    return () => clearInterval(interval);
  });
</script>

<div class="controls">
  <input type="file" accept=".txt,.pdf,.docx" on:change={handleFileUpload} />
  <label>Font Size <input type="number" bind:value={fontSize} /></label>
  <label>Color <input type="color" bind:value={color} /></label>
  <label>Speed <input type="range" min="1" max="10" bind:value={speed} /></label>
  <button id="startScroll" on:click={startScroll}>Start</button>
  <button id="pauseScroll" on:click={pauseScroll}>Pause</button>
  <button id="resetScroll" on:click={resetScroll}>Reset</button>
</div>

<div class="teleprompter-wrapper">
  <div class="teleprompter" style="color:{color}; font-size:{fontSize}px; transform:translateY(-{scrollPos}px)">
    {text}
  </div>
</div>

<style>
button {
    border: none;
    cursor: pointer;
}
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    /* margin-bottom: 1rem; */
    margin: 8px auto;
  }
    #startScroll {
    background-color: green;
    color: white;
  }
    #pauseScroll {
    background-color: orange;
    color: white;
  }
  #resetScroll {
    background-color: red;
    color: white;
  }
  .teleprompter-wrapper {
    width: 595px;   /* A4 width in px at ~72dpi */
    /* height: 842px;  A4 height */
    height: 450px;
    margin: auto;
    background: black;
    overflow: hidden;
    border: 1px solid #444;
    padding: 1.4rem;
  }
  .teleprompter {
    white-space: pre-wrap;
      line-height: 1.8;   /* generous spacing */
  text-align: center; /* centered text for teleprompter feel */
  }

  @media (max-width: 600px) {
    .teleprompter-wrapper {
        width: 324px;
        height: 360px;
    }
  }
</style>