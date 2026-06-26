# Statescan Deployment — PezkuwiChain

Bu fork, `statescan.pezkuwichain.io` için pezkuwichain'e özel yapılandırmayı içerir.
Geçen sefer DEV'de repo'suz custom kuruluydu, DEV iptal olunca kayboldu → bu sefer her şey burada.

## Hedef VPS
- **VPS-CI-DKS** (178.18.252.132, 6c/11GB, 152G boş) — CI yeşil olup dks-runner-1 boşalınca.
- DNS: `statescan.pezkuwichain.io → 178.18.252.132` (kurulum bitince ayarla).

## Zincir parametreleri (mainnet relay = "pezkuwi")
| Alan | Değer |
|---|---|
| URL segment / chain | `pezkuwi` (statescan.pezkuwichain.io/pezkuwi/) |
| RPC | `wss://rpc.pezkuwichain.io` (+ `wss://mainnet.pezkuwichain.io`) |
| symbol / decimals | HEZ / 12 |
| ss58Format | 42 |
- Frontend chain config: `site/src/utils/consts/chains/pezkuwichain.js` (eklendi, index.js'de key=`pezkuwi`).
- İlerisi (parachain): pezkuwi/assethub (wss://asset-hub-rpc), pezkuwi/people (wss://people-rpc) — her biri ayrı backend stack.

## Mimari (statescan-v2)
- **MongoDB** (veri deposu)
- **Scanner'lar** (backend/packages/): block-scan, account-scan, runtime-scan (çekirdek) + asset/identity/multisig/proxy/recovery/staking/vesting/uniques (opsiyonel)
- **graphql-server** (ana API)
- **site** (Next/React frontend)
> Sıra: önce MongoDB → scanner'lar indexler (genesis'ten, SAATLER/GÜNLER) → graphql-server → site.

## Backend env (her scanner + graphql-server, `.env`)
```
CHAIN=pezkuwi
ENDPOINTS=wss://rpc.pezkuwichain.io
MONGO_DB_URL=mongodb://localhost:27017
SIMPLE_MODE=true
```
(Her scanner'ın `.env.example`'ına bak; `process.env.CHAIN` + `endpoint` + mongo kullanıyorlar.)

## Frontend env (`site/.env`)
```
REACT_APP_PUBLIC_CHAIN=pezkuwi
REACT_APP_PUBLIC_API_END_POINT=https://statescan.pezkuwichain.io/api/
REACT_APP_PUBLIC_GRAPHQL_API_END_POINT=https://statescan.pezkuwichain.io/graphql/
REACT_APP_PUBLIC_SIMPLE_MODE=true
```

## Deploy adımları (kutu boşalınca)
1. VPS-CI-DKS'e docker kur, repo'yu clone'la.
2. MongoDB container başlat.
3. Backend build (yarn), scanner'ları + graphql-server'ı yukarıdaki env ile başlat (systemd/docker).
4. site build, nginx ile serve (statescan.pezkuwichain.io vhost + certbot).
5. nginx: `/api` → restful server, `/graphql` → graphql-server, `/` → site.
6. DNS çevir + certbot HTTPS.
7. Scanner sync'i izle (genesis→tip, uzun sürer).

## Notlar
- Tek 6c/11GB kutuda önce SADECE relay (pezkuwi); parachain'leri kaynak izleyerek sonra ekle.
- mongo zincir büyüdükçe büyür → diski izle.
