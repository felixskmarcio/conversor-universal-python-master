# 🌐 API Documentation

## Endpoints

### Health Check
```
GET /api/v1/health
```
Retorna o status da aplicação.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### Supported Formats
```
GET /api/v1/formats
```
Lista todos os formatos suportados.

**Response:**
```json
{
  "input_formats": ["pdf", "docx", "txt", "html", "md"],
  "output_formats": ["pdf", "docx", "txt", "html", "md"],
  "matrix": {
    "pdf": ["docx", "txt", "html", "md"],
    "docx": ["pdf", "txt", "html", "md"]
  }
}
```

### Convert Document
```
POST /api/v1/convert
```
Converte um documento para o formato especificado.

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer {token} (opcional)
```

**Parameters:**
- `file` (file): Arquivo a ser convertido
- `target_format` (string): Formato de destino
- `options` (json, opcional): Opções de conversão

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/v1/convert \
  -F "file=@document.pdf" \
  -F "target_format=docx" \
  -F "options={\"preserve_formatting\":true}"
```

**Response:**
```json
{
  "job_id": "conv-123456",
  "status": "processing",
  "estimated_time": 30,
  "message": "Conversão iniciada"
}
```

### Check Status
```
GET /api/v1/status/{job_id}
```
Verifica o status de uma conversão.

**Response:**
```json
{
  "job_id": "conv-123456",
  "status": "completed",
  "progress": 100,
  "file_id": "file-789",
  "download_url": "/api/v1/download/file-789"
}
```

### Download Result
```
GET /api/v1/download/{file_id}
```
Faz download do arquivo convertido.

**Response:**
Arquivo binário com headers apropriados.

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Parâmetros inválidos |
| 413 | File Too Large | Arquivo excede 16MB |
| 415 | Unsupported Format | Formato não suportado |
| 500 | Internal Error | Erro interno do servidor |

## Rate Limiting

- **Limit**: 100 requests por hora por IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- **Reset**: `X-RateLimit-Reset`