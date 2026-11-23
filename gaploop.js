/* Good Boy Bobo — gapless living-scene loops (no video restarts at all).
   iPhones hiccup whenever a <video> restarts or a second copy starts, so instead of playing the clip as a video
   we decode its frames ourselves (WebCodecs) and draw them onto a canvas at the clip's frame rate. When the last
   frame is drawn the decoder simply carries on with the first one again: nothing ever stops or restarts.
   The clip file (loop.mp4) is exactly one loop, starts on a key frame and has no B-frames.
   GapLoop(canvas, url) -> {play, pause, close, ready} or null when this browser can't do it (then use SeamLoop). */
window.GapLoop = function (cv, url, opt) {
  opt = opt || {};
  if (!window.VideoDecoder || !window.MP4Box || !window.EncodedVideoChunk) return null;
  const g = cv.getContext('2d', { alpha: false });
  let dec = null, samples = [], fps = 24, i = 0, ts = 0, q = [], playing = false, raf = 0, last = 0, acc = 0, dead = false, shown = 0;
  let onFirst = opt.onFirst || null;
  const MAXQ = 6;
  function feed() {                                   // keep a few decoded frames ready; wrap round to the start forever
    while (dec && dec.state === 'configured' && q.length + dec.decodeQueueSize < MAXQ) {
      const s = samples[i];
      dec.decode(new EncodedVideoChunk({ type: s.is_sync ? 'key' : 'delta', timestamp: ts, duration: 1e6 / fps, data: s.data }));
      ts += 1e6 / fps; i = (i + 1) % samples.length;
    }
  }
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (!playing) return;
    if (!last) last = now;
    acc += Math.min(250, now - last); last = now;
    const step = 1000 / fps;
    while (acc >= step && q.length) {                 // show the next frame on time (drop late ones if the phone was busy)
      const f = q.shift(); acc -= step;
      if (acc < step || !q.length) { g.drawImage(f, 0, 0, cv.width, cv.height); shown++; if (shown === 1 && onFirst) { onFirst(); onFirst = null } }
      f.close();
    }
    if (acc > step * 3) acc = step;                    // never try to catch up a long stall in one go
    feed();
  }
  const ready = fetch(url).then(r => { if (!r.ok) throw new Error('loop ' + r.status); return r.arrayBuffer() }).then(buf => new Promise((res, rej) => {
    const mp4 = MP4Box.createFile();
    let track = null;
    mp4.onError = rej;
    mp4.onReady = info => {
      track = info.videoTracks[0]; if (!track) return rej(new Error('no video'));
      fps = Math.round(track.nb_samples / (track.duration / track.timescale)) || 24;
      mp4.setExtractionOptions(track.id, null, { nbSamples: track.nb_samples });
      mp4.start();
    };
    mp4.onSamples = (id, user, ss) => {
      for (const s of ss) samples.push({ is_sync: s.is_sync, data: new Uint8Array(s.data) });
      if (samples.length < track.nb_samples) return;
      const trak = mp4.getTrackById(track.id), e = trak.mdia.minf.stbl.stsd.entries[0], box = e.avcC || e.hvcC;
      const ds = new DataStream(undefined, 0, DataStream.BIG_ENDIAN); box.write(ds);
      const description = new Uint8Array(ds.buffer, 8);
      cv.width = track.video.width; cv.height = track.video.height;
      dec = new VideoDecoder({ output: f => { if (dead) f.close(); else q.push(f) }, error: e => { console.warn('GapLoop', e); } });
      const cfg = { codec: track.codec, codedWidth: track.video.width, codedHeight: track.video.height, description, optimizeForLatency: true };
      VideoDecoder.isConfigSupported(cfg).then(r => { if (!r.supported) return rej(new Error('unsupported')); dec.configure(cfg); feed(); res() }, rej);
    };
    buf.fileStart = 0; mp4.appendBuffer(buf); mp4.flush();
  }));
  return {
    ready,
    play() { playing = true; last = 0; if (!raf) raf = requestAnimationFrame(tick) },
    pause() { playing = false },
    close() { dead = true; playing = false; cancelAnimationFrame(raf); raf = 0; q.forEach(f => f.close()); q = []; try { dec && dec.close() } catch (e) { } dec = null; samples = [] },
    get fps() { return fps }, get shown() { return shown }
  };
};
