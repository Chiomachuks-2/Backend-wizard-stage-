# Backend Wizards - Stage 0

GET endpoint that classifies names using Genderize API.

## Endpoint
`GET /api/classify?name={name}`

## Example
Request: `/api/classify?name=john`
Response:
```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-01T12:00:00Z"
  }
}
