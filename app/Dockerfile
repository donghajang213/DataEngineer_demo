# infra-demo/app/Dockerfile

# 1) 베이스 이미지
FROM node:18-alpine

# 2) 워킹 디렉터리 설정
WORKDIR /usr/src/app

# 3) package.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 4) 앱 소스 복사
COPY . .

# 5) 컨테이너 내 포트
EXPOSE 3000

# 6) 컨테이너 시작 명령
CMD ["npm", "start"]
