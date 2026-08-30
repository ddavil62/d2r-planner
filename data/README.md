# 게임 데이터 스냅샷

`raw/3.3/rotw/`는 로컬에 설치된 한국 리전 Diablo II: Resurrected
`3.3.93847` 클라이언트의 CASC에서 추출한 `data/global/excel` 원본입니다.

- 추출일: 2026-08-30
- 시대: Reign of the Warlock
- 모드: 비래더 앱의 기준 스냅샷
- 추출기: `micheljung/d2r-api`의 data-extractor

런타임 앱은 정규화한 TypeScript 데이터만 사용합니다. 원본 스냅샷은 이후 계산식과
아이템 목록을 확장할 때 출처를 추적하고 회귀 검증을 하기 위해 보존합니다.
