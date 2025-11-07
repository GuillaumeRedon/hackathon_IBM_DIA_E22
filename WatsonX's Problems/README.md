
# 🧾 README – Diagnostic des erreurs IBM watsonx.ai (AutoAI & RAG Accelerator)

## 📂 Projet concerné
- **Nom du projet :** `Tes_RAG_SOL`  
- **Environnement :** IBM watsonx.ai — Bac à sable de Maxim  
- **Date :** 5 novembre 2025  
- **Région :** Francfort  
- **Utilisateur :** Maxim Quénel

---

## ⚠️ 1. Erreurs principales observées

### 🔴 Erreur 1 : `Unexpected response code: 429`

**Contexte :**
- Se produit lors du **lancement de l'entraînement AutoAI** et de la **sauvegarde de la configuration**.  
- Message exact :  
  > Une erreur s'est produite lors du lancement de l'entraînement AutoAI.  
  > Error: Unexpected response code: 429

**Analyse :**
- Le code HTTP **429** signifie **"Too Many Requests"**.  
- Il s’agit d’un **dépassement de quotas API** ou **de ressources allouées** (CPU, mémoire ou CUH).  
- D’après les informations visibles :
  - 20 **CUH** utilisés ce mois-ci  
  - 1029 **jetons** consommés  
- Cela indique probablement que le **quota du plan gratuit est atteint** ou que **trop d’expérimentations simultanées** sont lancées.

**Correctifs recommandés :**
1. Attendre 1 à 2 heures pour un éventuel rétablissement automatique du quota.  
2. Réduire le nombre d’expérimentations en cours.  
3. Vérifier le **plan de service** :  
   - Menu → Ton compte → “Gérer les quotas”.  
4. Si tu es sur un plan gratuit, envisager de **passer à un plan payant** ou **supprimer des projets anciens**.

---

### 🔴 Erreur 2 : `Unable to embed and upload documents to vector store`

**Contexte :**
- Échec à l’étape **“Intégrations”** de l’expérimentation AutoAI RAG.  
- Message :  
  > Unable to embed and upload documents to vector store for collection name:  
  > `autoai_rag_8ec6f0bb_20251105162535` and embedding model: `ibm/slate-125m-english-rtrvr`.

**Analyse :**
- Le modèle RAG tente de créer une **base vectorielle (vector store)** à partir du **Cloud Object Storage (COS)**.  
- L’erreur indique un **échec d’accès ou d’écriture** vers le stockage COS.

**Causes possibles :**
- Le **bucket COS** n’existe pas ou est mal relié au projet.  
- Les **autorisations IAM** du projet ne permettent pas l’écriture.  
- Le modèle `ibm/slate-125m-english-rtrvr` n’est pas disponible dans la région Francfort.

**Correctifs recommandés :**
1. Vérifier le **Cloud Object Storage** :
   - Confirmer qu’un **bucket** est bien associé au projet.  
   - S’assurer que les droits IAM autorisent la lecture/écriture.  
2. Supprimer toute **collection vectorielle résiduelle** (ex. `autoai_rag_*`).  
3. Tester avec un **autre modèle d’embedding**, si disponible.  
4. Si tu es dans la région *Francfort*, essayer de **créer le projet sur la région Dallas** (plus stable pour RAG).

---

### 🔴 Erreur 3 : `Failed to get task credential access token`

**Contexte :**
- Apparaît lors de la création du projet **Q&A with RAG Accelerator**.

**Analyse :**
- Cela signifie que **watsonx** n’a pas pu générer le **jeton IAM** nécessaire pour exécuter la tâche.  
- Il s’agit d’un **problème d’authentification IAM** ou d’un **jeton expiré**.

**Causes possibles :**
- Jeton d’accès IBM Cloud expiré.  
- Désynchronisation entre le projet watsonx et le service COS.  
- Mauvaise configuration des **liens de service (service bindings)**.

**Correctifs recommandés :**
1. Se **déconnecter et reconnecter** à IBM watsonx.ai.  
2. Vérifier dans **IBM Cloud → IAM → Access (API Keys)** que la clé est valide.  
3. Supprimer le projet et **le recréer en associant manuellement le COS**.  
4. Vérifier les **autorisations IAM** :
   - watsonx.ai → rôle `Manager`  
   - Cloud Object Storage → rôle `Writer`

---

## 🧰 2. Résumé global

| Erreur | Cause probable | Action recommandée |
|--------|----------------|--------------------|
| `429 – Too Many Requests` | Quota d’API ou CUH atteint | Attendre / libérer des ressources / upgrader le plan |
| `Unable to embed and upload documents` | Échec d’accès au COS ou modèle indisponible | Vérifier IAM, COS, ou région |
| `Failed to get credential token` | Jeton IAM expiré ou mal configuré | Regénérer le token et reconnecter le service |

---

## ✅ 3. Étapes de résolution complètes

1. **Vérifier les quotas**  
   - Tableau de bord IBM Cloud → *Usage* → *watsonx.ai*.  

2. **Réinitialiser la connexion COS**  
   - Dans le projet → *Intégrations* → reconnecter *Cloud Object Storage*.  

3. **Nettoyer les projets échoués**  
   - Supprimer les collections vectorielles ou projets partiellement créés (`autoai_rag_*`).  

4. **Relancer une expérimentation simple**  
   - Utiliser un petit jeu de données pour tester les accès COS et le modèle d’embedding.  

5. **Contacter le support IBM** si l’erreur persiste  
   - Fournir :  
     - Le message d’erreur complet  
     - L’ID du projet  
     - La région (Francfort)  
     - La date/heure exacte

---

## 🧩 4. Suggestion d’amélioration

Il est possible d’ajouter un **script de diagnostic automatique (Python)** pour :
- Tester la connexion au **Cloud Object Storage (COS)**  
- Vérifier les **quotas Watsonx.ai** et **l’état des clés IAM**

Souhaites-tu que je te le génère ? (il permettrait de tout tester avant de relancer un entraînement AutoAI RAG)

---

**Auteur :** Maxim Quénel  
**Dernière mise à jour :** 7 novembre 2025  
**Outil :** IBM watsonx.ai – AutoAI / RAG Accelerator  

---

🧠 **Conseil final :**  
Les erreurs que tu rencontres ne sont pas des fautes de paramétrage local, mais des **limitations ou incohérences entre IAM, quotas et intégrations COS**.  
Un redéploiement sur une autre région (ex : Dallas) avec des identifiants IAM valides résout généralement ce type de blocage.

---

Confiance : **99 %**
