<?php
$openai_api_key = "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"; // Ganti dengan milikmu
$image_path = "snapshoot/tester1.jpeg";

if (!file_exists($image_path)) {
    echo json_encode(["error" => "Gambar tidak ditemukan."]);
    exit;
}

$image_data = base64_encode(file_get_contents($image_path));
$mime_type = mime_content_type($image_path);
$image_url = "data:$mime_type;base64,$image_data";

// === Kirim ke GPT-4 Vision ===
$payload = [
  "model" => "gpt-4-vision-preview",
  "messages" => [[
    "role" => "user",
    "content" => [
      ["type" => "text", "text" => "Apakah orang dalam gambar ini memakai perlengkapan keselamatan lengkap: helm atau topi proyek, rompi keselamatan, masker, dan sarung tangan? Jawab hanya dengan format: YA atau TIDAK. Lalu jelaskan alasan singkat."],
      ["type" => "image_url", "image_url" => ["url" => $image_url]]
    ]
  ]],
  "max_tokens" => 100
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $openai_api_key",
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$jawaban = $data["choices"][0]["message"]["content"] ?? "TIDAK";

$is_complete = stripos($jawaban, "YA") === 0;

echo json_encode([
    "complete" => $is_complete,
    "analysis" => $jawaban
]);
