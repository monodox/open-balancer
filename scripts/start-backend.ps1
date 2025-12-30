$env:GOOGLE_CLOUD_PROJECT="open-balancer-sre-demo"
$env:GOOGLE_CLOUD_LOCATION="us-central1"
cd backend
python -m uvicorn main:app --reload --port 8000
