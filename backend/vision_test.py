import os
from google.cloud import vision

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "carbon-project-hanbat.json"

client = vision.ImageAnnotatorClient()
# 이후 코드 계속...

# 분석할 이미지 파일 경로
with open("images\sample.png", "rb") as image_file:
    content = image_file.read()

image = vision.Image(content=content)

# 라벨 감지 요청
response = client.label_detection(image=image)
labels = response.label_annotations

# 출력
for label in labels:
    print(label.description, label.score)
