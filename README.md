# Tip MVP – Pourboires via QR + Stripe (React / Express / Mongo / Tailwind)

> **MVP pédagogique** : Un pro (serveur, artiste, coach…) peut recevoir des pourboires via une page publique accessible par **QR code**. Les clients scannent, choisissent un montant rapide (2€, 5€, 10€) ou libre, et paient via **Stripe Checkout (mode test)**. Le pro voit ensuite ses pourboires dans un **tableau de bord**.  

> Flux utilisateur (MVP) : 
Admin crée Pro -> Genère QR -> Client scanne -> Page /slug -> Choisit montant -> Stripe Checkout -> Retour succès -> Tip marqué payé -> Pro voit ses tips + total.

> Projet conçu pour **apprendre fullstack** : React + Tailwind + Express + MongoDB + intégration Stripe.


---

## Objectif
- Démontrer un **parcours de pourboire simple** pour valider l’idée produit.
- Focus **mobile-first** (scan QR → payer en quelques secondes).
- Backend minimal mais propre : API REST Express, Mongo, JWT (plus tard).
- Front React Vite, TailwindCSS, composant QR.
- Stripe en mode test (webhook mock pour MVP).
- Documentation simple + vidéo démo.

---

## Stack technique

| Côté | Tech | Usage |
|------|------|-------|
| Front | React (Vite) | UI, routing, page publique slug, dashboard |
| UI | TailwindCSS | Styles rapides mobile-first |
| Back | Express | API REST |
| DB | MongoDB (Mongoose) | Users, Tips |
| Paiement | Stripe Checkout | Paiement des pourboires |
| Auth | JWT (MVP simple) | Admin + Pros |
| Déploiement | VPS (Ubuntu) + Nginx + PM2 | Prod simple |

---


## Roadmap Features (F00→F11)

| ID | Feature | Statut | Description |
|----|---------|--------|-------------|
| F00 | Init Projet & Outillage | Monorepo, lint, env, health check |
| F01 | Connexion Mongo & Modèles | User + Tip (Mongoose), seed script |
| F02 | Auth basique (JWT) | ⏳ | Register admin, login, me |
| F03 | CRUD Pro (Admin) | | Créer pros + update |
| F04 | Public Pro endpoint | | GET /public/pro/:slug |
| F05 | Tip Checkout (Stripe test) | | Paiement & Tip pending |
| F06 | Tip Confirm (sans webhook) | | Statut paid demo |
| F07 | API Dashboard Pro | | Tips + total |
| F08 | Front Tip Page | | Page publique par slug |
| F09 | Front Admin + QR | | Création pro, QR display |
| F10 | Front Pro Dashboard | | Liste tips + total |
| F11 | Déploiement VPS + Doc | | Nginx, PM2, vidéo démo |

---



### 1. Cloner le repo & Lancer le projet
```bash
git clone https://github.com/mouad-sellak/Tipeak-draft.git Tipeak
cd Tipeak

cd server
npm install
cd ..

cd client
npm install
cd ..

cp server/.env.example server/.env
cp client/.env.local.example client/.env.local

cd server
npm run dev

cd client
npm run dev

```
---


### Manipuler la base sur Docker

```bash
cd ..
docker-compose up -d
docker logs -f mongo-teapik
docker volume ls

docker exec -it mongo-tipeak bash
mongosh -u admin -p admin 
use tipeak
show collections
db.collection.find()

```
---

### Manipuler les commandes git


git status
git branch

git chekout -b feature/FXX-feature-name
git add file1 file2
git commit -m "commit message"
git push origin featre/FXX-feature-name
[Create PR and Merge in Github]
git checkout main
git pull origin main

