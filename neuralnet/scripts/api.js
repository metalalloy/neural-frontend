WMATA_API_URL = "http://siahweehung1748.pythonanywhere.com";
OCR_API_URL = "https://caf5-161-253-25-30.ngrok-free.app";

export async function fetch_stop(stop_id) {
    console.warn(`${WMATA_API_URL}/stop?stop_id=${stop_id}`)
  try {
    const r = await fetch(`${WMATA_API_URL}/stop?stop_id=${stop_id}`);
    return await r.json();
  } catch {
    return {};
  }
}

export async function fetch_path(route_id, route_dir) {
  try {
    const r = await fetch(
      `${WMATA_API_URL}/path?route_id=${route_id}&route_dir=${route_dir}`
    );
    return await r.json();
  } catch {
    return {};
  }
}

export async function fetch_positions(
  route_ids,
  route_dirs,
  stop_lon,
  stop_lat
) {
  try {
    const r = await fetch(
      `${WMATA_API_URL}/positions?route_ids=${route_ids.join(
        "&route_ids="
      )}&route_dirs=${route_dirs.join(
        "&route_dirs="
      )}&stop_lon=${stop_lon}&stop_lat=${stop_lat}`
    );
    return await r.json();
  } catch {
    return {};
  }
}

export async function fetch_ocr(file) {
  const r = await fetch(`${OCR_API_URL}/id_from_img/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file: `data:${file.mimeType};base64,${file.base64}`,
    }),
  });
  return await r.json();
}
