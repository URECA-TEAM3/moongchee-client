# **Moongchee Client**

![Version](https://img.shields.io/github/v/release/URECA-TEAM3/moongchee-client)
![Last Commit](https://img.shields.io/github/last-commit/URECA-TEAM3/moongchee-client)

**Server Repo**: [Moongchee Server](https://github.com/URECA-TEAM3/moongchee-server)

> ### **뭉치** 프로젝트는 바쁜 일상 속에서도 반려동물을 사랑하는 현대인들을 위한 스마트한 반려동물 종합 케어 플랫폼입니다. 반려동물 용품 쇼핑몰과 검증된 펫시터 예약 서비스가 결합되어, 반려인들이 필요한 모든 서비스를 한 번에 이용할 수 있도록 돕습니다. 이제 반려동물 돌봄과 쇼핑을 한 곳에서 간편하게 해결할 수 있는 뭉치와 함께, 더 편리하고 즐거운 반려동물 라이프를 만나보세요!

## 주요 서비스

1. **회원 관리 및 로그인**
   - 소셜 로그인 (Google, Kakao)
   - 회원 가입 및 로그인
2. **쇼핑몰 서비스**
   - 반려동물 용품 조회 및 구매
   - 장바구니 및 결제 기능
   - 포인트 적립 및 사용
3. **펫시터 예약 서비스**
   - 펫시터 추천 및 예약
   - 펫시터 프로필 조회
   - 예약 취소 및 내역 조회
4. **알림 기능**
   - 펫시터 예약 신청, 수락, 취소 알림 제공
5. **기타**
   - 사용자 인터페이스 (UI) 및 사용자 경험 (UX) 최적화
   - 모바일 및 데스크탑 지원

## **Table of Contents**

- [Project Setup](#project-setup)
- [Tech Stack](#tech-stack)

## **Project Setup**

### **Prerequisites**

- **Node.js**
- **npm** (or **yarn**)

### **Installation**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/URECA-TEAM3/moongchee-client.git
   cd moongchee-client
   ```

2. Install Dependencies
   ```bash
   npm install (or npm i)
   ```
3. Set Up Environment Variables

   Please contact one of our members to obtain the variables

4. Start the Server
   ```bash
   npm run dev
   ```
   The server should now be running at http://localhost:5173

## **Tech Stack**

- **Frontend**: Vite, React.js
- **State Management**: Zustand
- **UI Framework**: Tailwind CSS
- **Date Picker**: React Date Picker
- **Notification UI**: React Hot Toast
- **Deployment**: Vercel
